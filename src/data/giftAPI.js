// src/data/giftAPI.js


const API_KEY = "AIzaSyD-XXXXXXXXXXXXXXXX"; 

const CX = "YOUR_CUSTOM_SEARCH_ENGINE_ID"; 

export const fetchGiftsFromGoogle = async (query) => {
  try {
    // Arama terimini zenginleştiriyoruz
    // Google'ı sadece büyük E-Ticaret sitelerinde aramaya zorluyoruz
const searchQuery = `${query} site:trendyol.com OR site:hepsiburada.com OR site:amazon.com.tr OR site:ciceksepeti.com`; 
    console.log("Aranıyor:", searchQuery);

    // Google Custom Search API İsteği
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(searchQuery)}&searchType=image&num=10`;

    const response = await fetch(url);
    const json = await response.json();

    if (json.error) {
        console.error("API Hatası:", json.error.message);
        return [];
    }

    if (!json.items) return [];

    // Gelen veriyi uygulamamızın anlayacağı şekle çeviriyoruz
    return json.items.map((item, index) => ({
      id: index.toString(),
      name: item.title || "Ürün",
      image: item.link, 
      link: item.image?.contextLink || item.link, 
      source: item.displayLink || "Mağaza"
    }));

  } catch (error) {
    console.error("Bağlantı Hatası:", error);
    return []; 
  }
};