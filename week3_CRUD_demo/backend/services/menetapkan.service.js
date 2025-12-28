const db = require("../db");

module.exports.getAllMenetapkan = async () => {
  const [rows] = await db.query("SELECT * FROM menetapkan");
  return rows;
};

module.exports.getMenetapkanByDokterAndJadwal = async (
  dokter_id,
  jadwal_id
) => {
  const [rows] = await db.query(
    "SELECT * FROM menetapkan WHERE dokter_id = ? AND jadwal_id = ?",
    [dokter_id, jadwal_id]
  );
  return rows;
};

module.exports.getMenetapkanByDokter = async (dokter_id) => {
  const [rows] = await db.query(
    "SELECT * FROM menetapkan WHERE dokter_id = ?",
    [dokter_id]
  );
  return rows;
};

module.exports.getMenetapkanByJadwal = async (jadwal_id) => {
  const [rows] = await db.query(
    "SELECT * FROM menetapkan WHERE jadwal_id = ?",
    [jadwal_id]
  );
  return rows;
};

module.exports.addMenetapkan = async (dokter_id, jadwal_id) => {
  const [result] = await db.query(
    "INSERT INTO menetapkan (dokter_id, jadwal_id) VALUES (?, ?)",
    [dokter_id, jadwal_id]
  );
  return result.affectedRows;
};

module.exports.deleteMenetapkan = async (dokter_id, jadwal_id) => {
  const [{ affectedRows }] = await db.query(
    "DELETE FROM menetapkan WHERE dokter_id = ? AND jadwal_id = ?",
    [dokter_id, jadwal_id]
  );
  return affectedRows;
};
