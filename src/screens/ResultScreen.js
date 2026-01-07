import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, KeyboardAvoidingView, Linking, Modal, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fetchGiftsFromGoogle } from '../data/giftAPI';
import { getGiftSuggestion, refineGiftSuggestion } from '../data/openaiAPI';

export default function ResultScreen({ route, navigation }) {
  const params = route.params || {};
  const { gender='unisex', budget='0', category='Genel', details='', darkMode=false, age='20', relation='Arkadaş' } = params;
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [refineLoading, setRefineLoading] = useState(false);
  const [refineCount, setRefineCount] = useState(0); 

  const theme = {
    bgColors: darkMode ? ['#141E30', '#3b0f30ff'] : ['rgba(245, 134, 236, 1)', 'rgba(135, 240, 234, 1)'],
    cardBg: darkMode ? '#2C3A47' : '#ffffff',
    text: darkMode ? '#ecf0f1' : '#2d3436',
    subText: darkMode ? '#bdc3c7' : '#636e72',
    accent: '#3498db',
    accentGradient: ['#11998e', '#38ef7d'],
    shadow: darkMode ? '#000' : '#e6be8a',
  };

  useEffect(() => { performSearch(false); }, []);

  const performSearch = async (isRefine = false, customSuggestion = null) => {
    try {
        if (!isRefine) setLoading(true); else setRefineLoading(true);
        let suggestion = customSuggestion;
        if (!suggestion) {
            suggestion = await getGiftSuggestion(gender, age, relation, budget, category, details);
        }
        let data = [];
        if (suggestion) {
            setAiSuggestion(suggestion);
            data = await fetchGiftsFromGoogle(suggestion);
        } else {
            data = await fetchGiftsFromGoogle(`${category} hediye`);
        }
        setResults(data || []);
        if(!isRefine && data && data.length > 0) saveToHistory(suggestion, data.length);
    } catch (error) {
        Alert.alert("Hata", "Arama sırasında bir sorun oluştu.");
    } finally {
        setLoading(false);
        setRefineLoading(false);
    }
  };

  const handleRefine = async () => {
    if (refineCount >= 2) {
        setModalVisible(false);
        Alert.alert("Hakkınız Doldu 🛑", "Lütfen yeni bir arama başlatın.", [{ text: "Tamam", onPress: () => navigation.popToTop() }]);
        return;
    }
    if (!feedback.trim()) return;
    setModalVisible(false); setRefineLoading(true); 
    const originalProfile = { age, gender, category: category || 'Genel', relation, details, budget };
    const newSuggestion = await refineGiftSuggestion(aiSuggestion, feedback, originalProfile);
    setRefineCount(prev => prev + 1); 
    if (newSuggestion) performSearch(true, newSuggestion);
    else performSearch(true, feedback);
    setFeedback(""); 
  };

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
        if (newFavs.find(f => f.link === item.link)) { Alert.alert("Bilgi", "Bu ürün zaten favorilerde."); return; }
        newFavs.unshift(item);
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
        Alert.alert("Başarılı", "Favorilere eklendi! ❤️");
    } catch (e) {}
  };

  if (loading) {
      return (
        <LinearGradient colors={theme.bgColors} style={styles.center}>
            <LottieView source={{ uri: 'https://lottie.host/5a5420a8-3694-432d-ae67-5421a7c5c02c/6q5o6JqQ9i.json' }} autoPlay loop style={{ width: 250, height: 250 }} />
            <Text style={{ marginTop: 20, color: theme.text, fontWeight:'600', fontSize: 18 }}>Sihirbaz Düşünüyor... 🪄</Text>
        </LinearGradient>
      );
  }

  return (
    <LinearGradient colors={theme.bgColors} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
      
      {/* ÖZEL HEADER */}
      <View style={styles.customHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={28} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Sonuçlar</Text>
          <View style={{width: 28}} />
      </View>

      {/* AI ÖNERİSİ */}
      {aiSuggestion && (
          <View style={[styles.aiBox, { backgroundColor: darkMode ? '#2d3436' : 'rgba(255,255,255,0.8)', borderColor: theme.shadow }]}>
              <View style={{flexDirection:'row', alignItems:'center', marginBottom:5}}>
                  <Ionicons name="sparkles" size={18} color="#f1c40f" />
                  <Text style={[styles.aiLabel, { color: theme.text }]}> Yapay Zeka Diyor ki:</Text>
              </View>
              <Text style={[styles.aiText, { color: theme.subText }]}>{aiSuggestion}</Text>
          </View>
      )}

      {refineLoading && (
        <View style={styles.refineLoader}>
            <Text style={{color:'white', fontWeight:'bold'}}>Listeyi yeniliyorum...</Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{padding: 20, paddingBottom: 100}} 
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<View style={{alignItems:'center', marginTop: 50}}><Text>Sonuç bulunamadı.</Text></View>}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.cardBg, shadowColor: theme.shadow }]}>
             <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
                <TouchableOpacity style={styles.favButton} onPress={() => addToFavorites(item)}>
                     <Ionicons name="heart-circle" size={32} color="rgba(0,0,0,0.4)" />
                </TouchableOpacity>
             </View>
             <View style={styles.cardContent}>
                 <Text style={[styles.sourceText, { color: theme.accent }]}>{item.source}</Text>
                 <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{item.name}</Text>
                 <TouchableOpacity activeOpacity={0.8} style={styles.goButton} onPress={() => item.link && Linking.openURL(item.link)}>
                    <Text style={styles.goButtonText}>Ürüne Git</Text>
                    <Ionicons name="arrow-forward" size={16} color="white" />
                 </TouchableOpacity>
             </View>
          </View>
        )}
      />

      <View style={styles.floatingContainer}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => setModalVisible(true)}>
            <LinearGradient colors={['#2c3e50', '#4ca1af']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.floatingBtn}>
                <Ionicons name="options-outline" size={24} color="white" style={{marginRight: 8}} />
                <View><Text style={styles.floatingBtnTitle}>Sonuçları Düzelt</Text><Text style={styles.floatingBtnSub}>Kalan Hak: {2 - refineCount}</Text></View>
            </LinearGradient>
        </TouchableOpacity>
      </View>

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
            <View style={[styles.modalView, { backgroundColor: theme.cardBg }]}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>🎁 Fikrini Değiştirelim</Text>
                <TextInput style={[styles.modalInput, { color: theme.text }]} placeholder="Örn: Daha ucuz olsun..." placeholderTextColor={theme.subText} value={feedback} onChangeText={setFeedback} multiline />
                <TouchableOpacity activeOpacity={0.8} onPress={handleRefine}>
                    <LinearGradient colors={theme.accentGradient} style={styles.modalMainBtn}><Text style={styles.modalBtnText}>Sihirbazı Tekrar Çalıştır ✨</Text></LinearGradient>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
      </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  customHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingTop: 10, paddingBottom: 10 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  aiBox: { margin: 20, marginBottom: 10, padding: 15, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  aiLabel: { fontSize: 14, fontWeight: 'bold' },
  aiText: { fontSize: 14, lineHeight: 20 },
  refineLoader: { padding: 10, backgroundColor: '#f39c12', alignItems: 'center', marginHorizontal: 20, borderRadius: 10, marginBottom: 10 },
  card: { flexDirection: 'column', marginBottom: 20, borderRadius: 20, padding: 10, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  imageContainer: { width: '100%', height: 180, backgroundColor: 'white', borderRadius: 15, justifyContent:'center', alignItems:'center', marginBottom: 10, position: 'relative' },
  image: { width: '90%', height: '90%' },
  favButton: { position: 'absolute', top: 5, right: 5 },
  cardContent: { paddingHorizontal: 8, paddingBottom: 5 },
  sourceText: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 12, lineHeight: 22 },
  goButton: { backgroundColor: '#2ecc71', flexDirection:'row', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 10, justifyContent:'center', alignItems:'center', alignSelf:'flex-start' },
  goButtonText: { color: 'white', fontWeight: 'bold', marginRight: 5, fontSize: 13 },
  floatingContainer: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center', zIndex: 100 },
  floatingBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 50, elevation: 10 },
  floatingBtnTitle: { color: 'white', fontWeight: 'bold', fontSize: 15 },
  floatingBtnSub: { color: '#bdc3c7', fontSize: 10 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, elevation: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  modalInput: { borderRadius: 12, padding: 15, height: 100, textAlignVertical: 'top', marginBottom: 20, fontSize:16, borderWidth:1, borderColor: '#eee' },
  modalMainBtn: { padding: 16, borderRadius: 15, alignItems: 'center' },
  modalBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});