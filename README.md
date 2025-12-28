# Tugas Basis Data

Anggota Kelompok:
- ERDIZAH GHODI AL HAIDAR (24/537670/PA/22787)
- Giganius Revo (24/541359/PA/22965)
- Nicholas Lim (24/543264/PA/23075)

---

## 📚 Dokumentasi Fitur & Role

Berikut adalah penjelasan mengenai hak akses (privileges) dan kemampuan setiap role pengguna dalam sistem, serta alur kerja aplikasi.

### 👥 Role & Privileges

#### 1. Pasien (Patient)
Pengguna yang ingin melakukan konsultasi medis.
*   **Registrasi & Login**: Mendaftar akun baru dan login ke sistem.
*   **Melihat Jadwal**: Melihat daftar jadwal dokter yang tersedia (status 'Tersedia').
*   **Booking Jadwal**: Membuat janji temu baru berdasarkan jadwal dokter yang dipilih.
    *   Status awal janji temu: `Menunggu`.
    *   Jadwal dokter otomatis berubah menjadi `Penuh`.
*   **Kelola Janji Temu Saya**:
    *   Melihat riwayat dan status janji temu sendiri.
    *   Membatalkan janji temu (jika belum selesai).Status berubah menjadi `Dibatalkan` dan jadwal dokter kembali `Tersedia`.

#### 2. Dokter (Doctor)
Tenaga medis yang memberikan layanan konsultasi.
*   **Registrasi & Login**: Mendaftar dan login sebagai dokter.
*   **Manajemen Jadwal (Shift)**:
    *   **Buat Shift Baru**: Menambahkan jadwal praktik baru (Hari, Jam Mulai, Jam Selesai).
    *   **Ambil Jadwal**: Memilih jadwal kosong (unassigned) untuk diri sendiri.
    *   **Lepas Jadwal**: Menghapus diri sendiri dari jadwal tertentu.
*   **Manajemen Janji Temu (Appointment)**:
    *   Melihat daftar janji temu yang masuk ke jadwalnya.
    *   **Konfirmasi Pasien**: Mengubah status janji temu dari `Menunggu` ke `Dikonfirmasi`.
    *   **Selesaikan Konsultasi**: Menandai janji temu sebagai `Selesai` setelah konsultasi berakhir (Jadwal otomatis kembali `Tersedia` untuk slot berikutnya jika sistem mendukung slot time, atau sekadar pencatatan).
    *   **Batalkan**: Membatalkan janji temu pasien jika berhalangan.

#### 3. Resepsionis (Admin)
Administrator sistem klinik.
*   **Login Khusus**: Login menggunakan akun resepsionis.
*   **Dashboard Monitoring**: Melihat **semua** data pasien, dokter, dan jadwal secara menyeluruh.
*   **Manajemen Janji Temu Penuh**:
    *   Melihat seluruh janji temu dengan detail lengkap.
    *   Mengubah status janji temu secara manual (Menunggu, Dikonfirmasi, Selesai, Dibatalkan).
    *   **Booking untuk Pasien**: Membuatkan janji temu untuk pasien (misal pasien datang langsung/walk-in). Status langsung `Dikonfirmasi`.
*   **Manajemen Data**:
    *   Melihat daftar lengkap Pasien.
    *   Melihat daftar lengkap Dokter.

---

## 🔄 Alur Kerja (Step-by-Step Workflow)

Berikut adalah simulasi alur penggunaan aplikasi dari awal hingga akhir:

1.  **Persiapan Dokter**:
    *   Dokter login ke sistem.
    *   Dokter membuat jadwal praktik (misal: Senin, 09:00 - 12:00) melalui menu "Create Shift".
    *   Jadwal tersebut kini muncul di daftar "Available Schedules" bagi pasien.

2.  **Pendaftaran Pasien & Booking**:
    *   Pasien baru melakukan registrasi (Sign Up).
    *   Pasien login dan melihat daftar dokter yang tersedia.
    *   Pasien memilih jadwal dokter dan mengisi keluhan.
    *   Sistem membuat janji temu dengan status **Menunggu**.

3.  **Konfirmasi (Oleh Dokter)**:
    *   Dokter melihat ada janji temu masuk di dashboard-nya.
    *   Dokter menekan tombol **Confirm**. Status berubah menjadi **Dikonfirmasi**.

4.  **Pelaksanaan & Penyelesaian**:
    *   Pasien datang ke klinik sesuai jadwal.
    *   Setelah konsultasi selesai, Dokter menekan tombol **Complete**.
    *   Status janji temu menjadi **Selesai**. Jadwal dokter tersebut kembali terbuka (jika model slot per pasien).

*Catatan: Resepsionis dapat memantau atau mengintervensi (misal membatalkan atau membuatkan jadwal manual) di setiap tahapan jika diperlukan.*

---

## 🛠️ Cara Menjalankan Program

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

**Dokter (Doctor)**
- Email: `dr.budi@clinic.com`
- Password: `password123`
