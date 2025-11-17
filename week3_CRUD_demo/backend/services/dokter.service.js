const db = require("../db");

module.exports.getAllDokter = async () => {
  const [rows] = await db.query("SELECT * FROM dokter");
  return rows;
};

module.exports.getDokterById = async (id) => {
  const [rows] = await db.query("SELECT * FROM dokter WHERE dokter_id = ?", [
    id,
  ]);
  return rows;
};

module.exports.deleteDokter = async (id) => {
  const [{ affectedRows }] = await db.query(
    "DELETE FROM dokter WHERE dokter_id = ?",
    [id]
  );
  return affectedRows;
};

module.exports.addOrEditDokter = async (obj, id = 0) => {
  const [[[{ affectedRows }]]] = await db.query(
    "CALL dokter_add_or_edit(?, ?, ?, ?, ?, ?)",
    [
      id,
      obj.nama_dokter,
      obj.spesialisasi,
      obj.no_telepon,
      obj.email,
      obj.password,
    ]
  );
  return affectedRows;
};
