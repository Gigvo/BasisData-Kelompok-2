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
<<<<<<< HEAD
  if (id === 0) {
    const [result] = await db.query(
      "INSERT INTO Resepsionis (nama_resepsionis, email, no_telepon, password) VALUES (?, ?, ?, ?)",
      [obj.nama_resepsionis, obj.email, obj.no_telepon, obj.password]
    );
    return result.affectedRows;
  } else {
    const [result] = await db.query(
      "UPDATE Resepsionis SET nama_resepsionis = ?, email = ?, no_telepon = ?, password = ? WHERE resepsionis_id = ?",
      [obj.nama_resepsionis, obj.email, obj.no_telepon, obj.password, id]
    );
    return result.affectedRows;
  }
=======
  const [[[{ affectedRows }]]] = await db.query(
    "CALL resepsionis_add_or_edit(?, ?, ?, ?, ?)",
    [id, obj.nama_resepsionis, obj.email, obj.no_telepon, obj.password]
  );
  return affectedRows;
>>>>>>> ae571796c3e5edb65b3449bf4595636e541618d6
};
