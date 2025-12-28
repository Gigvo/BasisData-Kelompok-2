const express = require("express");
const router = express.Router();
const janjiTemuService = require("../services/janji_temu.service");
const jadwalService = require("../services/jadwal_dokter.service");
const pasienService = require("../services/pasien.service");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

// Get all appointments (for resepsionis/admin)
router.get("/appointments", verifyToken, checkRole("resepsionis"), async (req, res) => {
  try {
    const appointments = await janjiTemuService.getAllAppointmentsDetailed();
    res.send(appointments);
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res.status(500).send({ message: "Failed to fetch appointments" });
  }
});

// Update appointment status manually
router.put("/appointments/:id/status", verifyToken, checkRole("resepsionis"), async (req, res) => {
  try {
    const janjitemu_id = req.params.id;
    const { status } = req.body;
    const resepsionis_id = req.user.id;

    // Validate status
    const validStatuses = ['Menunggu', 'Dikonfirmasi', 'Selesai', 'Dibatalkan'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).send({
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Get appointment details
    const appointment = await janjiTemuService.getJanjiTemuById(janjitemu_id);
    if (appointment.length === 0) {
      return res.status(404).send({ message: "Appointment not found" });
    }

    // Update appointment
    const updateData = {
      ...appointment[0],
      status: status,
      resepsionis_id: resepsionis_id // Track who updated it
    };

    const affectedRows = await janjiTemuService.addOrEditJanjiTemu(updateData, janjitemu_id);

    if (affectedRows > 0) {
      // Update schedule status based on appointment status
      if (status === 'Dibatalkan' || status === 'Selesai') {
        await jadwalService.updateScheduleStatus(appointment[0].jadwal_id, 'Tersedia');
      } else if (status === 'Dikonfirmasi' || status === 'Menunggu') {
        await jadwalService.updateScheduleStatus(appointment[0].jadwal_id, 'Penuh');
      }

      res.send({ message: "Appointment status updated successfully" });
    } else {
      res.status(500).send({ message: "Failed to update appointment status" });
    }
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).send({ message: "Failed to update appointment status" });
  }
});

// Create appointment on behalf of patient
router.post("/appointments/create-for-patient", verifyToken, checkRole("resepsionis"), async (req, res) => {
  try {
    const resepsionis_id = req.user.id;
    const { pasien_id, jadwal_id, tanggal_janji, keluhan, status } = req.body;

    // Validate required fields
    if (!pasien_id || !jadwal_id || !tanggal_janji || !keluhan) {
      return res.status(400).send({
        message: "pasien_id, jadwal_id, tanggal_janji, and keluhan are required"
      });
    }

    // Check if schedule exists
    const schedule = await jadwalService.getJadwalDokterById(jadwal_id);
    if (schedule.length === 0) {
      return res.status(404).send({ message: "Schedule not found" });
    }

    // Create appointment
    const appointmentData = {
      pasien_id,
      jadwal_id,
      tanggal_janji,
      keluhan,
      status: status || 'Dikonfirmasi', // Default to confirmed when created by resepsionis
      resepsionis_id
    };

    const affectedRows = await janjiTemuService.addOrEditJanjiTemu(appointmentData);

    if (affectedRows > 0) {
      // Update schedule status to 'Penuh'
      await jadwalService.updateScheduleStatus(jadwal_id, 'Penuh');

      res.status(201).send({
        message: "Appointment created successfully",
        status: appointmentData.status
      });
    } else {
      res.status(500).send({ message: "Failed to create appointment" });
    }
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).send({ message: "Failed to create appointment" });
  }
});

// Get all schedules (both available and unavailable)
router.get("/schedules/all", verifyToken, checkRole("resepsionis"), async (req, res) => {
  try {
    const schedules = await jadwalService.getAllSchedulesWithDoctors();
    res.send(schedules);
  } catch (error) {
    console.error("Error fetching all schedules:", error);
    res.status(500).send({ message: "Failed to fetch schedules" });
  }
});

// Get all patients
router.get("/patients", verifyToken, checkRole("resepsionis"), async (req, res) => {
  try {
    const patients = await pasienService.getAllPasien();
    // Remove password from response
    const sanitizedPatients = patients.map(p => {
      const { password, ...patientData } = p;
      return patientData;
    });
    res.send(sanitizedPatients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).send({ message: "Failed to fetch patients" });
  }
});

// Get all doctors (for reference)
router.get("/doctors", verifyToken, checkRole("resepsionis"), async (req, res) => {
  try {
    const dokterService = require("../services/dokter.service");
    const doctors = await dokterService.getAllDokter();
    // Remove password from response
    const sanitizedDoctors = doctors.map(d => {
      const { password, ...doctorData } = d;
      return doctorData;
    });
    res.send(sanitizedDoctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).send({ message: "Failed to fetch doctors" });
  }
});

module.exports = router;
