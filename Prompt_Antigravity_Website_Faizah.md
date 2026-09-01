# Prompt untuk Google Antigravity — Website Portfolio Faizah

Copy-paste seluruh isi di bawah ini ke Antigravity sebagai instruksi awal project.

---

## 1. Konteks Project

Nama project: **faizahcreativearchive**. Gunakan nama ini sebagai project name di package.json, nama project Cloudflare Pages, title tag, dan metadata OG.

Buatkan website portfolio pribadi untuk Faizah, seorang creative professional (branding/design/creative direction). Ini adalah website yang akan dijual putus ke client (one-time delivery), jadi kode harus bersih, modular, mudah di-maintain oleh developer lain di masa depan, dan client harus bisa update konten sendiri tanpa sentuh kode (lihat bagian Sistem Admin di bawah).

Gaya visual yang diinginkan: **iOS-core style dipadukan dengan pendekatan editorial dari moodboard.** Ambil dari iOS-core: bersih, elegan, banyak white space, rounded corners konsisten, soft shadow tipis, efek blur/glassmorphism pada navbar, transisi/animasi halus (smooth spring easing, bukan animasi kaku). Ambil dari moodboard: blok warna solid full-bleed per section (bukan cuma putih terus), headline dengan ukuran sangat besar dan tebal yang jadi focal point utama, sesekali aksen italic pada detail personal (contoh pada referensi landing page: "she/her" ditulis italic), kontras tegas antara warna background section dan warna teks. Jangan biarkan salah satu pendekatan mendominasi — iOS-core untuk interaksi/komponen (navbar, button, transisi), moodboard untuk komposisi tipografi dan warna per section.

## 2. Tech Stack (wajib)

- **Next.js 14+ (App Router)** dengan **TypeScript** — strict mode aktif
- **Tailwind CSS** untuk styling
- **Framer Motion** untuk animasi/transisi bergaya iOS (spring easing, subtle fade/slide)
- **Supabase** sebagai backend: Postgres database, Auth (untuk login admin), Storage (untuk upload gambar project)
- Deploy target: **Cloudflare Pages/Workers**, pakai adapter **`@opennextjs/cloudflare`** (OpenNext for Cloudflare) supaya App Router, API routes, dan image optimization Next.js tetap jalan penuh di Cloudflare. Kalau agent menyarankan `@cloudflare/next-on-pages` karena lebih ringan, boleh, tapi cek dulu API routes admin tetap berfungsi
- Validasi input pakai **Zod**

Jangan pakai WordPress atau platform CMS berat lainnya. Bangun sistem admin sendiri yang ringan (lihat bagian 6).

## 3. Design Tokens (ambil persis dari brief, jangan diubah)

**Warna:**
- Main color: `#DCD2EC`
- Secondary color: `#F4F2EE`, `#B9DBFF`
- Accent/aksen: `#432016`, `#FFFFAD`, `#FFC5E6`

**Tipografi (wajib pakai Helvetica Light & Helvetica Bold sesuai brief):**
- Body text / paragraf / label kecil → **Helvetica Light**
- Headline, judul project, angka besar, emphasis → **Helvetica Bold**
- File font sudah tersedia dan disediakan langsung (format `.ttf`), taruh di `public/fonts/` dengan nama:
  - `public/fonts/Helvetica-Light.ttf`
  - `public/fonts/Helvetica-Bold.ttf`
- Load lewat **`next/font/local`** (support `.ttf` langsung, tidak wajib convert ke woff2, walau woff2 lebih ringan kalau agent mau convert otomatis saat build):
  ```ts
  // lib/fonts.ts
  import localFont from 'next/font/local'

  export const helvetica = localFont({
    src: [
      { path: '../public/fonts/Helvetica-Light.ttf', weight: '300', style: 'normal' },
      { path: '../public/fonts/Helvetica-Bold.ttf', weight: '700', style: 'normal' },
    ],
    variable: '--font-helvetica',
    display: 'swap',
  })
  ```
- Terapkan `helvetica.variable` di root layout, lalu pakai `font-[family-name:var(--font-helvetica)]` di Tailwind config atau langsung di CSS
- Fallback stack kalau file font gagal load: `-apple-system, "Inter", sans-serif`

**Skala Tipografi (ikuti pendekatan moodboard, bukan skala default Tailwind yang kecil-kecil):**
- Hero/headline utama tiap section: sangat besar, dominan di viewport (contoh: `clamp(2.5rem, 6vw, 6rem)`, Helvetica Bold, line-height rapat ~0.95–1.05) — meniru gaya "OLIVIA ROSE HANSEN" / "WE'VE GOT SCIENCE AND NUMBERS" di moodboard yang teksnya jadi elemen visual utama, bukan cuma judul
- Sub-headline/tagline pendamping: medium-large (`clamp(1.25rem, 2.5vw, 2rem)`), bisa Helvetica Light dengan sesekali kata di-italic untuk penekanan
- Body/deskripsi: ukuran nyaman baca (16–18px desktop), Helvetica Light, line-height longgar (1.6–1.7) supaya tetap terasa "iOS clean" di tengah section yang visualnya berani
- Label kecil/tag/kategori: uppercase, letter-spacing lebar, ukuran kecil (12–13px), Helvetica Bold — dipakai untuk filter tab, tag scope of work, dan label seperti pada referensi moodboard ("MULTI TALENTED CONTENT CREATOR", "INSTAGRAM STATS")

**Tone & manner:** Clean, Elegant, Intriguing, Informative — pastikan pilihan animasi dan spacing merefleksikan ini (jangan ramai, jangan norak), meskipun blok warna dan tipografi besar dipakai secara berani.

## 4. Struktur Halaman (ikuti brief persis)

### A. Landing Page
- Navbar sticky dengan efek blur saat scroll (glassmorphism, khas iOS)
- Logo/nama di kiri
- Menu tengah/kanan: `About | Curated Works | Get in Touch`
- Icon email & LinkedIn di pojok kanan
- Section "Meet Faizah": foto di satu sisi, deskripsi singkat di sisi lain (layout dua kolom di desktop, stack di mobile)
- Section "Curated Works": preview singkat/highlight beberapa project sebelum masuk ke Body

### B. Body (Showcased/Recent Works)
- Headline besar bold (contoh gaya dari referensi: "We make work that works IRL and in the scroll." → ganti dengan lorem ipsum sesuai gaya headline pendek dan punchy)
- Sub-tagline di sampingnya (contoh gaya: "From Vision to Reality")
- Baris tag skill/kapabilitas (contoh: "Creative Direction | Branding Strategy | Graphic Design" dst — gunakan lorem ipsum atau placeholder kapabilitas)
- Filter tab kategori (pill-shaped buttons, active state gelap solid, sesuai referensi moodboard) — datanya dari admin, bukan hardcoded
- Grid work showcase: gambar besar dengan overlay teks/tombol "View Work" saat hover, klik menuju Individual Project Page

### C. Individual Project Page
- Project Title (besar, bold)
- Project Subtitle
- Work Description (paragraf, lorem ipsum)
- Box "What We Did" (list singkat)
- Box "Scope of Work" (tag/list: contoh Branding, Design Thinking, Creative Concept)
- Galeri gambar project (minimal 2 gambar, layout grid)
- Section "Other Work" di bagian bawah halaman — tampilkan 2-3 project lain sebagai related work

### D. Footer
- Section "Get in Touch!" dengan form email capture sederhana + link LinkedIn + email
- Section "Prior Experience" — logo-logo client sebelumnya (marquee/scroll horizontal halus, gunakan placeholder logo)
- Business hours (placeholder)
- Site map links (About, Approach, Projects, Contact)
- Social links (Instagram, LinkedIn, dll — sesuaikan yang relevan)
- Copyright line di bawah

## 5. Copywriting

Semua isi teks (headline, deskripsi, project description) pakai **lorem ipsum** sebagai placeholder. Struktur/label section (judul field seperti "Scope of Work", "What We Did", tombol CTA) tetap dalam Bahasa Inggris mengikuti referensi brief.

## 6. Sistem Admin/CMS (wajib — ini requirement utama)

Client harus bisa update konten sendiri tanpa sentuh kode. Bangun halaman `/admin` dengan:

- **Login** via Supabase Auth (cukup 1 akun admin, tidak perlu multi-user/role kompleks)
- **CRUD Projects**: tambah/edit/hapus project — field: title, subtitle, description, category/tag, scope of work (list), upload gambar (multiple, drag-and-drop ke Supabase Storage, auto-preview)
- **Edit Site Settings**: teks "Meet Faizah", foto profil, email kontak, link sosial, daftar logo client (upload logo + nama)
- Semua form pakai validasi jelas (required fields, ukuran/tipe file gambar dibatasi — contoh: max 5MB, hanya jpg/png/webp)
- Setelah simpan, perubahan langsung tampil di website publik (revalidate/ISR di Next.js)
- UI admin simpel, jangan didesain rumit — fokus ke kemudahan pakai untuk non-teknis

## 7. Requirement Keamanan

- Semua secret (Supabase URL, anon key, service role key) di environment variables, **service role key tidak pernah dipakai di client-side**
- Aktifkan **Row Level Security (RLS)** di Supabase: publik hanya boleh baca (read-only), tulis/update/delete hanya untuk user admin yang authenticated
- Validasi & sanitasi semua input form (pakai Zod) sebelum masuk database
- Validasi tipe & ukuran file saat upload gambar (cegah upload file berbahaya)
- Rate limiting sederhana di halaman login admin
- Semua traffic HTTPS
- Dependency minimal — hindari library yang tidak perlu

## 8. Requirement Kualitas Kode (anti "god code")

- Struktur folder jelas: `app/`, `components/ui/`, `components/sections/`, `lib/`, `types/`
- Komponen kecil dan single-responsibility (jangan satu file besar isi semuanya)
- Konten diambil dari Supabase, **jangan hardcode teks/gambar di dalam komponen**
- Reusable components: Button, Tag/Pill, Card, ImageUploader, dll
- Beri komentar pada bagian penting (koneksi Supabase, logic admin)
- Sertakan `README.md` berisi: cara setup environment, cara login admin, cara update konten, cara deploy ulang ke Cloudflare Pages/Workers (`wrangler.toml`, environment variables di Cloudflare dashboard, cara jalankan `wrangler deploy` atau `wrangler pages deploy`)

## 9. Deliverable

- Website fully responsive (mobile-first), dites di ukuran mobile, tablet, desktop
- Build production-ready, tidak ada error/warning saat `next build`
- Project name/domain: **faizahcreativearchive**
- Instruksi deployment lengkap ke Cloudflare (Pages atau Workers, sesuai adapter yang dipakai) + setup Supabase project dari nol
- Pastikan environment variables Supabase (URL, anon key) di-set sebagai Cloudflare secret/binding, bukan hardcoded di kode
