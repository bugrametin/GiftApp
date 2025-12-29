// src/screens/HistoryScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // YENİ: Bu kütüphaneyi ekledik
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  // YENİ: Sayfa her odaklandığında (açıldığında) burası çalışır
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('history');
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch (error) {
      console.error("Geçmiş yüklenirken hata:", error);
    }
  };

  const clearHistory = async () => {
      Alert.alert(
          "Temizle", 
          "Tüm geçmiş silinecek, emin misin?",
          [
              { text: "Vazgeç", style: "cancel" },
              { text: "Sil", style: "destructive", onPress: async () => {
                  await AsyncStorage.removeItem('history');
                  setHistory([]);
              }}
          ]
      );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
          <Text style={styles.title}>Arama Geçmişi</Text>
          {history.length > 0 && (
              <TouchableOpacity onPress={clearHistory}>
                  <Text style={styles.clearBtn}>Temizle</Text>
              </TouchableOpacity>
          )}
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{paddingBottom: 20}}
        ListEmptyComponent={<Text style={styles.empty}>Henüz geçmiş kayıt yok.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
                <Text style={styles.text}>{item.summary}</Text>
                <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.badge}>
                <Text style={styles.countText}>{item.count} Sonuç</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f6f8' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  clearBtn: { color: '#e74c3c', fontWeight: 'bold' },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  date: { fontSize: 12, color: '#95a5a6', marginTop: 4 },
  text: { fontSize: 16, fontWeight: '600', color: '#34495e' },
  badge: { backgroundColor: '#e8f6fd', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  countText: { fontSize: 12, color: '#3498db', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, color: '#95a5a6' }
});