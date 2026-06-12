window.DeployLabData = (() => {
  const starterPrerequisite =
    "Sudah pernah membuat project HTML, CSS, JavaScript, PHP, Laravel, dan menyimpan project dengan GitHub. Tidak perlu mahir, cukup paham struktur folder dan file konfigurasi.";

  const deployTerms = [
    { term: "Hosting", meaning: "Server tempat file website dan aplikasi web dijalankan agar bisa diakses online." },
    { term: "Domain", meaning: "Alamat website yang diarahkan ke folder atau aplikasi di hosting." },
    { term: "Database", meaning: "Tempat menyimpan data aplikasi, biasanya MySQL/MariaDB untuk project PHP dan Laravel." }
  ];

  const defaultSteps = [
    "Pahami dulu masalah yang ingin diselesaikan.",
    "Catat data penting di tempat aman, bukan di repository publik.",
    "Kerjakan langkah di hosting secara berurutan.",
    "Test satu fitur kecil sebelum lanjut ke fitur lain.",
    "Tulis hasil deploy dan perubahan konfigurasi di dokumentasi project."
  ];

  const lesson = (item) => ({
    icon: "bi-cloud-upload",
    duration: "10 menit",
    prerequisite: starterPrerequisite,
    overview: item.goal,
    steps: defaultSteps,
    terms: deployTerms,
    commonMistakes: [
      "Mengupload project sebelum tahu document root domain.",
      "Mencampur password asli dengan file yang akan dipublish ke repository."
    ],
    checkpoint: "Kamu siap lanjut jika dapat menjelaskan alur konsep ini dengan bahasa sendiri dan tahu data apa yang harus dicek.",
    filename: "deploy-checklist",
    ...item
  });

  const lessons = [
    lesson({
      id: "peta-deploy",
      title: "Peta besar deploy project",
      icon: "bi-map",
      duration: "8 menit",
      goal: "Memahami perjalanan project dari laptop sampai bisa diakses melalui domain hosting.",
      problem: "Pemula sering langsung upload file tanpa tahu hubungan domain, folder, database, dan konfigurasi koneksi.",
      analogy: "Deploy seperti memindahkan toko dari ruangan latihan ke ruko sungguhan. Kamu perlu alamat, rak barang, kasir, dan catatan operasional yang benar.",
      explanation: "Deploy project web berarti menaruh file aplikasi di hosting, mengarahkan domain ke folder yang tepat, membuat database, menghubungkan konfigurasi aplikasi ke database hosting, lalu menguji fitur utama.",
      code: `Alur deploy umum:
1. Audit project lokal
2. Siapkan domain/subdomain
3. Buat database dan user
4. Upload file project
5. Import database
6. Setting koneksi
7. Test fitur
8. Backup dan dokumentasi`,
      lineNotes: [
        "Domain menentukan alamat yang dibuka user.",
        "Folder hosting menentukan file mana yang dilayani server.",
        "Database dan file koneksi harus cocok agar aplikasi bisa membaca data."
      ],
      exercise: "Ambil satu project PHP atau Laravel yang pernah kamu buat, lalu tulis daftar file, database, dan fitur yang harus dites setelah online.",
      recall: "Mengapa deploy tidak cukup hanya upload file project?",
      debug: {
        question: "Website sudah upload, tetapi data tidak muncul. Bagian apa yang harus dicek?",
        hint: "Data biasanya datang dari database dan konfigurasi koneksi.",
        solution: "Cek database hosting, user database, privilege, host database, nama database, password, dan import SQL."
      },
      quiz: {
        question: "Deploy project web profesional minimal melibatkan...",
        options: ["File, domain, database, konfigurasi, dan testing", "Hanya mengganti warna CSS", "Hanya zip file", "Hanya membuka GitHub"],
        answer: 0,
        explanation: "Deploy butuh file aplikasi, alamat domain, database, konfigurasi koneksi, dan testing fitur."
      }
    }),
    lesson({
      id: "domain-hosting",
      title: "Domain, subdomain, dan hosting",
      icon: "bi-globe2",
      duration: "9 menit",
      goal: "Membedakan domain, subdomain, hosting, document root, dan URL live project.",
      problem: "Banyak error deploy muncul karena file diupload ke folder yang tidak sesuai dengan domain yang dibuka.",
      analogy: "Domain adalah alamat ruko, hosting adalah gedungnya, dan document root adalah ruangan yang benar di dalam gedung.",
      explanation: "Di cPanel, satu akun hosting dapat memiliki beberapa domain atau subdomain. Setiap domain biasanya punya folder tujuan. File index.php atau index.html harus berada di folder yang menjadi document root domain tersebut.",
      code: `Contoh:
Domain utama      : example.com
Subdomain project : data-wilayah.example.com
Document root     : /home/user/data-wilayah.example.com
File utama        : index.php atau public/index.php`,
      lineNotes: [
        "Subdomain cocok untuk project latihan atau aplikasi internal.",
        "Document root harus dicek sebelum upload.",
        "Laravel sering butuh folder public sebagai pintu masuk aplikasi."
      ],
      exercise: "Tulis tiga pasangan domain dan folder tujuan yang mungkin kamu pakai untuk project latihan.",
      recall: "Apa bedanya domain dan document root?",
      debug: {
        question: "Kamu membuka domain A, tetapi tampilan project B yang muncul. Apa kemungkinan penyebabnya?",
        hint: "Periksa arah domain ke folder hosting.",
        solution: "Document root domain A kemungkinan mengarah ke folder project B. Perbaiki folder domain atau pindahkan file ke folder yang benar."
      },
      quiz: {
        question: "Document root adalah...",
        options: ["Folder yang dibaca web server untuk domain tertentu", "Password database", "Nama tabel MySQL", "Nama branch Git"],
        answer: 0,
        explanation: "Document root adalah folder sumber file website untuk domain atau subdomain."
      }
    }),
    lesson({
      id: "cpanel-dashboard",
      title: "Mengenal cPanel dan menu penting",
      icon: "bi-speedometer2",
      duration: "10 menit",
      goal: "Mengenali menu cPanel yang dipakai saat deploy: Domains, MySQL Databases, phpMyAdmin, File Manager, SSL, dan Errors.",
      problem: "Pemula sering bingung karena cPanel berisi banyak menu, padahal deploy awal hanya butuh beberapa menu utama.",
      analogy: "cPanel seperti dashboard operasional hosting. Kamu tidak harus membuka semua tombol, cukup tahu tombol untuk alamat, file, database, dan log error.",
      explanation: "Untuk deploy project PHP/Laravel, fokus pada Domains untuk membuat domain/subdomain, MySQL Databases untuk database dan user, phpMyAdmin untuk import SQL, File Manager untuk upload dan extract file, serta Errors atau logs untuk membaca masalah server.",
      code: `Menu yang paling sering dipakai:
- Domains
- MySQL Databases
- phpMyAdmin
- File Manager
- SSL/TLS Status
- Errors atau Metrics`,
      lineNotes: [
        "Domains dipakai untuk membuat alamat project.",
        "MySQL Databases dipakai untuk database dan user.",
        "phpMyAdmin dipakai untuk import, export, dan cek tabel."
      ],
      exercise: "Buka cPanel latihanmu, cari menu di daftar ini, lalu catat posisi dan fungsinya.",
      recall: "Menu cPanel apa yang dipakai untuk import file SQL?",
      debug: {
        question: "Kamu butuh melihat tabel database, tetapi membuka menu MySQL Databases. Apa menu yang lebih tepat?",
        hint: "MySQL Databases untuk membuat database, bukan melihat isi tabel.",
        solution: "Buka phpMyAdmin, pilih database yang benar, lalu cek tabel dan data."
      },
      quiz: {
        question: "Menu phpMyAdmin dipakai untuk...",
        options: ["Mengelola isi database dan import SQL", "Mengubah CSS", "Membuat domain baru saja", "Membuka GitHub"],
        answer: 0,
        explanation: "phpMyAdmin dipakai untuk melihat tabel, import SQL, export, dan query database."
      }
    }),
    lesson({
      id: "audit-project",
      title: "Audit project sebelum upload",
      icon: "bi-clipboard-check",
      duration: "11 menit",
      goal: "Mengecek project lokal agar siap dipindahkan ke hosting tanpa membawa file yang tidak perlu atau data rahasia.",
      problem: "Project yang langsung dizip sering membawa file cache, database dump lama, node_modules, vendor tidak sesuai, atau file rahasia.",
      analogy: "Audit deploy seperti merapikan koper sebelum perjalanan. Barang penting ikut, barang berbahaya atau berat ditinggal.",
      explanation: "Sebelum upload, pastikan project berjalan lokal, hapus file yang tidak dipakai, siapkan file SQL terbaru, cek versi PHP, cek dependency, dan pastikan rahasia tidak ikut ke repository publik.",
      code: `Checklist audit:
- Project berjalan di lokal
- File SQL terbaru tersedia
- File koneksi memakai placeholder
- .env tidak dipublish ke repo publik
- Folder cache/log tidak membawa data lama
- Versi PHP hosting sesuai`,
      lineNotes: [
        "Audit mengurangi error setelah upload.",
        "SQL terbaru mencegah data online kosong.",
        "Rahasia harus disimpan aman dan diganti sesuai hosting."
      ],
      exercise: "Buat checklist audit untuk satu project PHP/Laravel yang akan kamu deploy.",
      recall: "Mengapa file rahasia tidak boleh ikut ke repository publik?",
      debug: {
        question: "Setelah deploy, aplikasi membaca data lama. Apa yang mungkin lupa disiapkan?",
        hint: "Cek file SQL yang diimport.",
        solution: "Kemungkinan SQL yang diimport bukan export terbaru. Export ulang database lokal yang benar lalu import ke database hosting."
      },
      quiz: {
        question: "Sebelum upload ke hosting, hal yang perlu dicek adalah...",
        options: ["Project berjalan lokal dan konfigurasi sensitif aman", "Jumlah warna tombol", "Nama folder download", "Wallpaper laptop"],
        answer: 0,
        explanation: "Audit memastikan project siap dipindahkan dan data sensitif tidak bocor."
      }
    }),
    lesson({
      id: "struktur-upload",
      title: "Struktur folder untuk PHP dan Laravel",
      icon: "bi-folder2-open",
      duration: "12 menit",
      goal: "Memahami file mana yang harus berada di document root untuk project PHP biasa dan Laravel.",
      problem: "Error 403, 404, atau source code bocor bisa terjadi jika struktur folder upload salah.",
      analogy: "Document root seperti etalase toko. Hanya file yang aman untuk dilihat publik yang seharusnya ada di etalase.",
      explanation: "PHP native sering menaruh index.php langsung di document root. Laravel idealnya hanya folder public yang menjadi document root, sedangkan folder app, vendor, storage, dan .env berada di luar folder publik jika hosting memungkinkan.",
      code: `PHP native:
document-root/
  index.php
  assets/
  koneksi.php

Laravel lebih aman:
project-laravel/
  app/
  vendor/
  storage/
  public/  <- document root`,
      lineNotes: [
        "PHP native lebih sederhana tetapi tetap butuh koneksi database yang aman.",
        "Laravel memakai public/index.php sebagai pintu masuk.",
        "Jangan menaruh file rahasia di folder yang bisa diakses langsung."
      ],
      exercise: "Gambar struktur folder project PHP dan Laravel milikmu, lalu tandai file yang boleh diakses publik.",
      recall: "Mengapa folder public Laravel penting saat deploy?",
      debug: {
        question: "Saat membuka Laravel, yang tampil adalah daftar folder app, bootstrap, vendor. Apa masalahnya?",
        hint: "Document root mengarah ke folder yang terlalu atas.",
        solution: "Arahkan document root ke folder public Laravel atau pindahkan isi public sesuai panduan hosting dengan penyesuaian path yang benar."
      },
      quiz: {
        question: "Pintu masuk utama Laravel adalah...",
        options: ["public/index.php", "app/Models", ".env", "database.sql"],
        answer: 0,
        explanation: "Laravel menerima request melalui public/index.php."
      }
    }),
    lesson({
      id: "buat-domain",
      title: "Membuat domain atau subdomain di hosting",
      icon: "bi-plus-square",
      duration: "12 menit",
      goal: "Membuat alamat project di menu Domains dan memastikan folder tujuan sudah jelas.",
      problem: "Upload file sering gagal tampil karena domain belum dibuat atau folder domain berbeda dari folder upload.",
      analogy: "Membuat domain seperti mendaftarkan alamat ruangan sebelum barang project dimasukkan.",
      explanation: "Di cPanel, buka menu Domains lalu gunakan Create A New Domain. Masukkan nama domain atau subdomain. Setelah submit, cPanel biasanya membuat document root otomatis. Catat nama domain dan foldernya.",
      code: `Contoh aman untuk latihan:
1. Buka cPanel dari client area hosting atau alamat server hostingmu
2. Buka menu Domains
3. Pilih Create A New Domain
4. Isi domain: data-wilayah.domain-kamu.co.id
5. Submit
6. Catat document root yang dibuat cPanel`,
      lineNotes: [
        "Gunakan domain latihan, bukan domain produksi, saat masih belajar.",
        "Catat document root sebelum upload ZIP.",
        "Jangan menulis URL cPanel dan password asli di dokumentasi publik."
      ],
      exercise: "Simulasikan nama domain latihan dan folder document root yang akan kamu pakai.",
      recall: "Data apa saja yang perlu dicatat setelah domain dibuat?",
      debug: {
        question: "Domain sudah dibuat, tetapi browser menampilkan halaman default hosting. Apa yang perlu dicek?",
        hint: "Mungkin file project belum masuk ke document root domain.",
        solution: "Buka File Manager, masuk ke folder document root domain, pastikan index.php atau index.html project berada di sana."
      },
      quiz: {
        question: "Setelah membuat domain di cPanel, hal penting yang harus dicatat adalah...",
        options: ["Nama domain dan document root", "Warna ikon cPanel", "Nama browser", "Jumlah tab terbuka"],
        answer: 0,
        explanation: "Nama domain dan document root menentukan tempat upload file."
      }
    }),
    lesson({
      id: "buat-database",
      title: "Membuat database MySQL",
      icon: "bi-database-add",
      duration: "11 menit",
      goal: "Membuat database hosting dengan nama yang mudah dikenali dan sesuai prefix akun hosting.",
      problem: "Aplikasi gagal konek jika nama database di konfigurasi tidak sama dengan database yang dibuat di hosting.",
      analogy: "Database seperti lemari data. Nama lemari harus sama dengan nama yang dicari aplikasi.",
      explanation: "Di menu MySQL Databases, buat database baru. Banyak hosting menambahkan prefix akun secara otomatis, misalnya prefix_project. Nama final inilah yang harus dipakai di koneksi.php atau .env.",
      code: `Contoh format:
Nama yang diisi        : wilayah
Nama final dari hosting: prefix_wilayah

Catat:
DB_DATABASE=prefix_wilayah`,
      lineNotes: [
        "Prefix akun hosting adalah bagian dari nama final.",
        "Gunakan nama database yang menjelaskan project.",
        "Jangan menebak nama final, lihat hasil yang ditampilkan cPanel."
      ],
      exercise: "Tulis contoh nama database final untuk project data wilayah, inventori, dan absensi.",
      recall: "Mengapa nama database final sering berbeda dari nama yang kamu ketik?",
      debug: {
        question: "Aplikasi menampilkan Unknown database. Apa yang salah?",
        hint: "Nama database di konfigurasi tidak ditemukan di server.",
        solution: "Cek nama final database di cPanel lalu samakan DB_DATABASE atau variabel $db dengan nama final tersebut."
      },
      quiz: {
        question: "Nama database yang dipakai di aplikasi harus...",
        options: ["Sama dengan nama final di hosting", "Sama dengan nama laptop", "Sama dengan warna tema", "Selalu database"],
        answer: 0,
        explanation: "Aplikasi harus menunjuk nama database yang benar-benar ada di server hosting."
      }
    }),
    lesson({
      id: "user-privilege",
      title: "User database dan privilege",
      icon: "bi-person-gear",
      duration: "13 menit",
      goal: "Membuat user database, memberi password kuat, dan menghubungkannya ke database dengan privilege yang tepat.",
      problem: "Database sudah ada, tetapi aplikasi tetap gagal karena user belum ditambahkan ke database atau privilege belum lengkap.",
      analogy: "Database adalah ruangan data, user adalah kunci, dan privilege adalah izin apa saja yang boleh dilakukan dengan kunci tersebut.",
      explanation: "Di MySQL Databases, buat user database, simpan password di password manager, lalu gunakan Add User To Database. Untuk project belajar, pilih All Privileges agar user bisa membaca, menambah, mengubah, dan menghapus data. Untuk produksi, sesuaikan privilege dengan kebutuhan.",
      code: `Contoh format aman:
Database : prefix_wilayah
User     : prefix_wilayah_user
Password : gunakan password kuat dan simpan aman

Add User To Database:
User     : prefix_wilayah_user
Database : prefix_wilayah
Privilege: All Privileges untuk latihan`,
      lineNotes: [
        "User database final biasanya juga memakai prefix akun hosting.",
        "Password asli tidak boleh masuk repository publik.",
        "Jika ada database test, tambahkan user ke database test hanya jika memang dibutuhkan."
      ],
      exercise: "Buat tabel catatan berisi database, user, privilege, dan tujuan pemakaiannya tanpa menulis password asli.",
      recall: "Apa fungsi Add User To Database?",
      debug: {
        question: "Error Access denied for user muncul setelah database dibuat. Apa yang perlu dicek?",
        hint: "User belum tentu punya akses ke database.",
        solution: "Pastikan user yang dipakai di konfigurasi sudah ditambahkan ke database yang benar dan privilege sudah disimpan."
      },
      quiz: {
        question: "Add User To Database dipakai untuk...",
        options: ["Memberi akses user ke database tertentu", "Upload file ZIP", "Membuat domain", "Mengubah DNS browser"],
        answer: 0,
        explanation: "Tanpa hubungan user-database, aplikasi tidak punya izin memakai database tersebut."
      }
    }),
    lesson({
      id: "export-database",
      title: "Export database dari lokal",
      icon: "bi-box-arrow-up",
      duration: "10 menit",
      goal: "Menyiapkan file SQL terbaru dari database lokal untuk diimport ke hosting.",
      problem: "File aplikasi online bisa tampil, tetapi data kosong karena database lokal belum diexport dan diimport.",
      analogy: "Export SQL seperti membawa isi lemari data dari ruang latihan ke lemari data di hosting.",
      explanation: "Gunakan phpMyAdmin lokal, Adminer, atau command mysqldump untuk export database. Simpan file .sql dengan nama jelas dan tanggal agar tidak tertukar.",
      code: `Contoh nama file:
wilayah_2026-06-12.sql
inventori_2026-06-12.sql

Checklist export:
- Pilih database lokal yang benar
- Export semua tabel yang dibutuhkan
- Cek ukuran file SQL
- Simpan sebagai backup sebelum import`,
      lineNotes: [
        "Nama file dengan tanggal memudahkan tracking.",
        "Pastikan database lokal yang dipilih bukan database kosong.",
        "Simpan salinan SQL sebelum mencoba import ke hosting."
      ],
      exercise: "Export database latihanmu lalu buka file SQL dengan editor untuk memastikan ada CREATE TABLE dan INSERT.",
      recall: "Apa tanda sederhana bahwa file SQL berisi struktur tabel?",
      debug: {
        question: "Import berhasil, tetapi tabel tidak ada. Apa kemungkinan penyebabnya?",
        hint: "File SQL mungkin bukan export database yang benar.",
        solution: "Buka file SQL dan cek apakah berisi CREATE TABLE untuk tabel yang dibutuhkan. Export ulang database lokal yang benar."
      },
      quiz: {
        question: "File SQL dipakai untuk...",
        options: ["Memindahkan struktur dan data database", "Mengganti domain", "Menjalankan CSS", "Menghapus hosting"],
        answer: 0,
        explanation: "File SQL berisi instruksi membuat tabel dan memasukkan data."
      }
    }),
    lesson({
      id: "upload-zip",
      title: "Upload ZIP project lewat File Manager",
      icon: "bi-file-zip",
      duration: "12 menit",
      goal: "Mengupload project sebagai file ZIP ke folder domain yang benar.",
      problem: "Upload satu per satu membuat struktur folder mudah rusak dan lebih lambat dibanding ZIP.",
      analogy: "ZIP seperti kardus besar. Semua file project masuk bersama, lalu dibuka di ruangan domain yang tepat.",
      explanation: "Kompres project menjadi .zip, buka File Manager, masuk ke folder document root domain, upload ZIP, lalu extract. Pastikan isi project berada langsung di folder yang dibaca domain, bukan terbungkus folder ganda yang tidak perlu.",
      code: `Contoh alur:
1. Kompres project menjadi admin_wilayah.zip
2. Buka File Manager
3. Masuk ke folder data-wilayah.domain-kamu.co.id
4. Upload admin_wilayah.zip
5. Extract
6. Cek index.php atau public/index.php`,
      lineNotes: [
        "Upload ZIP menjaga struktur folder lebih rapi.",
        "Folder tujuan harus sama dengan document root domain.",
        "Hapus ZIP dari hosting setelah extract jika tidak dibutuhkan."
      ],
      exercise: "Buat ZIP project latihan dan cek apakah ketika diextract struktur folder tetap benar.",
      recall: "Mengapa file ZIP sebaiknya dihapus setelah extract di hosting?",
      debug: {
        question: "Domain menampilkan 404 setelah extract. Apa yang harus dicek?",
        hint: "Mungkin index ada di subfolder hasil extract.",
        solution: "Cek apakah file utama berada langsung di document root. Jika ada folder ganda seperti admin_wilayah/admin_wilayah/index.php, rapikan strukturnya."
      },
      quiz: {
        question: "Saat upload ZIP, folder tujuan harus...",
        options: ["Document root domain yang benar", "Folder Downloads laptop", "Folder database", "Folder .git saja"],
        answer: 0,
        explanation: "File harus diextract di folder yang dilayani domain."
      }
    }),
    lesson({
      id: "koneksi-php",
      title: "Setting koneksi.php",
      icon: "bi-database-gear",
      duration: "13 menit",
      goal: "Mengubah konfigurasi database PHP native agar memakai host, user, password, dan database dari hosting.",
      problem: "Project lokal biasanya memakai localhost/root/password kosong, sedangkan hosting memakai host dan user database berbeda.",
      analogy: "Koneksi database seperti alamat gudang. Setelah pindah gedung, alamat lama tidak lagi berlaku.",
      explanation: "Edit file koneksi.php di hosting. Gunakan host database dari provider, user final, password database, dan nama database final. Jangan menyimpan password asli di repository publik.",
      code: `<?php
$host = 'host-database-kamu';
$user = 'prefix_wilayah_user';
$pass = 'password_database_kamu';
$db   = 'prefix_wilayah';

$conn = mysqli_connect($host, $user, $pass, $db);
if (!$conn) {
    die('Koneksi database gagal.');
}`,
      filename: "koneksi.php",
      lineNotes: [
        "Host database hosting tidak selalu localhost.",
        "User dan database biasanya memakai prefix akun hosting.",
        "Pesan error publik sebaiknya tidak menampilkan password atau detail sensitif."
      ],
      exercise: "Tulis versi koneksi.php dengan placeholder, lalu cocokkan nama variabelnya dengan projectmu.",
      recall: "Mengapa localhost tidak selalu benar di hosting?",
      debug: {
        question: "Aplikasi masih memakai root dan password kosong. Apa yang harus diganti?",
        hint: "Konfigurasi lokal belum disesuaikan ke hosting.",
        solution: "Ganti host, user, password, dan nama database dengan data final dari cPanel hosting."
      },
      quiz: {
        question: "Variabel $db pada koneksi.php biasanya berisi...",
        options: ["Nama database final di hosting", "Nama domain", "Nama file ZIP", "Nama folder CSS"],
        answer: 0,
        explanation: "$db menunjuk database yang akan dipakai aplikasi."
      }
    }),
    lesson({
      id: "env-laravel",
      title: "Setting .env Laravel",
      icon: "bi-file-earmark-lock",
      duration: "14 menit",
      goal: "Mengatur APP_URL, APP_ENV, APP_DEBUG, dan konfigurasi database Laravel di hosting.",
      problem: "Laravel sering menampilkan error 500 karena .env belum dibuat, APP_KEY hilang, config cache lama, atau database salah.",
      analogy: ".env seperti panel rahasia aplikasi. Isinya membuat Laravel tahu alamat, mode kerja, dan database yang dipakai.",
      explanation: "Di hosting, siapkan .env berdasarkan .env.example. Isi APP_URL dengan domain, APP_ENV=production, APP_DEBUG=false, dan DB_* sesuai database hosting. Pastikan APP_KEY ada dan cache config diperbarui jika kamu punya akses terminal.",
      code: `APP_NAME=DeployProject
APP_ENV=production
APP_KEY=base64:isi_app_key_kamu
APP_DEBUG=false
APP_URL=https://data-wilayah.domain-kamu.co.id

DB_CONNECTION=mysql
DB_HOST=host-database-kamu
DB_PORT=3306
DB_DATABASE=prefix_wilayah
DB_USERNAME=prefix_wilayah_user
DB_PASSWORD=password_database_kamu`,
      filename: ".env",
      lineNotes: [
        "APP_DEBUG=false mencegah detail error sensitif tampil ke publik.",
        "APP_URL harus sesuai domain live.",
        "DB_HOST, DB_DATABASE, DB_USERNAME, dan DB_PASSWORD harus cocok dengan cPanel."
      ],
      exercise: "Buat template .env produksi dengan placeholder dan daftar nilai yang harus diganti saat deploy.",
      recall: "Mengapa APP_DEBUG harus false di produksi?",
      debug: {
        question: "Laravel tetap memakai konfigurasi lama setelah .env diedit. Apa yang mungkin terjadi?",
        hint: "Config Laravel bisa tercache.",
        solution: "Jika ada akses terminal, jalankan php artisan config:clear dan php artisan cache:clear. Jika tidak, hapus cache config sesuai izin hosting atau minta bantuan provider."
      },
      quiz: {
        question: "Pada produksi, APP_DEBUG sebaiknya...",
        options: ["false", "true selamanya", "diisi password", "dihapus dari .env"],
        answer: 0,
        explanation: "APP_DEBUG=false menjaga detail error sensitif tidak tampil ke user."
      }
    }),
    lesson({
      id: "import-phpmyadmin",
      title: "Import database lewat phpMyAdmin",
      icon: "bi-table",
      duration: "12 menit",
      goal: "Mengimport file SQL ke database hosting yang benar dan memverifikasi tabelnya.",
      problem: "Database hosting sudah dibuat, tetapi aplikasi kosong karena file SQL belum masuk atau masuk ke database yang salah.",
      analogy: "Import SQL seperti mengisi lemari data hosting dengan isi lemari data lokal.",
      explanation: "Buka phpMyAdmin dari cPanel, pilih database final, buka tab Import, pilih file .sql, lalu jalankan. Setelah selesai, cek daftar tabel dan beberapa data penting.",
      code: `Checklist import:
1. Buka phpMyAdmin
2. Pilih database prefix_wilayah
3. Tab Import
4. Pilih wilayah_2026-06-12.sql
5. Jalankan import
6. Cek tabel dan jumlah data`,
      lineNotes: [
        "Pilih database dulu sebelum import.",
        "Jika ukuran SQL besar, cek limit upload hosting.",
        "Setelah import, cek tabel utama agar tidak salah database."
      ],
      exercise: "Import file SQL latihan ke database kosong, lalu cek minimal tiga tabel utama.",
      recall: "Mengapa harus memilih database sebelum import?",
      debug: {
        question: "Import SQL masuk, tetapi aplikasi tetap kosong. Apa yang harus dicek?",
        hint: "Mungkin koneksi aplikasi menunjuk database lain.",
        solution: "Cek DB_DATABASE atau $db di aplikasi dan pastikan sama dengan database yang diimport."
      },
      quiz: {
        question: "Sebelum klik Import di phpMyAdmin, kamu harus...",
        options: ["Memilih database tujuan yang benar", "Menghapus semua file project", "Mengubah warna tema", "Logout dari browser"],
        answer: 0,
        explanation: "Import harus masuk ke database yang digunakan aplikasi."
      }
    }),
    lesson({
      id: "permission-storage",
      title: "Permission, storage, dan upload file",
      icon: "bi-shield-check",
      duration: "12 menit",
      goal: "Memahami folder yang perlu bisa ditulis aplikasi dan batas aman permission.",
      problem: "Fitur upload, cache, atau log bisa gagal jika folder tidak bisa ditulis oleh aplikasi.",
      analogy: "Aplikasi butuh laci kerja yang bisa dibuka. Jika terkunci, aplikasi tidak bisa menyimpan file upload atau cache.",
      explanation: "Project PHP dan Laravel membutuhkan folder tertentu yang bisa ditulis, misalnya uploads, storage, dan bootstrap/cache. Gunakan permission sesuai panduan hosting. Hindari 777 jika tidak diperlukan.",
      code: `Folder yang sering perlu dicek:
- uploads/
- storage/
- storage/logs/
- storage/framework/
- bootstrap/cache/

Prinsip:
gunakan permission secukupnya, bukan selalu 777`,
      lineNotes: [
        "Permission terlalu ketat membuat upload/cache gagal.",
        "Permission terlalu longgar meningkatkan risiko keamanan.",
        "Cek error log untuk tahu folder mana yang bermasalah."
      ],
      exercise: "Cari folder upload atau storage di projectmu, lalu catat fungsinya.",
      recall: "Mengapa 777 tidak boleh menjadi solusi default?",
      debug: {
        question: "Upload gambar gagal di hosting tetapi berhasil di lokal. Apa yang harus dicek?",
        hint: "Folder tujuan upload mungkin tidak bisa ditulis.",
        solution: "Cek path upload, permission folder, ukuran file maksimal, dan error log hosting."
      },
      quiz: {
        question: "Folder storage Laravel biasanya dipakai untuk...",
        options: ["Log, cache, session, dan file aplikasi", "Nama domain", "CSS CDN", "Git commit"],
        answer: 0,
        explanation: "Laravel memakai storage untuk data runtime seperti log, cache, session, dan file."
      }
    }),
    lesson({
      id: "testing-live",
      title: "Testing setelah website live",
      icon: "bi-check2-circle",
      duration: "11 menit",
      goal: "Menguji fitur penting setelah deploy agar project tidak hanya tampil, tetapi benar-benar bekerja.",
      problem: "Banyak project dianggap selesai saat homepage tampil, padahal login, form, upload, dan CRUD belum dites.",
      analogy: "Website live seperti kendaraan yang baru dipindah. Tidak cukup terlihat bagus, rem dan mesin juga harus dites.",
      explanation: "Setelah deploy, test halaman utama, login, register jika ada, CRUD, pencarian, upload, validasi form, logout, akses mobile, SSL, dan halaman error. Catat hasil test dan perbaikan.",
      code: `Checklist test live:
- Home terbuka
- Login berhasil
- Tambah data berhasil
- Edit dan hapus data berhasil
- Upload file berhasil
- Search/filter berjalan
- Logout berjalan
- HTTPS aktif
- Mobile tidak berantakan`,
      lineNotes: [
        "Testing harus memakai domain live.",
        "CRUD membuktikan koneksi database benar.",
        "HTTPS dan mobile penting untuk pengalaman user profesional."
      ],
      exercise: "Buat checklist QA untuk project deploy pertamamu dan tandai fitur yang sudah dites.",
      recall: "Mengapa homepage tampil belum cukup untuk menyatakan deploy berhasil?",
      debug: {
        question: "Homepage tampil, tetapi tambah data gagal. Area apa yang harus dicek?",
        hint: "Fitur tambah data menyentuh form, validasi, database, dan permission.",
        solution: "Cek request form, koneksi database, privilege INSERT, validasi server, CSRF untuk Laravel, dan error log."
      },
      quiz: {
        question: "Deploy dianggap lebih siap jika...",
        options: ["Fitur utama sudah dites di domain live", "Hanya homepage terbuka", "ZIP masih ada di public folder", "APP_DEBUG true"],
        answer: 0,
        explanation: "Testing fitur utama membuktikan aplikasi benar-benar berjalan."
      }
    }),
    lesson({
      id: "debug-database",
      title: "Debug error database",
      icon: "bi-bug",
      duration: "12 menit",
      goal: "Membaca error database umum seperti access denied, unknown database, host salah, dan tabel tidak ditemukan.",
      problem: "Pesan error database sering dianggap menakutkan, padahal biasanya menunjuk langsung ke data konfigurasi yang salah.",
      analogy: "Error database seperti alamat pengiriman yang ditolak. Bisa karena nama gedung, kunci, ruangan, atau izin salah.",
      explanation: "Mulai dari error message. Access denied berarti user/password/privilege. Unknown database berarti nama database salah. Connection timed out berarti host/port/server. Table not found berarti import SQL atau nama tabel belum sesuai.",
      code: `Peta error:
Access denied      -> user, password, privilege
Unknown database   -> nama database
Connection refused -> host, port, server
Table not found    -> import SQL atau migration
SQL syntax error   -> query atau versi database`,
      lineNotes: [
        "Baca pesan error dari awal, bukan langsung menebak.",
        "Cocokkan data konfigurasi dengan cPanel.",
        "Jangan tampilkan detail error database ke user publik."
      ],
      exercise: "Tulis tiga error database yang pernah kamu lihat dan kemungkinan penyebabnya.",
      recall: "Apa perbedaan Access denied dan Unknown database?",
      debug: {
        question: "Error Table users does not exist muncul di Laravel. Apa yang harus dicek?",
        hint: "Tabel belum tentu ada di database hosting.",
        solution: "Cek phpMyAdmin apakah tabel users ada. Jika belum, import SQL lengkap atau jalankan migration sesuai akses hosting."
      },
      quiz: {
        question: "Unknown database biasanya berarti...",
        options: ["Nama database yang dipakai aplikasi tidak ditemukan", "CSS tidak terbaca", "Domain expired", "Browser terlalu baru"],
        answer: 0,
        explanation: "Server database tidak menemukan database dengan nama tersebut."
      }
    }),
    lesson({
      id: "debug-404-500",
      title: "Debug 404, 403, dan 500",
      icon: "bi-exclamation-triangle",
      duration: "13 menit",
      goal: "Membedakan error web server umum dan langkah awal menelusurinya.",
      problem: "Pemula sering menganggap semua error sama, padahal 404, 403, dan 500 punya arah investigasi berbeda.",
      analogy: "404 berarti alamat tidak ketemu, 403 berarti dilarang masuk, 500 berarti mesin di dalam aplikasi bermasalah.",
      explanation: "404 biasanya path atau routing salah. 403 biasanya permission, file index tidak ada, atau akses folder ditolak. 500 biasanya error aplikasi, konfigurasi, versi PHP, extension, .htaccess, atau Laravel cache.",
      code: `Peta cepat:
404 Not Found  -> URL, route, document root, file hilang
403 Forbidden  -> permission, index hilang, folder dilindungi
500 Server Err -> error PHP/Laravel, .htaccess, versi PHP, dependency`,
      lineNotes: [
        "Gunakan error log hosting untuk 500.",
        "Cek document root untuk 404 setelah upload.",
        "Cek file index dan permission untuk 403."
      ],
      exercise: "Buat tabel berisi error 404, 403, 500, gejala, dan langkah pertama yang kamu lakukan.",
      recall: "Mengapa error 500 perlu dilihat dari error log?",
      debug: {
        question: "Website Laravel menampilkan 500 setelah .env diedit. Apa langkah awal?",
        hint: "Cari detail di error log, bukan menebak dari halaman 500.",
        solution: "Cek error log, pastikan APP_KEY ada, DB benar, versi PHP sesuai, vendor tersedia, dan config cache dibersihkan jika perlu."
      },
      quiz: {
        question: "Error 500 biasanya perlu dicek melalui...",
        options: ["Error log hosting atau log aplikasi", "Warna tombol", "Jumlah gambar", "Nama WiFi"],
        answer: 0,
        explanation: "Error 500 bersumber dari server atau aplikasi, detailnya biasanya ada di log."
      }
    }),
    lesson({
      id: "backup-rollback",
      title: "Backup dan rollback",
      icon: "bi-arrow-counterclockwise",
      duration: "11 menit",
      goal: "Membuat kebiasaan backup sebelum perubahan besar dan tahu cara kembali jika deploy gagal.",
      problem: "Tanpa backup, perubahan kecil di hosting bisa membuat project live rusak dan sulit dikembalikan.",
      analogy: "Backup seperti foto kondisi ruangan sebelum renovasi. Jika renovasi kacau, kamu tahu cara mengembalikan.",
      explanation: "Sebelum update project, backup file dan database. Simpan versi ZIP lama, export database, dan catat perubahan konfigurasi. Rollback berarti mengembalikan file/database ke versi terakhir yang stabil.",
      code: `Checklist sebelum update:
- Backup folder project live
- Export database live
- Simpan versi ZIP baru dan lama
- Catat file konfigurasi yang berubah
- Test di subdomain staging jika ada
- Siapkan langkah rollback`,
      lineNotes: [
        "Backup database wajib sebelum perubahan struktur tabel.",
        "Rollback harus dicoba secara terkontrol, bukan saat panik.",
        "Simpan catatan versi agar tahu file mana yang stabil."
      ],
      exercise: "Rancang skenario rollback jika update halaman admin gagal setelah upload.",
      recall: "Apa perbedaan backup file dan backup database?",
      debug: {
        question: "Update terbaru merusak halaman login. Apa langkah rollback paling aman?",
        hint: "Kembalikan ke versi stabil terakhir.",
        solution: "Restore file project dari backup stabil. Jika update juga mengubah database, restore database dari backup yang sesuai."
      },
      quiz: {
        question: "Backup sebelum update penting karena...",
        options: ["Memudahkan rollback jika deploy gagal", "Membuat CSS otomatis bagus", "Menghapus kebutuhan testing", "Membuat password terlihat publik"],
        answer: 0,
        explanation: "Backup memberi jalan kembali ke versi stabil."
      }
    }),
    lesson({
      id: "keamanan-hosting",
      title: "Keamanan dasar setelah deploy",
      icon: "bi-lock",
      duration: "12 menit",
      goal: "Menerapkan kebiasaan aman agar project live tidak mudah bocor atau rusak.",
      problem: "Project yang berhasil online belum tentu aman jika password, file backup, debug, dan permission dibiarkan terbuka.",
      analogy: "Website live seperti kantor yang sudah buka. Selain bisa dikunjungi, pintu belakang dan arsip rahasia harus dikunci.",
      explanation: "Matikan debug publik, hapus file ZIP/SQL dari folder publik, lindungi .env, gunakan password kuat, batasi user database, aktifkan HTTPS, update dependency, dan jangan menaruh kredensial asli di repository.",
      code: `Checklist keamanan:
- APP_DEBUG=false
- Hapus file .zip dan .sql dari public folder
- .env tidak bisa diakses publik
- Password database kuat
- HTTPS aktif
- Permission tidak terlalu longgar
- Backup disimpan di tempat aman`,
      lineNotes: [
        "File SQL di folder publik bisa berisi data sensitif.",
        "Debug publik bisa membocorkan path dan kredensial.",
        "HTTPS membantu melindungi data saat dikirim."
      ],
      exercise: "Audit satu project live dan cari file yang tidak seharusnya berada di folder publik.",
      recall: "Mengapa file SQL tidak boleh ditinggalkan di document root?",
      debug: {
        question: "Seseorang bisa mengunduh backup.sql dari domain kamu. Apa yang salah?",
        hint: "File backup berada di folder publik.",
        solution: "Hapus atau pindahkan file SQL ke lokasi non-publik, rotasi kredensial jika data sensitif bocor, dan cek ulang document root."
      },
      quiz: {
        question: "File yang sebaiknya tidak dibiarkan di folder publik adalah...",
        options: ["Backup SQL dan ZIP project", "index.php", "style.css", "logo publik"],
        answer: 0,
        explanation: "File backup dapat membocorkan source code, struktur database, atau data."
      }
    }),
    lesson({
      id: "dokumentasi-handover",
      title: "Dokumentasi dan handover profesional",
      icon: "bi-journal-text",
      duration: "12 menit",
      goal: "Membuat catatan deploy yang rapi agar project mudah dirawat oleh diri sendiri, tim, atau klien.",
      problem: "Deploy yang tidak didokumentasikan membuat orang berikutnya kesulitan mencari domain, folder, database, dan cara update.",
      analogy: "Dokumentasi seperti buku manual kantor. Tanpa itu, setiap orang harus menebak ulang semua prosedur.",
      explanation: "Catat URL live, document root, nama database tanpa password, cara backup, cara update, checklist testing, versi PHP, dan kontak provider. Jangan tulis password asli di dokumentasi publik.",
      code: `Template handover:
Project      : Data Wilayah
URL live     : https://data-wilayah.domain-kamu.co.id
Document root: /home/user/data-wilayah.domain-kamu.co.id
Database     : prefix_wilayah
PHP version  : sesuai hosting
Update flow  : backup -> upload ZIP -> extract -> test
Catatan      : password disimpan di password manager`,
      lineNotes: [
        "Dokumentasi boleh menyebut nama database, tetapi jangan password.",
        "Update flow membantu deploy berikutnya lebih cepat.",
        "Checklist test membuat kualitas project lebih konsisten."
      ],
      exercise: "Tulis dokumen handover satu halaman untuk project latihan yang akan kamu deploy.",
      recall: "Data apa yang boleh dicatat tanpa membocorkan rahasia?",
      debug: {
        question: "Tim baru tidak tahu folder domain dan database yang dipakai. Apa yang kurang?",
        hint: "Informasi operasional belum terdokumentasi.",
        solution: "Buat dokumentasi handover berisi URL, document root, database, flow update, backup, testing, dan lokasi penyimpanan password yang aman."
      },
      quiz: {
        question: "Dokumentasi handover profesional sebaiknya berisi...",
        options: ["URL live, folder, database, flow update, testing, dan catatan keamanan", "Password asli di README publik", "Hanya screenshot", "Hanya warna tema"],
        answer: 0,
        explanation: "Handover membantu project dirawat tanpa membocorkan rahasia."
      }
    })
  ];

  const quizQuestions = [
    {
      question: "Deploy project web berarti...",
      options: ["Memindahkan project ke hosting, mengatur domain, database, konfigurasi, dan testing", "Mengubah font saja", "Membuat file ZIP lalu selesai", "Menghapus database lokal"],
      answer: 0,
      explanation: "Deploy lengkap melibatkan file, alamat, database, konfigurasi, dan pengujian."
    },
    {
      question: "Document root adalah...",
      options: ["Folder yang dibaca web server untuk domain tertentu", "Nama database", "Password cPanel", "File SQL"],
      answer: 0,
      explanation: "Document root menentukan file yang tampil saat domain dibuka."
    },
    {
      question: "Menu cPanel untuk membuat database dan user adalah...",
      options: ["MySQL Databases", "File Manager", "Email Accounts", "Images"],
      answer: 0,
      explanation: "MySQL Databases dipakai untuk membuat database, user, dan menghubungkan privilege."
    },
    {
      question: "phpMyAdmin paling tepat dipakai untuk...",
      options: ["Import SQL dan melihat tabel database", "Membuat CSS", "Mengatur Git commit", "Membuat branch"],
      answer: 0,
      explanation: "phpMyAdmin mengelola isi database."
    },
    {
      question: "Error Access denied for user biasanya berkaitan dengan...",
      options: ["User, password, atau privilege database", "Warna navbar", "File gambar", "Meta description"],
      answer: 0,
      explanation: "Access denied menunjukkan kredensial atau izin database bermasalah."
    },
    {
      question: "Untuk project Laravel produksi, APP_DEBUG sebaiknya...",
      options: ["false", "true", "diisi nama domain", "dikosongkan tanpa cek"],
      answer: 0,
      explanation: "APP_DEBUG=false mencegah detail error sensitif tampil ke publik."
    },
    {
      question: "Setelah upload ZIP, hal penting berikutnya adalah...",
      options: ["Extract dan cek struktur folder di document root", "Membiarkan ZIP publik selamanya", "Menghapus domain", "Mengganti semua password menjadi kosong"],
      answer: 0,
      explanation: "File utama harus berada di folder yang benar setelah extract."
    },
    {
      question: "Homepage tampil, tetapi tambah data gagal. Area yang perlu dicek adalah...",
      options: ["Form, database, privilege, validasi, dan error log", "Hanya warna background", "Hanya ukuran logo", "Hanya README"],
      answer: 0,
      explanation: "Fitur tambah data menyentuh beberapa bagian aplikasi."
    },
    {
      question: "Sebelum update project live, kamu sebaiknya...",
      options: ["Backup file dan database", "Menghapus semua log tanpa membaca", "Mengaktifkan debug publik", "Membagikan password di README"],
      answer: 0,
      explanation: "Backup memberi jalan rollback jika update gagal."
    },
    {
      question: "File yang tidak boleh ditinggalkan di folder publik adalah...",
      options: ["File SQL backup dan ZIP source project", "index.php", "style.css", "gambar logo publik"],
      answer: 0,
      explanation: "Backup SQL dan ZIP source dapat membocorkan source code atau data."
    }
  ];

  const recallChallenges = [
    {
      id: "recall-deploy-flow",
      type: "Alur besar",
      title: "Dari lokal ke hosting",
      prompt: "Jelaskan alur deploy project dari laptop sampai domain live.",
      answer: "Audit project lokal, siapkan domain dan document root, buat database dan user, upload ZIP, extract, import SQL, setting koneksi atau .env, lalu test fitur utama di domain live."
    },
    {
      id: "recall-domain-root",
      type: "Hosting",
      title: "Domain dan folder",
      prompt: "Apa hubungan domain, document root, dan file index?",
      answer: "Domain mengarah ke document root. Web server mencari file utama seperti index.php atau index.html di folder itu untuk menampilkan website."
    },
    {
      id: "recall-database",
      type: "Database",
      title: "Database dan user",
      prompt: "Mengapa database saja belum cukup untuk aplikasi bisa konek?",
      answer: "Aplikasi juga membutuhkan user, password, host database, dan privilege user ke database tersebut. Semua nilai harus cocok dengan konfigurasi aplikasi."
    },
    {
      id: "recall-phpmyadmin",
      type: "phpMyAdmin",
      title: "Import SQL",
      prompt: "Apa langkah aman saat import SQL ke hosting?",
      answer: "Pilih database tujuan yang benar di phpMyAdmin, import file SQL terbaru, cek tabel yang terbentuk, lalu pastikan konfigurasi aplikasi menunjuk database yang sama."
    },
    {
      id: "recall-debug",
      type: "Debugging",
      title: "404, 403, 500",
      prompt: "Bedakan error 404, 403, dan 500 dengan bahasa sendiri.",
      answer: "404 berarti alamat atau file tidak ditemukan, 403 berarti akses ditolak, dan 500 berarti ada masalah server atau aplikasi yang perlu dilihat dari log."
    },
    {
      id: "recall-handover",
      type: "Profesional",
      title: "Handover",
      prompt: "Apa saja yang perlu ada di dokumentasi deploy tanpa membocorkan rahasia?",
      answer: "URL live, document root, nama database tanpa password, versi PHP, flow update, cara backup, checklist testing, dan lokasi aman penyimpanan kredensial."
    }
  ];

  const debugChallenges = [
    {
      id: "debug-wrong-root",
      title: "Domain membuka halaman default",
      symptom: "Domain live terbuka, tetapi yang tampil halaman default hosting.",
      code: `Browser:
https://data-wilayah.domain-kamu.co.id

Hasil:
Default Website Page`,
      question: "Apa penyebab paling umum?",
      hint: "Cek folder yang dibaca domain.",
      explanation: [
        "Domain sudah aktif, tetapi file project belum berada di document root yang benar.",
        "Buka menu Domains dan catat document root.",
        "Buka File Manager ke folder tersebut.",
        "Pastikan index.php atau index.html project ada di sana.",
        "Hapus atau ganti file default jika memang sudah tidak dipakai."
      ],
      solution: `Domains -> cek document root
File Manager -> buka folder domain
Upload/extract project ke folder tersebut
Pastikan index.php berada di lokasi yang benar`
    },
    {
      id: "debug-access-denied",
      title: "Access denied database",
      symptom: "Aplikasi gagal konek ke database karena user ditolak.",
      code: `mysqli_sql_exception:
Access denied for user 'prefix_wilayah_user'@'localhost'`,
      question: "Area apa yang harus dicek?",
      hint: "Periksa user, password, host, dan privilege.",
      explanation: [
        "User database mungkin salah.",
        "Password di konfigurasi mungkin berbeda.",
        "User mungkin belum ditambahkan ke database.",
        "Privilege belum disimpan.",
        "Host database bisa berbeda dari localhost."
      ],
      solution: `Cek MySQL Databases:
- user final
- database final
- Add User To Database
- All Privileges sesuai kebutuhan

Samakan koneksi.php atau .env dengan data final.`
    },
    {
      id: "debug-unknown-db",
      title: "Unknown database",
      symptom: "Server database tidak menemukan nama database.",
      code: `SQLSTATE[HY000] [1049] Unknown database 'wilayah'`,
      question: "Mengapa nama database tidak ditemukan?",
      hint: "Hosting sering menambahkan prefix akun.",
      explanation: [
        "Nama database final mungkin bukan wilayah.",
        "cPanel biasanya membuat nama seperti prefix_wilayah.",
        "Konfigurasi aplikasi masih memakai nama lokal.",
        "Database bisa belum dibuat.",
        "Aplikasi harus memakai nama final yang tampil di cPanel."
      ],
      solution: `DB_DATABASE=prefix_wilayah

# atau di PHP native
$db = 'prefix_wilayah';`
    },
    {
      id: "debug-table-missing",
      title: "Table not found",
      symptom: "Aplikasi konek, tetapi tabel tidak ditemukan.",
      code: `Base table or view not found:
1146 Table 'prefix_wilayah.users' doesn't exist`,
      question: "Apa yang perlu dicek di phpMyAdmin?",
      hint: "Koneksi sudah masuk database, tetapi struktur tabel belum ada.",
      explanation: [
        "Database yang dipakai aplikasi mungkin kosong.",
        "File SQL belum diimport.",
        "Import masuk ke database yang berbeda.",
        "Migration Laravel belum dijalankan.",
        "Nama tabel di query bisa berbeda dari tabel nyata."
      ],
      solution: `phpMyAdmin -> pilih prefix_wilayah
Cek apakah tabel users ada
Jika belum ada, import SQL lengkap atau jalankan migration sesuai akses hosting.`
    },
    {
      id: "debug-import-large",
      title: "Import SQL terlalu besar",
      symptom: "phpMyAdmin menolak file SQL karena melebihi limit upload.",
      code: `You probably tried to upload a file that is too large.
Max: 64MiB`,
      question: "Apa opsi penyelesaiannya?",
      hint: "Bisa pecah file atau gunakan bantuan hosting.",
      explanation: [
        "Setiap hosting punya batas upload phpMyAdmin.",
        "File SQL bisa dikompres menjadi .zip atau .gz jika didukung.",
        "File dapat dipecah menjadi beberapa bagian.",
        "Jika punya akses terminal, mysql CLI bisa dipakai.",
        "Provider hosting bisa membantu menaikkan limit atau import manual."
      ],
      solution: `Opsi:
- export ulang hanya tabel yang dibutuhkan
- kompres SQL menjadi .zip/.gz jika didukung
- pecah SQL menjadi beberapa file
- minta bantuan provider hosting untuk import besar`
    },
    {
      id: "debug-500",
      title: "500 Server Error",
      symptom: "Halaman hanya menampilkan Internal Server Error.",
      code: `HTTP ERROR 500
This page isn't working`,
      question: "Langkah pertama yang profesional apa?",
      hint: "Jangan menebak dari halaman 500 saja.",
      explanation: [
        "Error 500 berarti server atau aplikasi gagal memproses request.",
        "Detail penyebab biasanya ada di error log.",
        "Cek versi PHP dan extension.",
        "Cek .htaccess dan path file.",
        "Untuk Laravel, cek .env, APP_KEY, vendor, storage, dan cache."
      ],
      solution: `cPanel -> Metrics/Errors atau file error_log
Baca baris error terbaru
Perbaiki penyebab spesifik yang tertulis di log`
    },
    {
      id: "debug-laravel-key",
      title: "Laravel APP_KEY missing",
      symptom: "Laravel gagal berjalan karena application key belum tersedia.",
      code: `RuntimeException
No application encryption key has been specified.`,
      question: "Apa yang harus disiapkan?",
      hint: "Cek APP_KEY di .env.",
      explanation: [
        "Laravel membutuhkan APP_KEY untuk enkripsi.",
        ".env produksi mungkin belum punya APP_KEY.",
        "APP_KEY sebaiknya dibuat aman.",
        "Jika punya terminal, gunakan php artisan key:generate.",
        "Jika tidak, generate lokal lalu masukkan ke .env hosting."
      ],
      solution: `APP_KEY=base64:isi_app_key_kamu

# jika ada terminal:
php artisan key:generate
php artisan config:clear`
    },
    {
      id: "debug-storage",
      title: "Storage not writable",
      symptom: "Laravel atau fitur upload gagal menulis file.",
      code: `The stream or file "storage/logs/laravel.log" could not be opened in append mode: Permission denied`,
      question: "Folder apa yang perlu dicek?",
      hint: "Laravel perlu menulis log, cache, dan file runtime.",
      explanation: [
        "Folder storage atau bootstrap/cache tidak bisa ditulis.",
        "Permission terlalu ketat.",
        "Owner file bisa berbeda setelah upload.",
        "Fitur upload juga butuh folder tujuan yang benar.",
        "Gunakan permission sesuai panduan hosting."
      ],
      solution: `Cek permission:
- storage/
- storage/logs/
- storage/framework/
- bootstrap/cache/

Gunakan izin secukupnya sesuai provider, hindari 777 sebagai default.`
    },
    {
      id: "debug-ssl",
      title: "Mixed content setelah HTTPS",
      symptom: "Halaman HTTPS terbuka, tetapi sebagian asset tidak tampil.",
      code: `Mixed Content:
The page was loaded over HTTPS, but requested an insecure script 'http://...'`,
      question: "Apa penyebabnya?",
      hint: "Asset masih dipanggil dengan HTTP.",
      explanation: [
        "Website memakai HTTPS, tetapi asset memakai URL http.",
        "Browser memblokir request tidak aman.",
        "APP_URL Laravel mungkin masih http.",
        "Link asset sebaiknya relatif atau memakai https.",
        "Setelah mengubah config, cache perlu dibersihkan."
      ],
      solution: `Gunakan https atau path relatif:
<link rel="stylesheet" href="/assets/css/style.css">

Laravel:
APP_URL=https://domain-kamu
php artisan config:clear`
    },
    {
      id: "debug-public-secret",
      title: "File backup bisa diunduh",
      symptom: "File backup.sql atau project.zip bisa dibuka langsung dari browser.",
      code: `https://domain-kamu/backup.sql
https://domain-kamu/admin_wilayah.zip`,
      question: "Mengapa ini berbahaya?",
      hint: "File backup bisa berisi data dan source code.",
      explanation: [
        "File SQL bisa berisi data sensitif.",
        "File ZIP bisa berisi source code dan konfigurasi.",
        "Folder publik tidak cocok untuk menyimpan backup.",
        "Jika sudah terlanjur terbuka, anggap data sensitif berisiko.",
        "Hapus file publik dan rotasi kredensial bila perlu."
      ],
      solution: `Hapus file backup dari document root:
- backup.sql
- project.zip
- .env cadangan

Simpan backup di lokasi aman non-publik atau storage lokal terenkripsi.`
    }
  ];

  const projects = [
    {
      id: "project-static",
      title: "Deploy website statis",
      level: "Pemula",
      goal: "Mempublish project HTML/CSS/JS ke domain atau subdomain hosting.",
      icon: "bi-window",
      features: ["domain", "File Manager", "index.html", "testing mobile"],
      steps: ["Audit file", "Buat subdomain", "Upload ZIP", "Extract", "Test halaman"],
      hint: "Mulai dari website statis agar fokus pada domain, folder, dan upload.",
      example: { title: "Portfolio Static", subtitle: "HTML/CSS/JS live", progress: 82, tags: ["Domain", "ZIP", "Test"] }
    },
    {
      id: "project-php-db",
      title: "Deploy PHP native database",
      level: "Pemula +",
      goal: "Mendeploy CRUD PHP native dengan koneksi.php dan import SQL.",
      icon: "bi-database-check",
      features: ["koneksi.php", "MySQL", "phpMyAdmin", "CRUD"],
      steps: ["Buat database", "Buat user", "Import SQL", "Edit koneksi.php", "Test CRUD"],
      hint: "Gunakan placeholder di repository dan isi password hanya di hosting.",
      example: { title: "CRUD Wilayah", subtitle: "Database connected", progress: 76, tags: ["MySQL", "CRUD", "phpMyAdmin"] }
    },
    {
      id: "project-laravel",
      title: "Deploy Laravel sederhana",
      level: "Menengah awal",
      goal: "Mendeploy Laravel dengan .env produksi, database hosting, dan folder public yang benar.",
      icon: "bi-layers",
      features: [".env", "public", "storage", "APP_KEY"],
      steps: ["Audit versi PHP", "Upload project", "Set .env", "Import/migrate DB", "Cek logs"],
      hint: "Pastikan APP_DEBUG=false dan APP_KEY tersedia sebelum test fitur.",
      example: { title: "Laravel Admin", subtitle: "Production env", progress: 70, tags: [".env", "Public", "Logs"] }
    },
    {
      id: "project-staging",
      title: "Subdomain staging",
      level: "Menengah awal",
      goal: "Membuat area testing sebelum update project utama.",
      icon: "bi-signpost-split",
      features: ["staging", "backup", "test data", "rollback"],
      steps: ["Buat subdomain", "Clone file", "Clone database", "Ubah config", "Test update"],
      hint: "Staging membuat update lebih aman karena project live tidak langsung berubah.",
      example: { title: "staging.domain", subtitle: "Update tested", progress: 68, tags: ["Staging", "Backup", "QA"] }
    },
    {
      id: "project-backup",
      title: "Backup dan rollback drill",
      level: "Menengah awal",
      goal: "Melatih backup file/database dan restore versi stabil.",
      icon: "bi-arrow-counterclockwise",
      features: ["backup file", "export SQL", "restore", "catatan versi"],
      steps: ["Backup live", "Upload versi baru", "Simulasikan error", "Rollback", "Dokumentasikan"],
      hint: "Latihan rollback lebih baik dilakukan di staging sebelum project produksi.",
      example: { title: "Rollback v1.0", subtitle: "Stable restored", progress: 88, tags: ["Backup", "Restore", "Version"] }
    },
    {
      id: "project-handover",
      title: "Dokumentasi handover",
      level: "Profesional",
      goal: "Membuat dokumen serah terima deploy yang rapi tanpa membocorkan password.",
      icon: "bi-journal-text",
      features: ["URL live", "document root", "database", "QA checklist"],
      steps: ["Catat URL", "Catat folder", "Catat DB tanpa password", "Tulis flow update", "Lampirkan test"],
      hint: "Dokumentasi handover adalah pembeda besar antara latihan dan kerja profesional.",
      example: { title: "Deploy Notes", subtitle: "Ready for team", progress: 92, tags: ["Docs", "QA", "Security"] }
    }
  ];

  const badges = [
    { id: "hosting-starter", title: "Hosting Starter", icon: "bi-compass-fill", check: (state) => state.completedLessons.length >= 1 },
    { id: "domain-ready", title: "Domain Ready", icon: "bi-globe2", check: (state) => ["domain-hosting", "buat-domain", "upload-zip"].every((id) => state.completedLessons.includes(id)) },
    { id: "database-ready", title: "Database Ready", icon: "bi-database-fill-check", check: (state) => ["buat-database", "user-privilege", "import-phpmyadmin"].every((id) => state.completedLessons.includes(id)) },
    { id: "config-safe", title: "Config Safe", icon: "bi-shield-lock-fill", check: (state) => ["koneksi-php", "env-laravel", "keamanan-hosting"].every((id) => state.completedLessons.includes(id)) },
    { id: "deploy-debugger", title: "Deploy Debugger", icon: "bi-bug-fill", check: (state) => state.completedDebug.length >= 5 },
    { id: "project-deployer", title: "Project Deployer", icon: "bi-rocket-takeoff-fill", check: (state) => state.completedProjects.length >= 3 },
    { id: "handover-pro", title: "Handover Pro", icon: "bi-award-fill", check: (state) => state.completedLessons.length >= 20 && state.completedDebug.length >= 10 }
  ];

  const editorDefaults = {
    checklist: `Checklist deploy cPanel:
1. Login ke cPanel dari client area hosting atau alamat server hostingmu
2. Domains -> Create A New Domain
3. Domain: data-wilayah.domain-kamu.co.id
4. MySQL Databases -> Create New Database: prefix_wilayah
5. Add New User: prefix_wilayah_user
6. Add User To Database: prefix_wilayah_user -> prefix_wilayah
7. Manage User Privileges -> All Privileges untuk latihan
8. File Manager -> buka document root domain
9. Upload admin_wilayah.zip
10. Extract dan cek index.php
11. Edit koneksi.php atau .env
12. phpMyAdmin -> import wilayah_2026-06-12.sql
13. Test login, CRUD, upload, logout, HTTPS`,
    connection: `<?php
$host = 'host-database-kamu';
$user = 'prefix_wilayah_user';
$pass = 'password_database_kamu';
$db   = 'prefix_wilayah';

$conn = mysqli_connect($host, $user, $pass, $db);
if (!$conn) {
    die('Koneksi database gagal.');
}`,
    database: `Catatan phpMyAdmin:
- Pilih database prefix_wilayah sebelum import
- Import file wilayah_2026-06-12.sql
- Cek tabel users, wilayah, dan tabel utama lain
- Pastikan user database punya privilege yang cukup
- Jangan simpan file .sql di document root setelah import
- Backup database live sebelum update berikutnya`
  };

  return {
    lessons,
    quizQuestions,
    recallChallenges,
    debugChallenges,
    projects,
    badges,
    editorDefaults
  };
})();
