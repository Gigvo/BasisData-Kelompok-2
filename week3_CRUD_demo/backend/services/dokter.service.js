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
<<<<<<< HEAD
  if (id === 0) {
    const [result] = await db.query(
      "INSERT INTO Dokter (nama_dokter, spesialisasi, no_telepon, email, password) VALUES (?, ?, ?, ?, ?)",
      [
        obj.nama_dokter,
        obj.spesialisasi,
        obj.no_telepon,
        obj.email,
        obj.password,
      ]
    );
    return result.affectedRows;
  } else {
    const [result] = await db.query(
      "UPDATE Dokter SET nama_dokter = ?, spesialisasi = ?, no_telepon = ?, email = ?, password = ? WHERE dokter_id = ?",
      [
        obj.nama_dokter, 
        obj.spesialisasi, 
        obj.no_telepon, 
        obj.email, 
        obj.password,
        id
      ]
    );
    return result.affectedRows;
  }
=======
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
>>>>>>> ae571796c3e5edb65b3449bf4595636e541618d6
};
