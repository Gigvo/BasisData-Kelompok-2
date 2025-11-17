const express = require("express");
const router = express.Router();

const service = require("../services/janji_temu.service");

router.get("/", async (req, res) => {
  const janjiTemu = await service.getAllJanjiTemu();
  res.send(janjiTemu);
});

router.get("/:id", async (req, res) => {
  const janjiTemu = await service.getJanjiTemuById(req.params.id);
  if (janjiTemu.length === 0) {
    res.status(404).send({ message: "Janji Temu not found" });
  } else {
    res.send(janjiTemu);
  }
});

router.delete("/:id", async (req, res) => {
  const affectedRows = await service.deleteJanjiTemu(req.params.id);
  if (affectedRows === 0) {
    return res.status(404).send({ message: "Janji Temu not found" });
  } else {
    res.send({ message: "Janji Temu deleted successfully" });
  }
});

router.post("/", async (req, res) => {
  await service.addOrEditJanjiTemu(req.body);
  res.status(201).send({ message: "Janji Temu added successfully" });
});

router.put("/:id", async (req, res) => {
  const affectedRows = await service.addOrEditJanjiTemu(
    req.body,
    req.params.id
  );
  if (affectedRows === 0) {
    return res
      .status(404)
      .send({ message: "Janji Temu not found with id: " + req.params.id });
  } else {
    res.send({ message: "Janji Temu updated successfully" });
  }
});

module.exports = router;
