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
<<<<<<< HEAD
  if (id === 0) {
    const [result] = await db.query(
      "INSERT INTO Janji_Temu (tanggal_janji, keluhan, status, pasien_id, resepsionis_id, jadwal_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        obj.tanggal_janji,
        obj.keluhan,
        obj.status,
        obj.pasien_id,
        obj.resepsionis_id || null,
        obj.jadwal_id,
      ]
    );
    return result.affectedRows;
  } else {
    const [result] = await db.query(
      "UPDATE Janji_Temu SET tanggal_janji = ?, keluhan = ?, status = ?, pasien_id = ?, resepsionis_id = ?, jadwal_id = ? WHERE janjitemu_id = ?",
      [
        obj.tanggal_janji,
        obj.keluhan,
        obj.status,
        obj.pasien_id,
        obj.resepsionis_id || null,
        obj.jadwal_id,
        id
      ]
    );
    return result.affectedRows;
  }
=======
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
>>>>>>> ae571796c3e5edb65b3449bf4595636e541618d6
};

// Get appointments by doctor ID
module.exports.getAppointmentsByDokter = async (dokter_id) => {
  const [rows] = await db.query(`
    SELECT
      jt.janjitemu_id,
      jt.tanggal_janji,
      jt.keluhan,
      jt.status,
      jt.createdAt,
      jt.updatedAt,
      p.pasien_id,
      p.nama_pasien,
      p.jenis_kelamin,
      p.no_telepon AS pasien_telepon,
      jd.jadwal_id,
      jd.hari,
      jd.waktu_mulai,
      jd.waktu_selesai
    FROM janji_temu jt
    INNER JOIN pasien p ON jt.pasien_id = p.pasien_id
    INNER JOIN jadwal_dokter jd ON jt.jadwal_id = jd.jadwal_id
    INNER JOIN menetapkan m ON jd.jadwal_id = m.jadwal_id
    WHERE m.dokter_id = ?
    ORDER BY jt.tanggal_janji DESC, jd.waktu_mulai DESC
  `, [dokter_id]);
  return rows;
};

// Get appointments by patient ID
module.exports.getAppointmentsByPasien = async (pasien_id) => {
  const [rows] = await db.query(`
    SELECT
      jt.janjitemu_id,
      jt.tanggal_janji,
      jt.keluhan,
      jt.status,
      jt.createdAt,
      jt.updatedAt,
      jd.jadwal_id,
      jd.hari,
      jd.waktu_mulai,
      jd.waktu_selesai,
      d.dokter_id,
      d.nama_dokter,
      d.spesialisasi
    FROM janji_temu jt
    INNER JOIN jadwal_dokter jd ON jt.jadwal_id = jd.jadwal_id
    INNER JOIN menetapkan m ON jd.jadwal_id = m.jadwal_id
    INNER JOIN dokter d ON m.dokter_id = d.dokter_id
    WHERE jt.pasien_id = ?
    ORDER BY jt.tanggal_janji DESC, jd.waktu_mulai DESC
  `, [pasien_id]);
  return rows;
};

// Auto-complete past appointments
module.exports.autoCompletePastAppointments = async () => {
  try {
    // Get all appointments that are past their date and time
    const [appointments] = await db.query(`
      SELECT
        jt.janjitemu_id,
        jt.jadwal_id,
        jt.tanggal_janji,
        jt.status,
        jd.waktu_selesai
      FROM janji_temu jt
      INNER JOIN jadwal_dokter jd ON jt.jadwal_id = jd.jadwal_id
      WHERE jt.status IN ('Menunggu', 'Dikonfirmasi')
      AND CONCAT(jt.tanggal_janji, ' ', jd.waktu_selesai) < NOW()
    `);

    let completedCount = 0;
    const jadwalService = require("./jadwal_dokter.service");

    // Update each past appointment to 'Selesai'
    for (const appointment of appointments) {
      const [result] = await db.query(
        "UPDATE janji_temu SET status = 'Selesai' WHERE janjitemu_id = ?",
        [appointment.janjitemu_id]
      );

      if (result.affectedRows > 0) {
        completedCount++;
        // Update schedule status back to 'Tersedia'
        await jadwalService.updateScheduleStatus(appointment.jadwal_id, 'Tersedia');
      }
    }

    return {
      total: appointments.length,
      completed: completedCount
    };
  } catch (error) {
    console.error("Error auto-completing appointments:", error);
    throw error;
  }
};

// Get all appointments with detailed information (for resepsionis/admin)
module.exports.getAllAppointmentsDetailed = async () => {
  const [rows] = await db.query(`
    SELECT
      jt.janjitemu_id,
      jt.tanggal_janji,
      jt.keluhan,
      jt.status,
      jt.createdAt,
      jt.updatedAt,
      p.pasien_id,
      p.nama_pasien,
      p.jenis_kelamin,
      p.no_telepon AS pasien_telepon,
      p.email AS pasien_email,
      jd.jadwal_id,
      jd.hari,
      jd.waktu_mulai,
      jd.waktu_selesai,
      jd.status AS jadwal_status,
      d.dokter_id,
      d.nama_dokter,
      d.spesialisasi,
      r.resepsionis_id,
      r.nama_resepsionis
    FROM janji_temu jt
    INNER JOIN pasien p ON jt.pasien_id = p.pasien_id
    INNER JOIN jadwal_dokter jd ON jt.jadwal_id = jd.jadwal_id
    LEFT JOIN menetapkan m ON jd.jadwal_id = m.jadwal_id
    LEFT JOIN dokter d ON m.dokter_id = d.dokter_id
    LEFT JOIN resepsionis r ON jt.resepsionis_id = r.resepsionis_id
    ORDER BY jt.tanggal_janji DESC, jd.waktu_mulai DESC
  `);
  return rows;
};
