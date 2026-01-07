import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HistoryScreen({ route, navigation }) {
  const { darkMode = false } = route.params || {};
  const [history, setHistory] = useState([]);

  const theme = {
    bgColors: darkMode ? ['#141E30', '#3b0f30ff'] : ['rgba(245, 134, 236, 1)', 'rgba(135, 240, 234, 1)'],
    cardBg: darkMode ? '#2C3A47' : '#ffffff',
    text: darkMode ? '#ecf0f1' : '#2d3436',
    subText: darkMode ? '#bdc3c7' : '#636e72',
    date: darkMode ? '#95a5a6' : '#a4b0be',
    shadow: darkMode ? '#000' : '#e6be8a',
    deleteBtn: '#e74c3c'
  };

  useEffect(() => { loadHistory(); }, []);

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
    <LinearGradient colors={theme.bgColors} style={styles.container}>
        <SafeAreaView style={{flex: 1}}>
        
        {/* ÖZEL HEADER */}
        <View style={styles.customHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="chevron-back" size={28} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Geçmiş Aramalar</Text>
            <View style={{width: 28}} /> 
        </View>

        {/* Alt Bilgi ve Temizle Butonu */}
        <View style={styles.subHeaderRow}>
            <Text style={{ color: theme.subText, fontSize: 13, flex: 1 }}>Önceki hediye fikirlerin.</Text>
            {history.length > 0 && (
                <TouchableOpacity onPress={clearHistory} style={[styles.clearBtn, { backgroundColor: theme.deleteBtn }]}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons name="trash-outline" size={16} color="white" style={{marginRight: 4}} />
                        <Text style={styles.clearBtnText}>Temizle</Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>

        <FlatList
            data={history}
            keyExtractor={item => item.id}
            contentContainerStyle={{padding: 20}}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Ionicons name="time-outline" size={50} color={theme.subText} />
                    <Text style={{ color: theme.subText, marginTop: 10 }}>Henüz geçmiş yok.</Text>
                </View>
            }
            renderItem={({ item }) => (
                <View style={[styles.card, { backgroundColor: theme.cardBg, shadowColor: theme.shadow }]}>
                    <View style={styles.cardIcon}>
                        <Ionicons name="gift" size={24} color="#f1c40f" />
                    </View>
                    <View style={{ flex: 1, paddingHorizontal: 12 }}>
                        <Text style={[styles.summary, { color: theme.text }]}>{item.summary}</Text>
                        <Text style={[styles.date, { color: theme.date }]}>{item.date}</Text>
                    </View>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{item.count}</Text>
                    </View>
                </View>
            )}
        />
        </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  customHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingTop: 10, paddingBottom: 10 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  subHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  
  clearBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  clearBtnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  
  card: { flexDirection: 'row', padding: 16, borderRadius: 16, marginBottom: 14, alignItems: 'center', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  cardIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(241, 196, 15, 0.15)', justifyContent:'center', alignItems:'center' },
  summary: { fontSize: 15, fontWeight: '600' },
  date: { fontSize: 12, marginTop: 4 },
  countBadge: { backgroundColor: '#3498db', width: 35, height: 35, borderRadius: 10, justifyContent:'center', alignItems:'center' },
  countText: { color: 'white', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 80 }
});