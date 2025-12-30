// src/screens/HistoryScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HistoryScreen({ route, navigation }) {
  // HomeScreen'den gelen darkMode bilgisini alıyoruz
  const { darkMode = false } = route.params || {};
  const [history, setHistory] = useState([]);

  // Tema Ayarları
  const theme = {
    bg: darkMode ? '#1e272e' : '#f4f6f8',
    card: darkMode ? '#485460' : '#fff',
    text: darkMode ? '#d2dae2' : '#2c3e50',
    date: darkMode ? '#bdc3c7' : '#95a5a6',
    emptyText: darkMode ? '#808e9b' : '#bdc3c7'
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await AsyncStorage.getItem('history');
    if(data) setHistory(JSON.parse(data));
  };

  const clearHistory = async () => {
      Alert.alert(
          "Geçmişi Temizle", 
          "Tüm arama kayıtları silinsin mi?",
          [
              { text: "Vazgeç", style: "cancel" },
              { text: "Evet, Sil", style: "destructive", onPress: async () => {
                  await AsyncStorage.removeItem('history');
                  setHistory([]);
              }}
          ]
      );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      
      {/* Üst Başlık ve Temizle Butonu */}
      <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.text }]}>📜 Son Aramalar</Text>
          {history.length > 0 && (
              <TouchableOpacity onPress={clearHistory} style={styles.clearBtn}>
                  <Text style={styles.clearBtnText}>Temizle 🗑️</Text>
              </TouchableOpacity>
          )}
      </View>

      <FlatList
        data={history}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingBottom: 20}}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={{fontSize: 40, marginBottom: 10}}>🕸️</Text>
                <Text style={[styles.empty, { color: theme.emptyText }]}>Henüz bir arama yapmadın.</Text>
            </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.summary, { color: theme.text }]}>{item.summary}</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{item.count} Sonuç</Text>
                </View>
            </View>
            <Text style={[styles.date, { color: theme.date }]}>📅 {item.date}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 10 },
  title: { fontSize: 24, fontWeight: 'bold' },
  clearBtn: { backgroundColor: '#e74c3c', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  clearBtnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  
  card: { padding: 15, borderRadius: 15, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 },
  summary: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 10 },
  countBadge: { backgroundColor: '#3498db', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  countText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  date: { fontSize: 12, fontStyle: 'italic', marginTop: 5 },
  
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  empty: { fontSize: 16 }
});