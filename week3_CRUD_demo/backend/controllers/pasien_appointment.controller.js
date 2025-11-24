const express = require("express");
const router = express.Router();
const jadwalService = require("../services/jadwal_dokter.service");
const janjiTemuService = require("../services/janji_temu.service");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

// Get available schedules with doctors for pasien to book
router.get("/available-schedules", verifyToken, checkRole("pasien"), async (req, res) => {
  try {
    const schedules = await jadwalService.getAvailableSchedulesWithDoctors();
    res.send(schedules);
  } catch (error) {
    console.error("Error fetching available schedules:", error);
    res.status(500).send({ message: "Failed to fetch available schedules" });
  }
});

// Get appointments for logged-in pasien
router.get("/my-appointments", verifyToken, checkRole("pasien"), async (req, res) => {
  try {
    const pasien_id = req.user.id;
    const appointments = await janjiTemuService.getAppointmentsByPasien(pasien_id);
    res.send(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).send({ message: "Failed to fetch appointments" });
  }
});

// Create appointment for pasien
router.post("/create", verifyToken, checkRole("pasien"), async (req, res) => {
  try {
    const pasien_id = req.user.id;
    const { jadwal_id, tanggal_janji, keluhan } = req.body;

    // Validate required fields
    if (!jadwal_id || !tanggal_janji || !keluhan) {
      return res.status(400).send({
        message: "jadwal_id, tanggal_janji, and keluhan are required"
      });
    }

    // Check if schedule exists and is available
    const schedule = await jadwalService.getJadwalDokterById(jadwal_id);
    if (schedule.length === 0) {
      return res.status(404).send({ message: "Schedule not found" });
    }

    if (schedule[0].status !== 'Tersedia') {
      return res.status(400).send({ message: "Schedule is not available" });
    }

    // Create appointment with status 'Menunggu'
    const appointmentData = {
      pasien_id,
      jadwal_id,
      tanggal_janji,
      keluhan,
      status: 'Menunggu',
      resepsionis_id: null
    };

    const affectedRows = await janjiTemuService.addOrEditJanjiTemu(appointmentData);

    if (affectedRows > 0) {
      // Update schedule status to 'Penuh'
      await jadwalService.updateScheduleStatus(jadwal_id, 'Penuh');

      res.status(201).send({
        message: "Appointment created successfully",
        status: "Menunggu"
      });
    } else {
      res.status(500).send({ message: "Failed to create appointment" });
    }
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).send({ message: "Failed to create appointment" });
  }
});

// Cancel appointment
router.put("/cancel/:id", verifyToken, checkRole("pasien"), async (req, res) => {
  try {
    const pasien_id = req.user.id;
    const janjitemu_id = req.params.id;

    // Get appointment details
    const appointment = await janjiTemuService.getJanjiTemuById(janjitemu_id);
    if (appointment.length === 0) {
      return res.status(404).send({ message: "Appointment not found" });
    }

    // Check if appointment belongs to the logged-in pasien
    if (appointment[0].pasien_id !== pasien_id) {
      return res.status(403).send({ message: "Unauthorized to cancel this appointment" });
    }

    // Update appointment status to 'Dibatalkan'
    const updateData = {
      ...appointment[0],
      status: 'Dibatalkan'
    };

    const affectedRows = await janjiTemuService.addOrEditJanjiTemu(updateData, janjitemu_id);

    if (affectedRows > 0) {
      // Update schedule status back to 'Tersedia'
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

module.exports = router;
