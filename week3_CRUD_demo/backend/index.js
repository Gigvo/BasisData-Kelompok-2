require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db");

const dokterRoutes = require("./controllers/dokter.controller");
const pasienRoutes = require("./controllers/pasien.controller");
const resepsionisRoutes = require("./controllers/resepsionis.controller");
const jadwalDokterRoutes = require("./controllers/jadwal_dokter.controller");
const janjiTemuRoutes = require("./controllers/janji_temu.controller");
const menetapkanRoutes = require("./controllers/menetapkan.controller");

//middleware
app.use(bodyParser.json());
app.use("/api/dokter", dokterRoutes);
app.use("/api/pasien", pasienRoutes);
app.use("/api/resepsionis", resepsionisRoutes);
app.use("/api/jadwaldokter", jadwalDokterRoutes);
app.use("/api/janjitemu", janjiTemuRoutes);
app.use("/api/menetapkan", menetapkanRoutes);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send("Something went wrong");
});

db.query("SELECT * FROM dokter")
  .then(() => {
    console.log("db connected");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => console.log("db connection failed: ", err));
