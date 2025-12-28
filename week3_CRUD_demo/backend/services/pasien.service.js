const db = require("../db");

module.exports.getAllPasien = async () => {
  const [rows] = await db.query("SELECT * FROM pasien");
  return rows;
};

module.exports.getPasienById = async (id) => {
  const [rows] = await db.query("SELECT * FROM pasien WHERE pasien_id = ?", [
    id,
  ]);
  return rows;
};

module.exports.deletePasien = async (id) => {
  const [{ affectedRows }] = await db.query(
    "DELETE FROM pasien WHERE pasien_id = ?",
    [id]
  );
  return affectedRows;
};

module.exports.addOrEditPasien = async (obj, id = 0) => {
  if (id === 0) {
    const [result] = await db.query(
      "INSERT INTO Pasien (nama_pasien, tanggal_lahir, jenis_kelamin, alamat, no_telepon, email, password) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        obj.nama_pasien,
        obj.tanggal_lahir,
        obj.jenis_kelamin,
        obj.alamat,
        obj.no_telepon,
        obj.email,
        obj.password,
      ]
    );
    return result.affectedRows;
  } else {
    const [result] = await db.query(
      "UPDATE Pasien SET nama_pasien = ?, tanggal_lahir = ?, jenis_kelamin = ?, alamat = ?, no_telepon = ?, email = ?, password = ? WHERE pasien_id = ?",
      [
        obj.nama_pasien,
        obj.tanggal_lahir,
        obj.jenis_kelamin,
        obj.alamat,
        obj.no_telepon,
        obj.email,
        obj.password,
        id
      ]
    );
    return result.affectedRows;
  }
};
