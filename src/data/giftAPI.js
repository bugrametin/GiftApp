

export const fetchGiftsFromGoogle = async (query) => {
  try {
    // 1. Temizlik
    let baseQuery = query
      .replace(/['"()]/g, '')
      .replace(/öner/gi, '') 
      .replace(/bul/gi, '') 
      .trim();

    // 2. Güvenilir Siteler
    const trustedSites = "site:trendyol.com OR site:hepsiburada.com OR site:amazon.com.tr OR site:morhipo.com OR site:boyner.com.tr OR site:zara.com OR site:bershka.com OR site:ciceksepeti.com";
    
    // --- DEBUG 1: Sorguyu Görelim ---
    console.log("🚀 ARAMA BAŞLIYOR: ", baseQuery);

    const strictQuery = `${baseQuery} ${trustedSites}`;
    const urlStrict = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(strictQuery)}&cx=${SEARCH_ENGINE_ID}&key=${GOOGLE_API_KEY}&num=6&safe=active&gl=tr&hl=tr&searchType=image`; 
    // NOT: searchType=image ekledim, hediye resimlerini daha net bulsun diye.

    let response = await fetch(urlStrict);
    let json = await response.json();

    // --- DEBUG 2: Google Ne Cevap Verdi? ---
    if (json.error) {
        console.error("❌ GOOGLE API HATASI (Kritik):", JSON.stringify(json.error, null, 2));
        // Hata kodunu görmek sorunu çözer (403: Kota bitti, 400: Hatalı istek vb.)
        return [];
    }

    let items = json.items || [];
    console.log(`📊 İlk Arama Sonucu Sayısı: ${items.length}`);

    // --- FALLBACK (Yedek Plan) ---
    if (items.length === 0) {
      console.warn("⚠️ Mağazalarda bulunamadı, GENEL ARAMAYA geçiliyor...");
      
      const broadQuery = `${baseQuery} satın al`;
      // Buradaki searchType=image parametresini kaldırdım, belki resim bulamıyordur, normal arasın.
      const urlBroad = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(broadQuery)}&cx=${SEARCH_ENGINE_ID}&key=${GOOGLE_API_KEY}&num=6&safe=active&gl=tr&hl=tr`;

      const responseBroad = await fetch(urlBroad);
      const jsonBroad = await responseBroad.json();
      
      // --- DEBUG 3: Yedek Plan Cevabı ---
      if (jsonBroad.error) {
          console.error("❌ YEDEK PLAN API HATASI:", jsonBroad.error);
      }
      
      items = jsonBroad.items || [];
      console.log(`📊 Yedek Arama Sonucu Sayısı: ${items.length}`);
    }

    // 4. Sonuçları Dönüştürme
    if (items.length > 0) {
      return items.map((item) => {
        // Resim bulma garantisi (Pagemap yoksa varsayılan resim)
        let imageUrl = "https://via.placeholder.com/150"; 
        
        if (item.pagemap?.cse_image?.length > 0) {
            imageUrl = item.pagemap.cse_image[0].src;
        } else if (item.pagemap?.cse_thumbnail?.length > 0) {
            imageUrl = item.pagemap.cse_thumbnail[0].src;
        } else if (item.link && (item.link.endsWith('.jpg') || item.link.endsWith('.png'))) {
            // Eğer image search yaptıysak link direkt resimdir
            imageUrl = item.link;
        }

        return {
            id: item.link, 
            name: item.title || "Hediye",
            image: imageUrl, 
            source: item.displayLink || "Web",
            link: item.image?.contextLink || item.link // Görsel aramada contextLink ana sayfadır
        };
      });
    } else {
      console.log("⛔ Hiçbir aşamada ürün bulunamadı.");
      return []; 
    }

  } catch (error) {
    console.error("💥 Ciddi Kod Hatası:", error);
    return [];
  }
};