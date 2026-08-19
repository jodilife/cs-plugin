// providers/dokterjav_provider.js
// Provider untuk https://dokterjav.com/
// Catatan: Sesuaikan selector/regex jika struktur HTML berubah.
// Gunakan provider ini untuk menambah sumber ke CloudStream via raw GitHub URL:
// https://raw.githubusercontent.com/jodilife/cs-plugin/main/providers/dokterjav_provider.js

module.exports = {
  name: "DokterJAV",
  version: "1.0",
  author: "jodilife",
  lang: "id",

  // search(query): cari judul di situs. Jika query kosong, kembalikan daftar terbaru dari homepage.
  search: async function(query) {
    const base = 'https://dokterjav.com';
    const qurl = query && query.trim().length > 0 ? `${base}/?s=${encodeURIComponent(query)}` : base;

    // fetch mungkin tersedia pada runtime CloudStream; jika tidak, sesuaikan dengan API HTTP dari runtime Anda.
    const res = await fetch(qurl, { redirect: 'follow' });
    const html = await res.text();

    const results = [];

    // Cari item posting umum: <h2 class="entry-title"><a href="...">Title</a></h2>
    // Jika struktur berbeda, regex ini masih menangkap banyak variasi <h2><a>...
    const itemRe = /<h[1-6][^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/h[1-6]>/gi;
    let m;
    const seen = new Set();
    while ((m = itemRe.exec(html)) !== null) {
      try {
        const url = m[1];
        let title = m[2].replace(/<[^>]+>/g, '');
        title = title.trim();
        if (!seen.has(url) && title.length > 0 && url.indexOf('dokterjav.com') !== -1) {
          results.push({ title: title, url: url, poster: '', year: '' });
          seen.add(url);
        }
      } catch (e) {
        // ignore parsing errors per-item
      }
    }

    // Jika tidak ditemukan lewat heading, coba cari link artikel lain (generic article link)
    if (results.length === 0) {
      const linkRe = /<a[^>]*href="([^"]+)"[^>]*>([^<]{5,200}?)<\/a>/gi;
      while ((m = linkRe.exec(html)) !== null && results.length < 30) {
        const url = m[1];
        let title = m[2].replace(/<[^>]+>/g, '').trim();
        if (url.indexOf('dokterjav.com') !== -1 && title.length > 5 && !seen.has(url)) {
          results.push({ title: title, url: url, poster: '', year: '' });
          seen.add(url);
        }
      }
    }

    return results;
  },

  // detail(itemUrl): ambil detail posting dan daftar episode/source (iframe atau video)
  detail: async function(itemUrl) {
    const res = await fetch(itemUrl, { redirect: 'follow' });
    const html = await res.text();

    // title
    let title = '';
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1) title = h1[1].replace(/<[^>]+>/g, '').trim();

    // synopsis / excerpt
    let synopsis = '';
    const descMatch = html.match(/<div[^>]*(?:entry-content|post-content|content)[^>]*>([\s\S]*?)<\/div>/i);
    if (descMatch) {
      synopsis = descMatch[1].replace(/<[^>]+>/g, '').trim();
      if (synopsis.length > 1000) synopsis = synopsis.substring(0,1000) + '...';
    }

    // Temukan iframe embed (sering digunakan untuk video)
    const episodes = [];
    let m;
    const iframeRe = /<iframe[^>]*src="([^"]+)"[^>]*><\/iframe>/gi;
    let idx = 1;
    while ((m = iframeRe.exec(html)) !== null) {
      let src = m[1].trim();
      // convert protocol-relative URLs
      if (src.startsWith('//')) src = 'https:' + src;
      // jika ada parameter / redirect, biarkan resolver di CloudStream menangani
      episodes.push({ name: `Source ${idx}`, url: src });
      idx++;
    }

    // Cari tag <video> atau <source>
    const videoRe = /<video[^>]*>[\s\S]*?<source[^>]*src="([^"]+)"[^>]*>/gi;
    while ((m = videoRe.exec(html)) !== null) {
      const src = m[1].trim();
      episodes.push({ name: `Video ${idx}`, url: src });
      idx++;
    }

    // Jika tidak ada iframe/video, coba cari link internal ke "play" atau "stream"
    if (episodes.length === 0) {
      const playRe = /href="([^"]*play[^"]*)"/gi;
      while ((m = playRe.exec(html)) !== null) {
        let src = m[1];
        if (src.startsWith('/')) src = 'https://dokterjav.com' + src;
        episodes.push({ name: `Play ${idx}`, url: src });
        idx++;
      }
    }

    // Jika tetap kosong, tambahkan halaman itu sebagai satu sumber agar CloudStream dapat mencoba resolvers
    if (episodes.length === 0) {
      episodes.push({ name: 'Halaman', url: itemUrl });
    }

    return {
      title: title || itemUrl,
      synopsis: synopsis || '',
      episodes: episodes
    };
  },

  // resolve(streamUrl): kembalikan direct streaming link bila sudah direct, atau biarkan resolver CloudStream memprosesnya.
  // Di banyak kasus, streamUrl adalah halaman embed—CloudStream built-in resolvers akan mencoba mengekstrak direct link.
  resolve: async function(streamUrl) {
    // Jika streamUrl mengandung sumber yang jelas (mis. .m3u8, .mp4), kembalikan langsung
    if (/\.m3u8(\?|$)/i.test(streamUrl) || /\.mp4(\?|$)/i.test(streamUrl)) return streamUrl;

    // Jika URL adalah halaman yang mengandung direct link di atribut data-src atau window.player, coba fetch dan ekstrak
    try {
      const res = await fetch(streamUrl, { redirect: 'follow' });
      const html = await res.text();
      // cari m3u8/mp4 di HTML
      const m = html.match(/https?:\\/\\/[^"'\s>]+\.(?:m3u8|mp4)(?:\?[^"'\s>]*)?/i);
      if (m) return m[0].replace(/\\/g, '');
    } catch (e) {
      // ignore
    }

    // fallback: kembalikan streamUrl supaya CloudStream mencoba resolver lain
    return streamUrl;
  }
};
