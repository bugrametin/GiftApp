// src/data/openaiAPI.js


const OPENAI_KEY = ''; 

export const getGiftSuggestion = async (gender, budget, category, details) => {
  try {
    // BURASI ÇOK ÖNEMLİ: Yapay Zekaya "Emir kipi kullanma, sadece ürün adı ver" diyoruz.
    const prompt = `
      Sen profesyonel bir hediye danışmanısın.
      Kullanıcı: ${gender}, Bütçe: ${budget} TL, İlgi: ${category}, Detay: ${details}.

      GÖREV: Bu kişi için piyasada bulunabilecek EN YARATICI ve SPESİFİK ürünün SADECE ADINI yaz.
      
      KURALLAR:
      1. ASLA "satın al", "öneririm", "alabilirsin" gibi kelimeler kullanma.
      2. ASLA cümle kurma. Sadece ürünün adını yaz.
      3. Marka veya model uydurma.
      4. Örnek çıktı formatı: "İsme Özel Deri Cüzdan" veya "Galatasaray Logolu 3D Gece Lambası"
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 60,
        temperature: 0.7,
      })
    });

    const json = await response.json();
    
    if (json.error) {
        console.error("OpenAI API Hatası:", json.error);
        return null;
    }

    // Gelen cevabı temizliyoruz (Tırnak işareti vs varsa siliyoruz)
    const suggestion = json.choices[0].message.content.trim().replace(/["\.]/g, '');
    console.log("🤖 Yapay Zeka Önerisi:", suggestion);
    
    return suggestion;

  } catch (error) {
    console.error("OpenAI Bağlantı Hatası:", error);
    return null;
  }
};