INSERT INTO Janji_Temu (tanggal_janji, keluhan, status, pasien_id, resepsionis_id, jadwal_id) VALUES

('2025-11-24', 'Demam tinggi selama 3 hari, batuk berdahak', 'Dikonfirmasi', 1, 1, 1),
('2025-11-25', 'Flu dan sakit kepala', 'Dikonfirmasi', 2, 1, 2),


('2025-11-26', 'Nyeri dada saat beraktivitas, sesak napas', 'Dikonfirmasi', 3, 2, 3),
('2025-11-27', 'Kontrol jantung rutin', 'Dikonfirmasi', 4, 2, 6),


('2025-11-26', 'Sakit lutut kanan setelah jatuh', 'Dikonfirmasi', 5, 3, 4),
('2025-11-28', 'Nyeri punggung bawah', 'Dikonfirmasi', 6, 3, 8),


('2025-11-27', 'Gatal-gatal dan ruam di kulit wajah', 'Dikonfirmasi', 7, 4, 5),


('2025-11-25', 'Anak demam 2 hari, muntah-muntah', 'Dikonfirmasi', 8, 1, 3);

INSERT INTO Pasien (nama_pasien, tanggal_lahir, jenis_kelamin, alamat, no_telepon, email, password) VALUES
('Rahmat Hidayat', '1986-03-12', 'Laki-laki', 'Jl. Pancasila No. 56, Bekasi', '081298765432', 'rahmat.hidayat@email.com', 'password123'),
('Sari Indah', '1992-11-08', 'Perempuan', 'Jl. Raya Bogor No. 234, Depok', '082187654321', 'sari.indah@email.com', 'password123'),
('Fajar Nugroho', '1994-01-20', 'Laki-laki', 'Jl. Sisingamangaraja No. 89, Tangerang', '083276543210', 'fajar.nugroho@email.com', 'password123'),
('Nuraini Putri', '1990-09-15', 'Perempuan', 'Jl. Asia Afrika No. 12, Surakarta', '084365432109', 'nuraini.putri@email.com', 'password123'),
('Bambang Setiawan', '1988-07-03', 'Laki-laki', 'Jl. Gajah Mada No. 45, Pontianak', '085454321098', 'bambang.setiawan@email.com', 'password123'),
('Fitria Maharani', '1996-12-28', 'Perempuan', 'Jl. Hayam Wuruk No. 78, Balikpapan', '086543210987', 'fitria.maharani@email.com', 'password123'),
('Hendra Wijaya', '1991-04-17', 'Laki-laki', 'Jl. Thamrin No. 123, Makassar', '087632109876', 'hendra.wijaya@email.com', 'password123');


INSERT INTO Menetapkan (dokter_id, jadwal_id) VALUES
(2, 1),  
(2, 2),  
(2, 9);  


INSERT INTO Menetapkan (dokter_id, jadwal_id) VALUES
(3, 3), 
(3, 6); 


INSERT INTO Menetapkan (dokter_id, jadwal_id) VALUES
(4, 4), 
(4, 8); 


INSERT INTO Menetapkan (dokter_id, jadwal_id) VALUES
(5, 5), 
(5, 10);

INSERT INTO Resepsionis (nama_resepsionis, email, no_telepon, password) VALUES
('Ani Purwanti', 'ani.purwanti@clinic.com', '081234002001', 'password123'),
('Santi Wijaya', 'santi.wijaya@clinic.com', '081234002002', 'password123'),
('Rina Susanti', 'rina.susanti@clinic.com', '081234002003', 'password123'),
('Dian Puspita', 'dian.puspita@clinic.com', '081234002004', 'password123'),
('Lina Marlina', 'lina.marlina@clinic.com', '081234002005', 'password123');

INSERT INTO Jadwal_Dokter (hari, waktu_mulai, waktu_selesai, status) VALUES
('Senin', '08:00:00', '11:00:00', 'Tersedia'),
('Senin', '13:00:00', '16:00:00', 'Tersedia'),
('Selasa', '09:00:00', '12:00:00', 'Tersedia'),
('Selasa', '14:00:00', '17:00:00', 'Tersedia'),
('Rabu', '08:00:00', '11:00:00', 'Tersedia'),
('Rabu', '13:00:00', '16:00:00', 'Tersedia'),
('Kamis', '10:00:00', '13:00:00', 'Tersedia'),
('Kamis', '14:00:00', '18:00:00', 'Tersedia'),
('Jumat', '08:00:00', '11:30:00', 'Tersedia'),
('Jumat', '13:00:00', '15:00:00', 'Tersedia'),
('Sabtu', '09:00:00', '12:00:00', 'Tersedia'),
('Sabtu', '13:00:00', '16:00:00', 'Libur'),
('Minggu', '10:00:00', '13:00:00', 'Libur');

INSERT INTO Dokter (nama_dokter, spesialisasi, no_telepon, email, password) VALUES
('Dr. Ahmad Suryadi, Sp.PD', 'Penyakit Dalam', '081234001001', 'ahmad.suryadi@clinic.com', 'password123'),
('Dr. Siti Rahma, Sp.A', 'Anak', '081234001002', 'siti.rahma@clinic.com', 'password123'),
('Dr. Budi Santoso, Sp.OG', 'Kandungan', '081234001003', 'budi.santoso@clinic.com', 'password123'),
('Dr. Dewi Lestari, Sp.JP', 'Jantung', '081234001004', 'dewi.lestari@clinic.com', 'password123'),
('Dr. Rudi Hartono, Sp.B', 'Bedah', '081234001005', 'rudi.hartono@clinic.com', 'password123'),
('Dr. Maya Kusuma, Sp.KK', 'Kulit dan Kelamin', '081234001006', 'maya.kusuma@clinic.com', 'password123'),
('Dr. Eko Wijaya, Sp.M', 'Mata', '081234001007', 'eko.wijaya@clinic.com', 'password123'),
('Dr. Linda Sari, Sp.THT', 'THT', '081234001008', 'linda.sari@clinic.com', 'password123');

