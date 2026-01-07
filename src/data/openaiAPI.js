// src/data/openaiAPI.js


// --- 1. FONKSİYON: İLK HEDİYE ÖNERİSİNİ BULMA ---
export const getGiftSuggestion = async (gender, age, relation, budget, category, details) => {
  try {
    const isAdult = age > 17;
    let genderTerm = "";
    if (gender === 'kadin' || gender === 'unisex') genderTerm = "Kadın";
    else if (gender === 'erkek') genderTerm = "Erkek";

    const prompt = `
      ROLÜN: Sen zevkli bir hediye danışmanısın.
      GÖREVİN: Kullanıcının girdiği verileri analiz et ve EN MANTIKLI TEK BİR hediye ürünü bul.

      PROFİL: ${age} Yaş, ${genderTerm}.
      İLGİLER: "${category} ${details}"

      KURALLAR:
      1. SIKICI HEDİYE FİLTRESİ: "Ders Kitabı", "Test Kitabı" ASLA ÖNERME. "Ajanda" ise "Tasarım Ajanda" öner.
      2. AYRIŞTIRMA: Uyumsuz ilgi alanlarını birleştirme. Hediye olmaya en müsait olanı seç.
      3. YETİŞKİN BEDENİ: Ayakkabı/Giyim öneriyorsan başına "${genderTerm}" ekle. (Örn: "${genderTerm} Disney Sweatshirt").
      4. MAT UYARISI: "Mat" kelimesini tek kullanma ("Mat Renkli" de).

      SONUÇ:
      Arama motorunda çıkacak 3-4 kelimelik TEK BİR ürün adı.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50,
        temperature: 0.2,
      })
    });

    const json = await response.json();
    if (json.error) return null;
    
    let suggestion = json.choices[0].message.content.trim();
    return suggestion.replace(/["\.]/g, '');

  } catch (error) { return null; }
};

// --- 2. FONKSİYON: HAFIZALI GÜNCELLEME (BAĞLAMI KORUYAN) ---
export const refineGiftSuggestion = async (currentSuggestion, userFeedback, profile) => {
  try {
    // BURASI ÇOK ÖNEMLİ:
    // profile.category (İlgi Alanı) verisini burada kullanıyoruz.
    // Eğer ResultScreen'den bu veriyi göndermezsek yapay zeka Disney'i unutur.
    
    const contextPrompt = profile.category 
        ? `UNUTMA: Kullanıcının ASIL İLGİ ALANI: "${profile.category}". Yeni önereceğin şey MUTLAKA bu konuyla ilgili olmalı.` 
        : "";

    const prompt = `
      GÖREV: Mevcut hediye önerisini, BAĞLAMI KOPARMADAN güncelle.
      
      ESKİ ÖNERİ: "${currentSuggestion}"
      KULLANICI İSTEĞİ: "${userFeedback}"
      PROFİL: ${profile.age} Yaş.
      
      KRİTİK TALİMATLAR:
      1. ${contextPrompt}
      (Örnek: İlgi alanı "Disney" ise ve kullanıcı "Figür olsun" dediyse -> "Sıradan Figür" VERME, "Disney Koleksiyon Figürü" VER).

      2. NİTELİK DEĞİŞİKLİĞİ (Renk, Fiyat):
         - Kullanıcı sadece özellik (renk/ucuzluk) belirtiyorsa ÜRÜN TÜRÜNÜ DEĞİŞTİRME.
         - Örn: "Ajanda" -> "Daha renkli" -> "Renkli Desenli Ajanda".
      
      3. YETİŞKİN BEDENİ:
         - Ayakkabı/Kıyafet öneriyorsan başına "Kadın/Erkek" ekle.

      ÇIKTI:
      Yeni Ürün Adı
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 60,
        temperature: 0.2, 
      })
    });

    const json = await response.json();
    if (json.error) return null;

    let suggestion = json.choices[0].message.content.trim();
    console.log("♻️ Akıllı Revize:", suggestion);
    return suggestion.replace(/["\.]/g, '');

  } catch (error) { return null; }
};