# Tugas Basis Data

Anggota Kelompok:
- ERDIZAH GHODI AL HAIDAR (24/537670/PA/22787)
- Giganius Revo (24/541359/PA/22965)
- Nicholas Lim (24/543264/PA/23075)

---

## Cara Menjalankan Program

### Prasyarat
- **Node.js**: Sudah terinstall di komputer.
- **MySQL**: Sudah terinstall dan berjalan (XAMPP/MySQL Workbench).

### Langkah 1: Setup Database
1. Buka MySQL client anda (Workbench / Command Line / PHPMyAdmin).
2. Buat database baru (misalnya `clinic_db`).
3. Jalankan (import) script setup database yang ada di:
   `week3_CRUD_demo/setup_database.sql`
   Script ini akan membuat semua tabel yang dibutuhkan (DDL) dan mengisi data awal (DML).

### Langkah 2: Setup Backend
1. Buka terminal dan masuk ke folder backend:
   ```bash
   cd week3_CRUD_demo/backend
   ```
2. Pastikan file `.env` sudah ada dan konfigurasinya sesuai dengan database anda.
   Jika belum ada, copy dari `.env.example` ke `.env` dan sesuaikan passwordnya:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password_mysql_anda  <-- Isi jika ada (kosongkan jika pakai XAMPP default)
   DB_NAME=clinic_db
   DB_PORT=3306
   JWT_SECRET=supersecretkey123
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Jalankan server:
   ```bash
   npm start
   ```
   Jika berhasil, akan muncul pesan: `Server running on port 3000` dan `db connected`.

### Langkah 3: Menjalankan Frontend
1. Masuk ke folder frontend: `week3_CRUD_demo/frontend`.
2. Buka file `index.html` menggunakan browser (Chrome/Edge/Firefox).
   *Disarankan menggunakan "Live Server" di VS Code untuk hasil terbaik.*

### Akun Demo
Gunakan akun berikut untuk login:

**Pasien (Patient)**
- Email: `john.doe@email.com`
- Password: `password123`

**Resepsionis**
- Email: `siti.aminah@clinic.com`
- Password: `password123`
=======
>>>>>>> ae571796c3e5edb65b3449bf4595636e541618d6
