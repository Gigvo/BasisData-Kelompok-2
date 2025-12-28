/* 
  FULL DATABASE SETUP SCRIPT
  Includes:
  1. DDL (Table Creation) from Week 2
  2. DML (Initial Data) from Week 3
*/

-- ==========================================
-- 1. DDL: Create Tables (From Week 2)
-- ==========================================

CREATE TABLE IF NOT EXISTS Pasien
(
  pasien_id INT AUTO_INCREMENT NOT NULL,
  nama_pasien VARCHAR(100) NOT NULL,
  tanggal_lahir DATE NOT NULL,
  jenis_kelamin ENUM('Laki-laki', 'Perempuan') NOT NULL,
  alamat VARCHAR(255) NOT NULL,
  no_telepon VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (pasien_id),
  UNIQUE (no_telepon),
  UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS Dokter
(
  dokter_id INT AUTO_INCREMENT NOT NULL,
  nama_dokter VARCHAR(100) NOT NULL,
  spesialisasi VARCHAR(100) NOT NULL,
  no_telepon VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (dokter_id),
  UNIQUE (no_telepon),
  UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS Resepsionis
(
  resepsionis_id INT AUTO_INCREMENT NOT NULL,
  nama_resepsionis VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  no_telepon VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (resepsionis_id),
  UNIQUE (email),
  UNIQUE (no_telepon)
);

CREATE TABLE IF NOT EXISTS Jadwal_Dokter
(
  jadwal_id INT AUTO_INCREMENT NOT NULL,
  hari ENUM('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu') NOT NULL,
  waktu_mulai TIME NOT NULL,
  waktu_selesai TIME NOT NULL,
  status ENUM('Tersedia','Penuh','Libur') NOT NULL,
  PRIMARY KEY (jadwal_id)
);

CREATE TABLE IF NOT EXISTS Janji_Temu
(
  janjitemu_id INT AUTO_INCREMENT NOT NULL,
  tanggal_janji DATE NOT NULL,
  keluhan TEXT NOT NULL,
  status ENUM('Menunggu','Dikonfirmasi','Selesai','Dibatalkan') NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NULL,
  pasien_id INT NOT NULL,
  resepsionis_id INT,
  jadwal_id INT NOT NULL,

  PRIMARY KEY (janjitemu_id),
  UNIQUE (tanggal_janji, jadwal_id),
  FOREIGN KEY (pasien_id) REFERENCES Pasien(pasien_id),
  FOREIGN KEY (resepsionis_id) REFERENCES Resepsionis(resepsionis_id),
  FOREIGN KEY (jadwal_id) REFERENCES Jadwal_Dokter(jadwal_id)
);

CREATE TABLE IF NOT EXISTS Menetapkan
(
  dokter_id INT NOT NULL,
  jadwal_id INT NOT NULL,
  PRIMARY KEY (dokter_id, jadwal_id),
  FOREIGN KEY (dokter_id) REFERENCES Dokter(dokter_id),
  FOREIGN KEY (jadwal_id) REFERENCES Jadwal_Dokter(jadwal_id)
);

DELIMITER $$

CREATE TRIGGER trigger_updateJanji
BEFORE UPDATE ON Janji_Temu
FOR EACH ROW
BEGIN
  SET NEW.updatedAt = NOW();
END$$

DELIMITER ;

-- ==========================================
-- 2. DML: Initial Info (From Week 3)
-- ==========================================

-- Insert Sample Pasien
INSERT INTO Pasien (nama_pasien, tanggal_lahir, jenis_kelamin, alamat, no_telepon, email, password) 
VALUES ('John Doe', '1990-05-15', 'Laki-laki', 'Jl. Merdeka No. 10, Jakarta', '081234567890', 'john.doe@email.com', 'password123');

-- Insert Sample Resepsionis
INSERT INTO Resepsionis (nama_resepsionis, email, no_telepon, password) 
VALUES ('Siti Aminah', 'siti.aminah@clinic.com', '081234002010', 'password123');

-- Insert Sample Jadwal
INSERT INTO Jadwal_Dokter (hari, waktu_mulai, waktu_selesai, status) 
VALUES ('Senin', '08:00:00', '12:00:00', 'Tersedia');

-- (Optional) Example Selects
-- SELECT * FROM Pasien WHERE pasien_id = 1;
-- SELECT * FROM Dokter WHERE spesialisasi = 'Kardiologi';
-- SELECT * FROM Janji_Temu WHERE status = 'Menunggu';
