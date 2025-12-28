INSERT INTO Pasien (nama_pasien, tanggal_lahir, jenis_kelamin, alamat, no_telepon, email, password) 
VALUES ('John Doe', '1990-05-15', 'Laki-laki', 'Jl. Merdeka No. 10, Jakarta', '081234567890', 'john.doe@email.com', 'password123');
INSERT INTO Resepsionis (nama_resepsionis, email, no_telepon, password) 
VALUES ('Siti Aminah', 'siti.aminah@clinic.com', '081234002010', 'password123');
INSERT INTO Jadwal_Dokter (hari, waktu_mulai, waktu_selesai, status) 
VALUES ('Senin', '08:00:00', '12:00:00', 'Tersedia');


SELECT * FROM Pasien WHERE pasien_id = 1;
SELECT * FROM Dokter WHERE spesialisasi = 'Kardiologi';
SELECT * FROM Janji_Temu WHERE status = 'Menunggu';

UPDATE Resepsionis 
SET nama_resepsionis = 'Siti Aminah Putri',
    no_telepon = '081234002020'
WHERE resepsionis_id = 1;
UPDATE Jadwal_Dokter 
SET status = 'Penuh'
WHERE jadwal_id = 1;
UPDATE Janji_Temu 
SET status = 'Dikonfirmasi',
    resepsionis_id = 1,
    updatedAt = CURRENT_TIMESTAMP
WHERE janjitemu_id = 1;



DELETE FROM Pasien WHERE pasien_id = 1;
DELETE FROM Dokter WHERE dokter_id = 1;
DELETE FROM Resepsionis WHERE resepsionis_id = 1;