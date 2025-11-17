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

DELIMITER $$

CREATE TRIGGER trigger_updateJanji
BEFORE UPDATE ON Janji_Temu
FOR EACH ROW
BEGIN
  SET NEW.updatedAt = NOW();
END$$

DELIMITER ;
