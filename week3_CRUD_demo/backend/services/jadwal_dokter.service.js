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
<<<<<<< HEAD
  if (id === 0) {
    const [result] = await db.query(
      "INSERT INTO Jadwal_Dokter (hari, waktu_mulai, waktu_selesai, status) VALUES (?, ?, ?, ?)",
      [obj.hari, obj.waktu_mulai, obj.waktu_selesai, obj.status]
    );
    return result.affectedRows;
  } else {
    const [result] = await db.query(
      "UPDATE Jadwal_Dokter SET hari = ?, waktu_mulai = ?, waktu_selesai = ?, status = ? WHERE jadwal_id = ?",
      [obj.hari, obj.waktu_mulai, obj.waktu_selesai, obj.status, id]
    );
    return result.affectedRows;
  }
=======
  const [[[{ affectedRows }]]] = await db.query(
    "CALL jadwal_dokter_add_or_edit(?, ?, ?, ?, ?)",
    [id, obj.hari, obj.waktu_mulai, obj.waktu_selesai, obj.status]
  );
  return affectedRows;
>>>>>>> ae571796c3e5edb65b3449bf4595636e541618d6
};

// Get available schedules with doctor information
module.exports.getAvailableSchedulesWithDoctors = async () => {
  const [rows] = await db.query(`
    SELECT
      jd.jadwal_id,
      jd.hari,
      jd.waktu_mulai,
      jd.waktu_selesai,
      jd.status,
      d.dokter_id,
      d.nama_dokter,
      d.spesialisasi
    FROM jadwal_dokter jd
    LEFT JOIN menetapkan m ON jd.jadwal_id = m.jadwal_id
    LEFT JOIN dokter d ON m.dokter_id = d.dokter_id
    WHERE jd.status = 'Tersedia'
    ORDER BY
      FIELD(jd.hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'),
      jd.waktu_mulai
  `);
  return rows;
};

// Get schedules by doctor ID
module.exports.getSchedulesByDokter = async (dokter_id) => {
  const [rows] = await db.query(`
    SELECT
      jd.jadwal_id,
      jd.hari,
      jd.waktu_mulai,
      jd.waktu_selesai,
      jd.status
    FROM jadwal_dokter jd
    INNER JOIN menetapkan m ON jd.jadwal_id = m.jadwal_id
    WHERE m.dokter_id = ?
    ORDER BY
      FIELD(jd.hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'),
      jd.waktu_mulai
  `, [dokter_id]);
  return rows;
};

// Update schedule status
module.exports.updateScheduleStatus = async (jadwal_id, status) => {
  const [{ affectedRows }] = await db.query(
    "UPDATE jadwal_dokter SET status = ? WHERE jadwal_id = ?",
    [status, jadwal_id]
  );
  return affectedRows;
};

// Get unassigned schedules that are available for doctors to join
module.exports.getUnassignedAvailableSchedules = async () => {
  const [rows] = await db.query(`
    SELECT
      jd.jadwal_id,
      jd.hari,
      jd.waktu_mulai,
      jd.waktu_selesai,
      jd.status
    FROM jadwal_dokter jd
    LEFT JOIN menetapkan m ON jd.jadwal_id = m.jadwal_id
    WHERE jd.status = 'Tersedia' AND m.jadwal_id IS NULL
    ORDER BY
      FIELD(jd.hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'),
      jd.waktu_mulai
  `);
  return rows;
};

// Get all schedules with doctor information (for resepsionis/admin)
module.exports.getAllSchedulesWithDoctors = async () => {
  const [rows] = await db.query(`
    SELECT
      jd.jadwal_id,
      jd.hari,
      jd.waktu_mulai,
      jd.waktu_selesai,
      jd.status,
      d.dokter_id,
      d.nama_dokter,
      d.spesialisasi
    FROM jadwal_dokter jd
    LEFT JOIN menetapkan m ON jd.jadwal_id = m.jadwal_id
    LEFT JOIN dokter d ON m.dokter_id = d.dokter_id
    ORDER BY
      FIELD(jd.hari, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'),
      jd.waktu_mulai
  `);
  return rows;
};
