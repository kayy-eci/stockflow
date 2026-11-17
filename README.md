# StockFlow

Backend API untuk sistem manajemen stok produk.

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Tech Stack](#tech-stack)
- [Fitur yang Sudah Ada](#fitur-yang-sudah-ada)
- [Fitur yang Belum Selesai](#fitur-yang-belum-selesai)
- [Struktur Proyek](#struktur-proyek)
- [Penjelasan Setiap Folder Source](#penjelasan-setiap-folder-source)
- [API Endpoints](#api-endpoints)
- [Skema Database](#skema-database)
- [Environment Variables](#environment-variables)
- [Cara Menjalankan](#cara-menjalankan)
- [Status Pengembangan](#status-pengembangan)

---

## Tentang Proyek

**StockFlow** adalah backend API berbasis Express + TypeScript untuk mengelola data
stok produk, mulai dari manajemen pengguna (owner / staff), kategori, produk, order,
hingga stock adjustment.

Proyek masih berada pada **tahap awal pengembangan (early development)**. Saat ini
fokus utama adalah setup server, koneksi database, health check, dan autentikasi
JWT.

## Tech Stack

| Teknologi | Keterangan |
|---|---|
| Node.js | Runtime |
| Express.js | Web framework (v5) |
| TypeScript | Bahasa pemrograman utama backend (strict mode, `noEmit`) |
| tsx | Dev runner TypeScript (`tsx watch src/server.ts`) |
| PostgreSQL | Database via `pg` (Pool) |
| Zod | Validasi schema & parsing input/output |
| jsonwebtoken | JWT authentication |
| cors | Cross-Origin Resource Sharing |
| dotenv | Membaca file `.env` |

## Fitur yang Sudah Ada

### 1. Health Check (`GET /health`)

- File: `src/app.ts` (dan sementara duplikat di `src/testing.ts`)
- Memeriksa status server dan koneksi database.
- Jika database terhubung, response:

```json
{
  "status": "ok",
  "db": "connected",
  "result": [{ "1": 1 }]
}
```

- Jika database gagal, response:

```json
{
  "status": "error",
  "db": "disconnected"
}
```

### 2. Database Connection (PostgreSQL Pool)

- File: `src/config/db.ts`
- Menggunakan `pg.Pool` dengan konfigurasi dari environment variables.
- Pool di-export dan dapat dipakai di seluruh aplikasi (mis. health check, service layer).

### 3. JWT Authentication Middleware

- File: `src/middleware/auth.middleware.ts`
- Membaca token dari header `Authorization: Bearer <token>`.
- Memverifikasi token dengan `JWT_SECRET`.
- Jika token valid dan payload mengandung `id`, payload disimpan ke `res.locals.user`.
- Jika token tidak ada / invalid, dikembalikan error `401 Unauthorized`.

### 4. User Authentication Types

- File: `src/types/express.d.ts`
- `UserRole` = `"staff" | "owner"`
- `UserTokenPayload` = `{ id, email, role?, jti? }` (extends `JwtPayload`)
- Augmentasi global `Express.Locals` sehingga `req/res.locals.user` bisa dipakai di semua route.

### 5. Skema Validasi (Zod)

- File: `src/models/schema.ts`
- Semua skema Zod sudah didefinisikan untuk:
  - **User**: create / update / response / credentials
  - **Category**: create / update / response
  - **Product**: create / update / response
  - **Order**: create / response / order item response
  - **Stock Adjustment**: create / response

### 6. Endpoint Users (Partial)

- File: `src/routes/user.routes.ts` + `src/services/users.service.ts`
- `GET /users` — memerlukan token valid (menggunakan `tokenMiddleWare`).
- Mengambil semua data user dari database.
- Response sukses:

```json
{
  "message": "Berhasil fetch users!",
  "data": []
}
```

---

## Fitur yang Belum Selesai

- [ ] `src/routes/owner.routes.ts` — **belum diisi** (perlu dibuat).
- [ ] `src/routes/index.ts` — **belum mount** route ke Express app.
- [ ] `src/app.ts` — **belum** mengerakkan user routes.
- [ ] Service layer hanya memiliki `getAllUsers`; belum ada create / update / delete user.
- [ ] Tidak ada endpoint register / login / refresh token.
- [ ] Tidak ada endpoint CRUD category / product / order / stock adjustment yang sudah terhubung ke route.

---

## Struktur Proyek

```
stockflow/
├── src/
│   ├── app.ts                        # Express app + /health endpoint
│   ├── server.ts                     # Entry point (listen di PORT)
│   ├── testing.ts                    # Duplikat /health (belum dipakai server utama)
│   ├── config/
│   │   └── db.ts                     # PostgreSQL pool
│   ├── middleware/
│   │   └── auth.middleware.ts       # JWT Bearer token middleware
│   ├── models/
│   │   └── schema.ts                # Semua skema validasi Zod
│   ├── routes/
│   │   ├── index.ts                 # Belum diisi
│   │   ├── owner.routes.ts          # Belum diisi
│   │   └── user.routes.ts           # GET /users
│   ├── services/
│   │   └── users.service.ts         # Query database users
│   └── types/
│       └── express.d.ts             # UserTokenPayload & Express Locals
├── .env                              # Environment variables
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## Penjelasan Setiap Folder Source

Berikut penjelasan fungsi setiap folder pada source backend **`kayflix-BE`** (path project: `C:\Users\62812\Desktop\A.kayysan\TugasTB\WEBDEV\kayflix-BE`).

### `src/`
Folder utama aplikasi backend. Berisi entry point (`app.ts`, `server.ts`) serta seluruh folder pendukung (config, controllers, middleware, models, routes, services, types).

### `src/config/`
Mengelola konfigurasi eksternal aplikasi:
- `db.ts` — membuat dan export connection pool database (MySQL via `mysql2/promise`).
- `redis.ts` — konfigurasi client Redis untuk blacklist token (masih dalam tahap komentar).
- `cloudinary.ts` — konfigurasi Cloudinary untuk upload gambar/gambar profil.

### `src/controllers/`
Berisi handler yang menangani request & response HTTP:
- `user.controller.ts` — handler `uploadProfile` untuk upload & update profile image user.

### `src/middleware/`
Middleware kustom Express:
- `auth.middleware.ts` — memverifikasi Bearer token JWT dan menyimpan payload ke `res.locals.user`.
- `admin.middleware.ts` — memeriksa role admin (`adminMiddleware`, `cannotDeleteSelfMiddleware`).
- `error.middleware.ts` — global error handler.
- `upload.middleware.ts` — middleware upload file (multer) untuk profile image (max 5MB, hanya boleh gambar).

### `src/models/`
Berisi definisi skema data & validasi:
- `schema.ts` — skema validasi Zod (`dataUsers`, `credetials`, `dataMovies`) dan tipe input/output-nya.

### `src/routes/`
Mengarahkan endpoint API ke handler yang tepat:
- `index.ts` — router utama, mem-mount route user & movie pada prefix `/api`.
- `user.routes.ts` — endpoint user & auth: `GET /users`, `GET /users/:id`, `GET /profile`, upload profile image, `POST /auth/login`, `POST /auth/logout`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`.
- `movie.routes.ts` — endpoint movie: `GET /movies`, `POST /movies`, `PUT /movies/:id`, `DELETE /movies/:id` (create/update/delete wajib admin).

### `src/services/`
Berisi query database & logika bisnis:
- `user.service.ts` — query user (get all, get by id/email, create, update, delete, update profile image).
- `movie.service.ts` — query movie (get all, create, update, delete).
- `cloudinary.service.ts` — upload gambar profile ke Cloudinary.

### `src/types/`
- `express.d.ts` — tipe `UserTokenPayload`, `UserRole`, dan augmentasi global `Express.Locals`.

---

## API Endpoints

### `GET /health`

**Deskripsi:** Mengecek kesehatan server dan koneksi database.

**Response:**

| Status | Body |
|---|---|
| 200 | `{ "status": "ok", "db": "connected", ... }` |
| 500 | `{ "status": "error", "db": "disconnected" }` |

---

### `GET /users`

**Deskripsi:** Mengambil daftar semua user (butuh token JWT).

**Headers:**

```
Authorization: Bearer <token>
```

**Response sukses:**

```json
{
  "message": "Berhasil fetch users!",
  "data": [
    {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com",
      "role": "owner",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

**Response error:**

- `401` — token tidak ada / token invalid / payload tidak valid.
- `500` — gagal mengambil data users.

---

## Skema Database

Saat ini skema database belum dibuat via migration — konfigurasi PostgreSQL
disesuaikan manual (nama database, tabel, dsb).

### Tabel `users` (hasil query di `users.service.ts`)

| Column | Tipe | Keterangan |
|---|---|---|
| `id` | int | Primary key |
| `name` | varchar | Nama user |
| `email` | varchar | Email (unik) |
| `password` | varchar | Password (hashed) |
| `role` | enum | `owner` \| `staff` |
| `created_at` | timestamp | Waktu dibuat |
| `updated_at` | timestamp | Waktu diupdate |

> Catatan: field `password` saat ini masih ikut tercantum pada query, sebaiknya
> dihapus sebelum response dikembalikan ke client.

### Enum & Validasi (Zod)

- `UserRole`: `"owner" | "staff"`
- `AdjustmentReason`: `"restock" | "correction" | "shrinkage" | "return"`
- Semua skema Zod di `src/models/schema.ts` memiliki validasi seperti
  - `email` harus valid
  - `password` minimal 8 karakter
  - `cost_price` & `sell_price` tidak negatif
  - `stock_qty`, `low_stock_threshold` angka bulat ≥ 0
  - `items` pada order wajib minimal 1 item dengan `product_id` & `quantity` positif

---

## Environment Variables

File `.env`:

```env
# Server
PORT=8000
NODE_ENV=development

# PostgreSQL
DB_HOST="localhost"
DB_PORT=5432
DB_USER="postgres"
DB_PASSWORD="••••••••"
DB_NAME="stokflow"

# Auth
JWT_SECRET=tokencuy
JWT_EXPIRES_IN=7d
```

| Variabel | Keterangan |
|---|---|
| `PORT` | Port server (default `8000`) |
| `NODE_ENV` | Environment (`development`) |
| `DB_HOST` | Host PostgreSQL |
| `DB_PORT` | Port PostgreSQL (default `5432`) |
| `DB_USER` | User database |
| `DB_PASSWORD` | Password database |
| `DB_NAME` | Nama database |
| `JWT_SECRET` | Secret JWT (wajib, middleware akan error jika tidak ada) |
| `JWT_EXPIRES_IN` | Masa berlaku token (default `7d`) |

---

## Cara Menjalankan

1. Install dependencies:

```bash
npm install
```

2. Salin/isi file `.env` di root project.

3. Jalankan server:

```bash
npm run dev
```

Server akan berjalan di `http://localhost:8000`.

4. Cek health:

```bash
curl http://localhost:8000/health
```

---

## Status Pengembangan

### Sudah Selesai

- ✅ Inisialisasi project Express + TypeScript
- ✅ Koneksi database PostgreSQL
- ✅ Health check endpoint
- ✅ JWT setup & auth middleware
- ✅ Tipe auth (owner / staff) & lokasi user di `res.locals`
- ✅ Skema validasi Zod lengkap
- ✅ Endpoint dasar `GET /users` dengan token

### Dalam Proses / Belum Selesai

- ⬜ Mount routing (`src/routes/index.ts`, `src/app.ts`)
- ⬜ Route owner & lengkapnya
- ⬜ Endpoint auth: register / login / token refresh
- ⬜ Endpoint CRUD lengkap: user, category, product, order, stock adjustment
- ⬜ Hash password & keamanan token di response

---

## Catatan Pengembangan

- Entry point server: `src/server.ts` → import `app` dari `src/app.ts`, lalu `app.listen`.
- TypeScript menggunakan mode `module: "nodenext"` dan `rewriteRelativeImportExtensions`,
  sehingga import path disesuaikan (mis. `./app.ts`).
- `tsconfig.json` mengaktifkan `strict`, `noEmit`, `verbatimModuleSyntax`,
  `erasableSyntaxOnly`, `skipLibCheck`.
