# cs-plugin

Repo ini berisi provider CloudStream yang bisa ditambahkan ke aplikasi melalui URL raw GitHub.

Tujuan:
- Menyimpan satu atau lebih provider (format JavaScript) di folder `providers/`.
- Memudahkan pengguna menambahkan provider ke CloudStream dengan menempelkan URL raw file provider.

Apa yang ada di repo ini:
- providers/example_provider.js — contoh skeleton provider (JavaScript)
- providers/README.md — panduan cepat format provider
- examples/test_request.txt — contoh URL raw yang bisa dipakai di CloudStream
- README.md — dokumentasi singkat (Anda sedang membacanya)
- LICENSE — MIT
- .gitignore

Cara pakai singkat:
1. Salin URL raw file provider, mis.:
   https://raw.githubusercontent.com/jodilife/cs-plugin/main/providers/example_provider.js
2. Di aplikasi CloudStream: menu Add custom provider / Add source by URL → paste URL raw di atas.
3. Reload provider list di aplikasi.

Catatan kompatibilitas:
- Skeleton ini ditulis untuk provider JavaScript generik yang dipakai oleh banyak fork CloudStream. Jika Anda menggunakan versi CloudStream berbasis Kotlin/Android yang membutuhkan format berbeda, beri tahu saya supaya saya buatkan versi Kotlin.

