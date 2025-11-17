const db = require("../db");

module.exports.getAllResepsionis = async () => {
  const [rows] = await db.query("SELECT * FROM resepsionis");
  return rows;
};

module.exports.getResepsionisById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM resepsionis WHERE resepsionis_id = ?",
    [id]
  );
  return rows;
};

module.exports.deleteResepsionis = async (id) => {
  const [{ affectedRows }] = await db.query(
    "DELETE FROM resepsionis WHERE resepsionis_id = ?",
    [id]
  );
  return affectedRows;
};

module.exports.addOrEditResepsionis = async (obj, id = 0) => {
  const [[[{ affectedRows }]]] = await db.query(
    "CALL resepsionis_add_or_edit(?, ?, ?, ?, ?)",
    [id, obj.nama_resepsionis, obj.email, obj.no_telepon, obj.password]
  );
  return affectedRows;
};
