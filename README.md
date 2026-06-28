# Secure Profile API

Praktikum keamanan web dan JWT. Proyek ini adalah sebuah RESTful API yang dibuat menggunakan Node.js, Express, dan MongoDB sebagai database, dengan fitur autentikasi JWT, rate limiting, dan role-based access control.

## Persyaratan

- Node.js
- npm (Node Package Manager)
- MongoDB (berjalan secara lokal atau menggunakan MongoDB Atlas)

## Cara Instalasi

1. Clone atau unduh repositori ini.
2. Buka terminal dan arahkan ke direktori proyek:
   ```bash
   cd secure-profile-api
   ```
3. Instal semua dependensi yang diperlukan dengan menjalankan:
   ```bash
   npm install
   ```
4. Buat file `.env` di direktori utama proyek (jika belum ada) dan sesuaikan variabel lingkungan yang diperlukan. Anda wajib mendefinisikan `JWT_SECRET` dan `MONGO_URI`:
   ```env
   PORT=3000
   JWT_SECRET=rahasia_super_aman_anda
   CLIENT_ORIGIN=http://localhost:5173
   NODE_ENV=development
   JWT_EXPIRES_IN=1h
   MONGO_URI=mongodb://localhost:{port_mongo_db}/{nama_database}
   ```

## Cara Menjalankan Server

Anda dapat menjalankan server dalam dua mode:

- **Mode Produksi**:
  ```bash
  npm start
  ```
- **Mode Development (menggunakan nodemon)**:
  ```bash
  npm run dev
  ```

Server akan berjalan pada `http://localhost:3000` (atau port yang Anda tentukan di `.env`).

## Daftar Endpoint

### Health Check
- **GET** `/api/health`
  - Mengecek status server.

### Autentikasi (Auth)
Semua endpoint di bawah ini memiliki prefix `/api/auth`.
- **POST** `/api/auth/register`
  - Mendaftarkan pengguna baru.
- **POST** `/api/auth/login`
  - Melakukan login dan mendapatkan token JWT.
- **POST** `/api/auth/changePassword`
  - Mengubah password pengguna.

### Pengguna (Users)
Semua endpoint di bawah ini memiliki prefix `/api/users`. Semua endpoint ini dilindungi (membutuhkan Bearer Token JWT di header `Authorization`).
- **GET** `/api/users/me`
  - Mendapatkan profil pengguna yang sedang login.
- **GET** `/api/users/`
  - Mendapatkan daftar semua pengguna. *(Membutuhkan role: admin)*
- **GET** `/api/users/count`
  - Mendapatkan jumlah total pengguna. *(Membutuhkan role: admin)*

## Testing
Untuk menjalankan unit test yang telah disediakan (menggunakan Jest), jalankan perintah:
```bash
npm test
```
