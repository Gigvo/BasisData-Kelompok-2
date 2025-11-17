const express = require("express");
const router = express.Router();

const service = require("../services/jadwal_dokter.service");

router.get("/", async (req, res) => {
  const jadwalDokter = await service.getAllJadwalDokter();
  res.send(jadwalDokter);
});

router.get("/:id", async (req, res) => {
  const jadwalDokter = await service.getJadwalDokterById(req.params.id);
  if (jadwalDokter.length === 0) {
    res.status(404).send({ message: "Jadwal Dokter not found" });
  } else {
    res.send(jadwalDokter);
  }
});

router.delete("/:id", async (req, res) => {
  const affectedRows = await service.deleteJadwalDokter(req.params.id);
  if (affectedRows === 0) {
    return res.status(404).send({ message: "Jadwal Dokter not found" });
  } else {
    res.send({ message: "Jadwal Dokter deleted successfully" });
  }
});

router.post("/", async (req, res) => {
  await service.addOrEditJadwalDokter(req.body);
  res.status(201).send({ message: "Jadwal Dokter added successfully" });
});

router.put("/:id", async (req, res) => {
  const affectedRows = await service.addOrEditJadwalDokter(
    req.body,
    req.params.id
  );
  if (affectedRows === 0) {
    return res
      .status(404)
      .send({ message: "Jadwal Dokter not found with id: " + req.params.id });
  } else {
    res.send({ message: "Jadwal Dokter updated successfully" });
  }
});

module.exports = router;
