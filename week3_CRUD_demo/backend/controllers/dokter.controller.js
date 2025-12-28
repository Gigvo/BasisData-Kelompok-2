const express = require("express");
const router = express.Router();

const service = require("../services/dokter.service");

router.get("/", async (req, res) => {
  const dokter = await service.getAllDokter();
  res.send(dokter);
});

router.get("/:id", async (req, res) => {
  const dokter = await service.getDokterById(req.params.id);
  if (dokter.length === 0) {
    res.status(404).send({ message: "Dokter not found" });
  } else {
    res.send(dokter);
  }
});

router.delete("/:id", async (req, res) => {
  const affectedRows = await service.deleteDokter(req.params.id);
  console.log(affectedRows);
  if (affectedRows === 0) {
    return res.status(404).send({ message: "Dokter not found" });
  } else {
    res.send({ message: "Dokter deleted successfully" });
  }
});

router.post("/", async (req, res) => {
  try {
    await service.addOrEditDokter(req.body);
    res.status(201).send({ message: "Dokter added successfully" });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).send({ message: "Phone number or email already exists" });
    } else {
      res.status(500).send({ message: "Error adding dokter", error: error.message });
    }
  }
});

router.put("/:id", async (req, res) => {
  try {
    const affectedRows = await service.addOrEditDokter(req.body, req.params.id);
    if (affectedRows === 0) {
      return res
        .status(404)
        .send({ message: "Dokter not found with id: " + req.params.id });
    } else {
      res.send({ message: "Dokter updated successfully" });
    }
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).send({ message: "Phone number or email already exists" });
    } else {
      res.status(500).send({ message: "Error updating dokter", error: error.message });
    }
  }
});

module.exports = router;
