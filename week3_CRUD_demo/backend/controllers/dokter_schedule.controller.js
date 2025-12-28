const express = require("express");
const router = express.Router();
const jadwalService = require("../services/jadwal_dokter.service");
const menetapkanService = require("../services/menetapkan.service");
const janjiTemuService = require("../services/janji_temu.service");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

// Get all available schedules (for dokter to choose)
router.get("/available", verifyToken, checkRole("dokter"), async (req, res) => {
  try {
    const schedules = await jadwalService.getUnassignedAvailableSchedules();
    res.send(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).send({ message: "Failed to fetch schedules" });
  }
});

// Get schedules assigned to logged-in dokter
router.get("/my-schedules", verifyToken, checkRole("dokter"), async (req, res) => {
  try {
    const dokter_id = req.user.id;
    const schedules = await jadwalService.getSchedulesByDokter(dokter_id);
    res.send(schedules);
  } catch (error) {
    console.error("Error fetching doctor schedules:", error);
    res.status(500).send({ message: "Failed to fetch schedules" });
  }
});

// Assign dokter to a schedule
router.post("/assign", verifyToken, checkRole("dokter"), async (req, res) => {
  try {
    const dokter_id = req.user.id;
    const { jadwal_id } = req.body;

    if (!jadwal_id) {
      return res.status(400).send({ message: "jadwal_id is required" });
    }

    // Check if schedule exists
    const schedule = await jadwalService.getJadwalDokterById(jadwal_id);
    if (schedule.length === 0) {
      return res.status(404).send({ message: "Schedule not found" });
    }

    // Check if schedule status is 'Tersedia'
    if (schedule[0].status !== 'Tersedia') {
      return res.status(400).send({
        message: `Schedule is not available. Current status: ${schedule[0].status}`
      });
    }

    // Check if schedule is already assigned to another doctor
    const existingAssignment = await menetapkanService.getMenetapkanByJadwal(jadwal_id);
    if (existingAssignment.length > 0) {
      // Check if it's already assigned to the current doctor
      if (existingAssignment[0].dokter_id === dokter_id) {
        return res.status(409).send({ message: "You are already assigned to this schedule" });
      }
      return res.status(409).send({ message: "Schedule is already assigned to another doctor" });
    }

    // Assign doctor to schedule
    const affectedRows = await menetapkanService.addMenetapkan(dokter_id, jadwal_id);

    if (affectedRows > 0) {
      res.status(201).send({ message: "Successfully assigned to schedule" });
    } else {
      res.status(500).send({ message: "Failed to assign schedule" });
    }
  } catch (error) {
    console.error("Error assigning schedule:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).send({ message: "You are already assigned to this schedule" });
    } else {
      res.status(500).send({ message: "Failed to assign schedule" });
    }
  }
});

// Remove dokter from a schedule
router.delete("/unassign/:jadwal_id", verifyToken, checkRole("dokter"), async (req, res) => {
  try {
    const dokter_id = req.user.id;
    const jadwal_id = req.params.jadwal_id;

    const affectedRows = await menetapkanService.deleteMenetapkan(dokter_id, jadwal_id);

    if (affectedRows > 0) {
      res.send({ message: "Successfully removed from schedule" });
    } else {
      res.status(404).send({ message: "Assignment not found" });
    }
  } catch (error) {
    console.error("Error removing schedule:", error);
    res.status(500).send({ message: "Failed to remove schedule" });
  }
});

// Create a new shift and auto-assign to the creator
router.post("/create-shift", verifyToken, checkRole("dokter"), async (req, res) => {
  try {
    const dokter_id = req.user.id;
    const { hari, waktu_mulai, waktu_selesai } = req.body;

    // Validate required fields
    if (!hari || !waktu_mulai || !waktu_selesai) {
      return res.status(400).send({
        message: "hari, waktu_mulai, and waktu_selesai are required"
      });
    }

    // Validate hari is valid day of week
    const validDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    if (!validDays.includes(hari)) {
      return res.status(400).send({
        message: `Invalid day. Must be one of: ${validDays.join(', ')}`
      });
    }

    // Validate time format (HH:MM or HH:MM:SS)
    const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/;
    if (!timeRegex.test(waktu_mulai)) {
      return res.status(400).send({
        message: "waktu_mulai must be in HH:MM or HH:MM:SS format (e.g., '09:00' or '09:00:00')"
      });
    }
    if (!timeRegex.test(waktu_selesai)) {
      return res.status(400).send({
        message: "waktu_selesai must be in HH:MM or HH:MM:SS format (e.g., '17:00' or '17:00:00')"
      });
    }

    // Validate logical time range (end time must be after start time)
    const [startHour, startMin] = waktu_mulai.split(':').map(Number);
    const [endHour, endMin] = waktu_selesai.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) {
      return res.status(400).send({
        message: "waktu_selesai must be after waktu_mulai"
      });
    }

    // Create the schedule with status 'Tersedia'
    const scheduleData = {
      hari,
      waktu_mulai,
      waktu_selesai,
      status: 'Tersedia'
    };

    const jadwal_id = await jadwalService.createJadwalDokter(scheduleData);

    if (!jadwal_id) {
      return res.status(500).send({ message: "Failed to create schedule" });
    }

    // Automatically assign the shift to the doctor who created it
    const assignAffectedRows = await menetapkanService.addMenetapkan(dokter_id, jadwal_id);

    if (assignAffectedRows === 0) {
      console.error(`Failed to auto-assign jadwal_id ${jadwal_id} to dokter_id ${dokter_id}`);
      return res.status(500).send({
        message: "Schedule created but failed to assign to doctor"
      });
    }

    // Success response
    res.status(201).send({
      message: "Shift created and assigned successfully",
      data: {
        jadwal_id: jadwal_id,
        hari: hari,
        waktu_mulai: waktu_mulai,
        waktu_selesai: waktu_selesai,
        status: 'Tersedia',
        dokter_id: dokter_id
      }
    });

  } catch (error) {
    console.error("Error creating shift:", error);

    // Handle specific database errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).send({
        message: "A schedule with these exact details already exists"
      });
    }

    if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(400).send({
        message: "Invalid field in request"
      });
    }

    // Generic error
    res.status(500).send({
      message: "Failed to create shift",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get appointments for logged-in dokter
router.get("/my-appointments", verifyToken, checkRole("dokter"), async (req, res) => {
  try {
    const dokter_id = req.user.id;
    const appointments = await janjiTemuService.getAppointmentsByDokter(dokter_id);
    res.send(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).send({ message: "Failed to fetch appointments" });
  }
});

// Confirm appointment
router.put("/confirm-appointment/:id", verifyToken, checkRole("dokter"), async (req, res) => {
  try {
    const dokter_id = req.user.id;
    const janjitemu_id = req.params.id;

    // Get appointment details
    const appointment = await janjiTemuService.getJanjiTemuById(janjitemu_id);
    if (appointment.length === 0) {
      return res.status(404).send({ message: "Appointment not found" });
    }

    // Verify appointment belongs to this doctor's schedule
    const scheduleAssignment = await menetapkanService.getMenetapkanByJadwal(appointment[0].jadwal_id);
    if (scheduleAssignment.length === 0 || scheduleAssignment[0].dokter_id !== dokter_id) {
      return res.status(403).send({ message: "Unauthorized to confirm this appointment" });
    }

    // Only allow confirming if status is 'Menunggu'
    if (appointment[0].status !== 'Menunggu') {
      return res.status(400).send({
        message: `Cannot confirm appointment with status: ${appointment[0].status}`
      });
    }

    // Update status to 'Dikonfirmasi'
    const updateData = {
      ...appointment[0],
      status: 'Dikonfirmasi'
    };

    const affectedRows = await janjiTemuService.addOrEditJanjiTemu(updateData, janjitemu_id);

    if (affectedRows > 0) {
      res.send({ message: "Appointment confirmed successfully" });
    } else {
      res.status(500).send({ message: "Failed to confirm appointment" });
    }
  } catch (error) {
    console.error("Error confirming appointment:", error);
    res.status(500).send({ message: "Failed to confirm appointment" });
  }
});

// Cancel appointment by doctor
router.put("/cancel-appointment/:id", verifyToken, checkRole("dokter"), async (req, res) => {
  try {
    const dokter_id = req.user.id;
    const janjitemu_id = req.params.id;

    // Get appointment details
    const appointment = await janjiTemuService.getJanjiTemuById(janjitemu_id);
    if (appointment.length === 0) {
      return res.status(404).send({ message: "Appointment not found" });
    }

    // Verify appointment belongs to this doctor's schedule
    const scheduleAssignment = await menetapkanService.getMenetapkanByJadwal(appointment[0].jadwal_id);
    if (scheduleAssignment.length === 0 || scheduleAssignment[0].dokter_id !== dokter_id) {
      return res.status(403).send({ message: "Unauthorized to cancel this appointment" });
    }

    // Cannot cancel already completed appointments
    if (appointment[0].status === 'Selesai') {
      return res.status(400).send({ message: "Cannot cancel completed appointment" });
    }

    // Update status to 'Dibatalkan'
    const updateData = {
      ...appointment[0],
      status: 'Dibatalkan'
    };

    const affectedRows = await janjiTemuService.addOrEditJanjiTemu(updateData, janjitemu_id);

    if (affectedRows > 0) {
      // Update schedule status back to 'Tersedia'
      const jadwalService = require("../services/jadwal_dokter.service");
      await jadwalService.updateScheduleStatus(appointment[0].jadwal_id, 'Tersedia');

      res.send({ message: "Appointment cancelled successfully" });
    } else {
      res.status(500).send({ message: "Failed to cancel appointment" });
    }
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).send({ message: "Failed to cancel appointment" });
  }
});

// Mark appointment as completed
router.put("/complete-appointment/:id", verifyToken, checkRole("dokter"), async (req, res) => {
  try {
    const dokter_id = req.user.id;
    const janjitemu_id = req.params.id;

    // Get appointment details
    const appointment = await janjiTemuService.getJanjiTemuById(janjitemu_id);
    if (appointment.length === 0) {
      return res.status(404).send({ message: "Appointment not found" });
    }

    // Verify appointment belongs to this doctor's schedule
    const scheduleAssignment = await menetapkanService.getMenetapkanByJadwal(appointment[0].jadwal_id);
    if (scheduleAssignment.length === 0 || scheduleAssignment[0].dokter_id !== dokter_id) {
      return res.status(403).send({ message: "Unauthorized to complete this appointment" });
    }

    // Update status to 'Selesai'
    const updateData = {
      ...appointment[0],
      status: 'Selesai'
    };

    const affectedRows = await janjiTemuService.addOrEditJanjiTemu(updateData, janjitemu_id);

    if (affectedRows > 0) {
      // Update schedule status back to 'Tersedia'
      const jadwalService = require("../services/jadwal_dokter.service");
      await jadwalService.updateScheduleStatus(appointment[0].jadwal_id, 'Tersedia');

      res.send({ message: "Appointment marked as completed" });
    } else {
      res.status(500).send({ message: "Failed to complete appointment" });
    }
  } catch (error) {
    console.error("Error completing appointment:", error);
    res.status(500).send({ message: "Failed to complete appointment" });
  }
});

module.exports = router;
