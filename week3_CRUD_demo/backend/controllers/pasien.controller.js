const express = require("express");
const router = express.Router();

const service = require("../services/pasien.service");

router.get("/", async (req, res) => {
  const pasien = await service.getAllPasien();
  res.send(pasien);
});

router.get("/:id", async (req, res) => {
  const pasien = await service.getPasienById(req.params.id);
  if (pasien.length === 0) {
    res.status(404).send({ message: "Pasien not found" });
  } else {
    res.send(pasien);
  }
});

router.delete("/:id", async (req, res) => {
  const affectedRows = await service.deletePasien(req.params.id);
  if (affectedRows === 0) {
    return res.status(404).send({ message: "Pasien not found" });
  } else {
    res.send({ message: "Pasien deleted successfully" });
  }
});

router.post("/", async (req, res) => {
  await service.addOrEditPasien(req.body);
  res.status(201).send({ message: "Pasien added successfully" });
});

router.put("/:id", async (req, res) => {
  const affectedRows = await service.addOrEditPasien(req.body, req.params.id);
  if (affectedRows === 0) {
    return res
      .status(404)
      .send({ message: "Pasien not found with id: " + req.params.id });
  } else {
    res.send({ message: "Pasien updated successfully" });
  }
});

module.exports = router;
