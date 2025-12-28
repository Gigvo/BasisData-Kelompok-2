-- ==========================================
-- 1. DDL (Data Definition Language)
-- ==========================================

DROP TABLE IF EXISTS Menetapkan;
DROP TABLE IF EXISTS Janji_Temu;
DROP TABLE IF EXISTS Jadwal_Dokter;
DROP TABLE IF EXISTS Resepsionis;
DROP TABLE IF EXISTS Dokter;
DROP TABLE IF EXISTS Pasien;

CREATE TABLE Pasien
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

CREATE TABLE Dokter
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

CREATE TABLE Resepsionis
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

CREATE TABLE Jadwal_Dokter
(
  jadwal_id INT AUTO_INCREMENT NOT NULL,
  hari ENUM('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu') NOT NULL,
  waktu_mulai TIME NOT NULL,
  waktu_selesai TIME NOT NULL,
  status ENUM('Tersedia','Penuh','Libur') NOT NULL,
  PRIMARY KEY (jadwal_id)
);

CREATE TABLE Janji_Temu
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

CREATE TABLE Menetapkan
(
  dokter_id INT NOT NULL,
  jadwal_id INT NOT NULL,
  PRIMARY KEY (dokter_id, jadwal_id),
  FOREIGN KEY (dokter_id) REFERENCES Dokter(dokter_id),
  FOREIGN KEY (jadwal_id) REFERENCES Jadwal_Dokter(jadwal_id)
);

-- Note: Delimiters are removed/adjusted for standard import compatibility
-- If running in a client that supports delimiters, use them for triggers.
-- For simplicity, we omit the trigger here or assumes standard separator.
-- (Trigger logic: SET NEW.updatedAt = NOW();)

-- ==========================================
-- 2. DML (Data Manipulation Language) - Seed Data
-- ==========================================

-- 1. Insert Pasien (Patient)
INSERT INTO Pasien (nama_pasien, tanggal_lahir, jenis_kelamin, alamat, no_telepon, email, password) 
VALUES ('John Doe', '1990-05-15', 'Laki-laki', 'Jl. Merdeka No. 10, Jakarta', '081234567890', 'john.doe@email.com', 'password123');

-- 2. Insert Resepsionis
INSERT INTO Resepsionis (nama_resepsionis, email, no_telepon, password) 
VALUES ('Siti Aminah', 'siti.aminah@clinic.com', '081234002010', 'password123');

-- 3. Insert Dokter
INSERT INTO Dokter (nama_dokter, spesialisasi, no_telepon, email, password)
VALUES ('Dr. Budi Santoso', 'Umum', '081299998888', 'dr.budi@clinic.com', 'password123');

-- 4. Insert Jadwal Dokter (Schedule)
INSERT INTO Jadwal_Dokter (hari, waktu_mulai, waktu_selesai, status) 
VALUES ('Senin', '09:00:00', '12:00:00', 'Tersedia');

-- 5. Assign Dokter to Jadwal
-- Assuming IDs allow this (1 assigned to 1)
INSERT INTO Menetapkan (dokter_id, jadwal_id)
VALUES (1, 1);
