// src/screens/ResultScreen.js
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { fetchGiftsFromGoogle } from '../data/giftAPI';
// DÜZELTME BURADA: Doğru fonksiyon ismini çağırıyoruz
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGiftSuggestion } from '../data/openaiAPI';

export default function ResultScreen({ route }) {
  const { gender = 'unisex', budget = '0', category = 'Genel', details = '' } = route.params || {};
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  useEffect(() => {
    const doSmartSearch = async () => {
        try {
            // 1. Önce OpenAI'a sor
            // DÜZELTME BURADA: getGiftSuggestion kullanıyoruz
            const suggestion = await getGiftSuggestion(gender, budget, category, details);
            
            let query = "";
            
            if (suggestion) {
                setAiSuggestion(suggestion);
                // Google'da aranacak kelime: "Galatasaray Logolu 3D Gece Lambası satın al"
                query = `${suggestion} satın al`;
            } else {
                // AI cevap vermezse B planı
                query = `${gender} ${category} ${details} hediye`;
            }

            console.log("🔎 Google'da aranıyor:", query);
            
            // 2. Google'dan ürünleri çek
            const data = await fetchGiftsFromGoogle(query);
            setResults(data);

            // 3. Geçmişe Kaydet
            const saveText = suggestion ? `🤖 ${suggestion}` : `${category} ${details}`;
            saveToHistory(saveText, data.length);

        } catch (error) {
            console.error("Genel Hata:", error);
        } finally {
            setLoading(false);
        }
    };
    doSmartSearch();
  }, []);

  const saveToHistory = async (summary, count) => {
      const historyItem = { id: Date.now().toString(), date: new Date().toLocaleDateString('tr-TR'), summary: summary, count: count };
      try {
          const oldHistory = await AsyncStorage.getItem('history');
          const newHistory = oldHistory ? JSON.parse(oldHistory) : [];
          newHistory.unshift(historyItem);
          await AsyncStorage.setItem('history', JSON.stringify(newHistory));
      } catch(e) { console.log(e); }
  };

  const addToFavorites = async (item) => {
    try {
        const oldFavs = await AsyncStorage.getItem('favorites');
        let newFavs = oldFavs ? JSON.parse(oldFavs) : [];
        const exists = newFavs.find(f => f.link === item.link);
        if (exists) { Alert.alert("Zaten Ekli", "Bu ürün favorilerinizde var."); return; }
        newFavs.unshift(item);
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
        Alert.alert("Başarılı", "Favorilere eklendi! ❤️");
    } catch (e) { console.error(e); }
  };

  if (loading) {
      return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#3498db"/>
            <Text style={{marginTop: 10, color: '#555', textAlign:'center'}}>
                Yapay Zeka en yaratıcı hediyeyi düşünüyor... 🤔
            </Text>
        </View>
      );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      {aiSuggestion && (
          <View style={styles.aiBox}>
              <Text style={styles.aiLabel}>✨ Yapay Zeka Önerisi:</Text>
              <Text style={styles.aiText}>{aiSuggestion}</Text>
          </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={{padding: 15}}
        ListEmptyComponent={<Text style={styles.emptyText}>Sonuç bulunamadı.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            <View style={styles.info}>
                <Text style={styles.source}>{item.source}</Text>
                <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
                
                <View style={styles.btnRow}>
                    <TouchableOpacity style={styles.linkBtn} onPress={() => item.link && Linking.openURL(item.link)}>
                        <Text style={styles.linkText}>Ürüne Git →</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.favBtn} onPress={() => addToFavorites(item)}>
                        <Text style={styles.favText}>❤️ Ekle</Text>
                    </TouchableOpacity>
                </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  aiBox: { backgroundColor: '#e8f6fd', padding: 15, margin: 15, marginBottom: 5, borderRadius: 12, borderWidth: 1, borderColor: '#3498db', alignItems: 'center' },
  aiLabel: { color: '#2980b9', fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  aiText: { color: '#2c3e50', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  card: { flexDirection: 'row', backgroundColor: 'white', marginBottom: 12, borderRadius: 12, padding: 10, elevation: 2 },
  image: { width: 90, height: 90, borderRadius: 8, marginRight: 15, backgroundColor: '#f0f0f0' },
  info: { flex: 1, justifyContent: 'space-between', paddingVertical: 5 },
  title: { fontWeight: '600', fontSize: 14, color: '#2c3e50', marginBottom: 5 },
  source: { color: '#95a5a6', fontSize: 12, fontWeight: '500' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  linkBtn: { padding: 5 },
  linkText: { color: '#3498db', fontWeight: 'bold', fontSize: 14 },
  favBtn: { backgroundColor: '#ffebee', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  favText: { color: '#e91e63', fontSize: 12, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#7f8c8d' }
});