const db = require("../db");

module.exports.getAllJanjiTemu = async () => {
  const [rows] = await db.query("SELECT * FROM janji_temu");
  return rows;
};

module.exports.getJanjiTemuById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM janji_temu WHERE janjitemu_id = ?",
    [id]
  );
  return rows;
};

module.exports.deleteJanjiTemu = async (id) => {
  const [{ affectedRows }] = await db.query(
    "DELETE FROM janji_temu WHERE janjitemu_id = ?",
    [id]
  );
  return affectedRows;
};

module.exports.addOrEditJanjiTemu = async (obj, id = 0) => {
  const [[[{ affectedRows }]]] = await db.query(
    "CALL janji_temu_add_or_edit(?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      obj.tanggal_janji,
      obj.keluhan,
      obj.status,
      obj.pasien_id,
      obj.resepsionis_id || null,
      obj.jadwal_id,
    ]
  );
  return affectedRows;
};
