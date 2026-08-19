// example_provider.js
// Contoh skeleton provider untuk CloudStream (JavaScript)
// Penjelasan singkat: sesuaikan fungsi `search`, `detail`, dan `resolve` dengan struktur situs target.

module.exports = {
  // Metadata
  name: "Contoh Provider",
  version: "1.0",
  author: "jodilife",
  lang: "id",

  // Contoh fungsi search — menerima query string, mengembalikan array item
  search: async function(query) {
    // NOTE: lingkungan runtime provider pada CloudStream mungkin tidak mendukung `fetch` di semua versi.
    // Gunakan metode HTTP yang sesuai pada runtime Anda. Jika runtime mendukung fetch, uncomment contoh di bawah:
    // const res = await fetch(`https://example.com/api/search?q=${encodeURIComponent(query)}`);
    // const json = await res.json();
    // return json.results.map(r => ({ title: r.title, url: r.url, poster: r.poster, year: r.year }));

    // Dummy result sebagai contoh
    return [
      { title: "Contoh Film", url: "https://example.com/film/1", poster: "", year: 2022 }
    ];
  },

  // Ambil detail film/episode
  detail: async function(itemUrl) {
    // Parse halaman detail, ambil title, synopsis, dan daftar episode / source
    // Contoh format kembalian:
    return {
      title: "Contoh Film",
      synopsis: "Ini adalah contoh sinopsis.",
      // episodes: array objek { name, url }
      episodes: [
        { name: "Episode 1", url: "https://example.com/stream/abc" }
      ]
    };
  },

  // Resolve streaming URL ke direct link (jika perlu)
  resolve: async function(streamUrl) {
    // Jika streamUrl sudah direct link, kembalikan apa adanya.
    return streamUrl;
  }
};
