const db = require("../db");

module.exports.getAllJadwalDokter = async () => {
  const [rows] = await db.query("SELECT * FROM jadwal_dokter");
  return rows;
};

module.exports.getJadwalDokterById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM jadwal_dokter WHERE jadwal_id = ?",
    [id]
  );
  return rows;
};

module.exports.deleteJadwalDokter = async (id) => {
  const [{ affectedRows }] = await db.query(
    "DELETE FROM jadwal_dokter WHERE jadwal_id = ?",
    [id]
  );
  return affectedRows;
};

module.exports.addOrEditJadwalDokter = async (obj, id = 0) => {
  const [[[{ affectedRows }]]] = await db.query(
    "CALL jadwal_dokter_add_or_edit(?, ?, ?, ?, ?)",
    [id, obj.hari, obj.waktu_mulai, obj.waktu_selesai, obj.status]
  );
  return affectedRows;
};
