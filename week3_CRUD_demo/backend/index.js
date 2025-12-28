require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const dokterRoutes = require("./controllers/dokter.controller");
const pasienRoutes = require("./controllers/pasien.controller");
const resepsionisRoutes = require("./controllers/resepsionis.controller");
const jadwalDokterRoutes = require("./controllers/jadwal_dokter.controller");
const janjiTemuRoutes = require("./controllers/janji_temu.controller");
const menetapkanRoutes = require("./controllers/menetapkan.controller");
const authRoutes = require("./controllers/auth.controller");
const dokterScheduleRoutes = require("./controllers/dokter_schedule.controller");
const pasienAppointmentRoutes = require("./controllers/pasien_appointment.controller");
const resepsionisAdminRoutes = require("./controllers/resepsionis_admin.controller");

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/dokter", dokterRoutes);
app.use("/api/dokter-schedule", dokterScheduleRoutes);
app.use("/api/pasien", pasienRoutes);
app.use("/api/pasien-appointment", pasienAppointmentRoutes);
app.use("/api/resepsionis", resepsionisRoutes);
app.use("/api/resepsionis-admin", resepsionisAdminRoutes);
app.use("/api/jadwaldokter", jadwalDokterRoutes);
app.use("/api/janjitemu", janjiTemuRoutes);
app.use("/api/menetapkan", menetapkanRoutes);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send("Something went wrong");
});

// Auto-complete past appointments scheduler
const janjiTemuService = require("./services/janji_temu.service");

// Run auto-complete on server start
janjiTemuService.autoCompletePastAppointments()
  .then((result) => {
    console.log(`Auto-completed ${result.completed} past appointments on startup`);
  })
  .catch((err) => console.error("Error auto-completing appointments on startup:", err));

// Run auto-complete every 30 minutes
setInterval(async () => {
  try {
    const result = await janjiTemuService.autoCompletePastAppointments();
    if (result.completed > 0) {
      console.log(`Auto-completed ${result.completed} past appointments`);
    }
  } catch (err) {
    console.error("Error in auto-complete scheduler:", err);
  }
}, 30 * 60 * 1000); // 30 minutes in milliseconds

db.query("SELECT * FROM dokter")
  .then(() => {
    console.log("db connected");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => console.log("db connection failed: ", err));
