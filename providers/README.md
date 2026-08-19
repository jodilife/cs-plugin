# Provider format & notes

Folder `providers/` berisi file-file provider. Setiap file adalah modul JavaScript yang mengekspor objek dengan fungsi-fungsi utama:

- name: string
- version: string
- author: string
- search(query): async function yang mengembalikan array item { title, url, poster, year }
- detail(itemUrl): async function yang mengembalikan objek { title, synopsis, episodes }
- resolve(streamUrl): async function yang mengembalikan direct stream URL (jika perlu)

Contoh file skeleton `example_provider.js` dapat dipakai sebagai template untuk menambahkan provider baru.

Catatan: Spesifikasi fungsi dan nama properti bisa berbeda antar fork CloudStream. Jika provider gagal di-load, periksa dokumentasi versi CloudStream yang Anda pakai.
