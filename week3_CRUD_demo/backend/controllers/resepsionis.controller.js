const express = require("express");
const router = express.Router();

const service = require("../services/resepsionis.service");

router.get("/", async (req, res) => {
  const resepsionis = await service.getAllResepsionis();
  res.send(resepsionis);
});

router.get("/:id", async (req, res) => {
  const resepsionis = await service.getResepsionisById(req.params.id);
  if (resepsionis.length === 0) {
    res.status(404).send({ message: "Resepsionis not found" });
  } else {
    res.send(resepsionis);
  }
});

router.delete("/:id", async (req, res) => {
  const affectedRows = await service.deleteResepsionis(req.params.id);
  if (affectedRows === 0) {
    return res.status(404).send({ message: "Resepsionis not found" });
  } else {
    res.send({ message: "Resepsionis deleted successfully" });
  }
});

router.post("/", async (req, res) => {
  await service.addOrEditResepsionis(req.body);
  res.status(201).send({ message: "Resepsionis added successfully" });
});

router.put("/:id", async (req, res) => {
  const affectedRows = await service.addOrEditResepsionis(
    req.body,
    req.params.id
  );
  if (affectedRows === 0) {
    return res
      .status(404)
      .send({ message: "Resepsionis not found with id: " + req.params.id });
  } else {
    res.send({ message: "Resepsionis updated successfully" });
  }
});

module.exports = router;
