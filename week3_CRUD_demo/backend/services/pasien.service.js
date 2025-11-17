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
  const [[[{ affectedRows }]]] = await db.query(
    "CALL pasien_add_or_edit(?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      obj.nama_pasien,
      obj.tanggal_lahir,
      obj.jenis_kelamin,
      obj.alamat,
      obj.no_telepon,
      obj.email,
      obj.password,
    ]
  );
  return affectedRows;
};
