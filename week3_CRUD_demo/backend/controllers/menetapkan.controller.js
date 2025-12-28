const express = require("express");
const router = express.Router();

const service = require("../services/menetapkan.service");

router.get("/", async (req, res) => {
  const menetapkan = await service.getAllMenetapkan();
  res.send(menetapkan);
});

router.get("/dokter/:dokter_id", async (req, res) => {
  const menetapkan = await service.getMenetapkanByDokter(req.params.dokter_id);
  if (menetapkan.length === 0) {
    res.status(404).send({ message: "Menetapkan not found for this dokter" });
  } else {
    res.send(menetapkan);
  }
});

router.get("/jadwal/:jadwal_id", async (req, res) => {
  const menetapkan = await service.getMenetapkanByJadwal(req.params.jadwal_id);
  if (menetapkan.length === 0) {
    res.status(404).send({ message: "Menetapkan not found for this jadwal" });
  } else {
    res.send(menetapkan);
  }
});

router.get("/:dokter_id/:jadwal_id", async (req, res) => {
  const menetapkan = await service.getMenetapkanByDokterAndJadwal(
    req.params.dokter_id,
    req.params.jadwal_id
  );
  if (menetapkan.length === 0) {
    res.status(404).send({ message: "Menetapkan not found" });
  } else {
    res.send(menetapkan);
  }
});

// router.post("/", async (req, res) => {
//   await service.addMenetapkan(req.body.dokter_id, req.body.jadwal_id);
//   res.status(201).send({ message: "Menetapkan added successfully" });
// });

// router.delete("/:dokter_id/:jadwal_id", async (req, res) => {
//   const affectedRows = await service.deleteMenetapkan(
//     req.params.dokter_id,
//     req.params.jadwal_id
//   );
//   if (affectedRows === 0) {
//     return res.status(404).send({ message: "Menetapkan not found" });
//   } else {
//     res.send({ message: "Menetapkan deleted successfully" });
//   }
// });

module.exports = router;
