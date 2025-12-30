// src/screens/ResultScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchGiftsFromGoogle } from '../data/giftAPI';
import { getGiftSuggestion } from '../data/openaiAPI';

export default function ResultScreen({ route }) {
  const { gender = 'unisex', budget = '0', category = 'Genel', details = '', darkMode = false } = route.params || {};
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  // Tema Renkleri
  const theme = {
    bg: darkMode ? '#1e272e' : '#f4f6f8',
    card: darkMode ? '#485460' : '#fff',
    text: darkMode ? '#d2dae2' : '#2c3e50',
    subText: darkMode ? '#d2dae2' : '#95a5a6'
  };

  useEffect(() => {
    const doSmartSearch = async () => {
        try {
            const suggestion = await getGiftSuggestion(gender, budget, category, details);
            let query = "";
            
            if (suggestion) {
                setAiSuggestion(suggestion);
                query = `${suggestion} satın al`;
            } else {
                query = `${gender} ${category} ${details} hediye`;
            }

            console.log("🔎 Aranıyor:", query);
            const data = await fetchGiftsFromGoogle(query);
            setResults(data);
            
            const saveText = suggestion ? `🤖 AI: ${suggestion}` : `${category} ${details}`;
            saveToHistory(saveText, data.length);

        } catch (error) {
            console.error("Hata:", error);
        } finally {
            setLoading(false);
        }
    };
    doSmartSearch();
  }, []);

  const saveToHistory = async (summary, count) => {
      try {
          const historyItem = { id: Date.now().toString(), date: new Date().toLocaleDateString('tr-TR'), summary: summary, count: count };
          const oldHistory = await AsyncStorage.getItem('history');
          const newHistory = oldHistory ? JSON.parse(oldHistory) : [];
          newHistory.unshift(historyItem);
          await AsyncStorage.setItem('history', JSON.stringify(newHistory));
      } catch(e) {}
  };

  const addToFavorites = async (item) => {
    try {
        const oldFavs = await AsyncStorage.getItem('favorites');
        let newFavs = oldFavs ? JSON.parse(oldFavs) : [];
        if (newFavs.find(f => f.link === item.link)) { Alert.alert("Zaten Ekli", "Favorilerde var."); return; }
        newFavs.unshift(item);
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
        Alert.alert("Başarılı", "Eklendi! ❤️");
    } catch (e) {}
  };

  if (loading) {
      return (
        <View style={[styles.center, { backgroundColor: theme.bg }]}>
            <ActivityIndicator size="large" color="#3498db"/>
            <Text style={{marginTop: 10, color: theme.text}}>Yapay Zeka hediye seçiyor...</Text>
        </View>
      );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      
      {aiSuggestion && (
          <View style={[styles.aiBox, { borderColor: darkMode ? '#fff' : '#3498db', backgroundColor: darkMode ? '#2d3436' : '#e8f6fd' }]}>
              <Text style={[styles.aiLabel, { color: theme.text }]}>✨ Yapay Zeka Önerisi:</Text>
              <Text style={[styles.aiText, { color: theme.text }]}>{aiSuggestion}</Text>
          </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={{padding: 15}}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop:50, color: theme.subText}}>Sonuç bulunamadı.</Text>}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            <View style={styles.info}>
                <Text style={[styles.source, { color: theme.subText }]}>{item.source}</Text>
                <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{item.name}</Text>
                
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
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  aiBox: { padding: 15, margin: 15, marginBottom: 5, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  aiLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  aiText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  card: { flexDirection: 'row', marginBottom: 12, borderRadius: 12, padding: 10, elevation: 2 },
  image: { width: 90, height: 90, borderRadius: 8, marginRight: 15, backgroundColor: '#f0f0f0' },
  info: { flex: 1, justifyContent: 'space-between', paddingVertical: 5 },
  title: { fontWeight: '600', fontSize: 14, marginBottom: 5 },
  source: { fontSize: 12, fontWeight: '500' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  linkBtn: { padding: 5 },
  linkText: { color: '#3498db', fontWeight: 'bold', fontSize: 14 },
  favBtn: { backgroundColor: '#ffebee', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  favText: { color: '#e91e63', fontSize: 12, fontWeight: 'bold' }
});