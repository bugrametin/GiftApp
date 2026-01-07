import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, KeyboardAvoidingView, Linking, Modal, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fetchGiftsFromGoogle } from '../data/giftAPI';
import { getGiftSuggestion, refineGiftSuggestion } from '../data/openaiAPI';

export default function ResultScreen({ route }) {
  const params = route.params || {};
  // category verisinin geldiğinden emin oluyoruz
  const { gender='unisex', budget='0', category='Genel', details='', darkMode=false, age='20', relation='Arkadaş' } = params;
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [refineLoading, setRefineLoading] = useState(false);

  // --- YENİ EKLENEN: SAYAÇ ---
  const [refineCount, setRefineCount] = useState(0); 

  const theme = {
    bg: darkMode ? '#1e272e' : '#f4f6f8',
    card: darkMode ? '#485460' : '#fff',
    text: darkMode ? '#d2dae2' : '#2c3e50',
    subText: darkMode ? '#bdc3c7' : '#95a5a6',
    modalBg: darkMode ? '#2d3436' : '#fff'
  };

  useEffect(() => { performSearch(false); }, []);

  const performSearch = async (isRefine = false, customSuggestion = null) => {
    try {
        if (!isRefine) setLoading(true); else setRefineLoading(true);

        let suggestion = customSuggestion;

        // 1. İLK ARAMA
        if (!suggestion) {
            suggestion = await getGiftSuggestion(gender, age, relation, budget, category, details);
        }

        // 2. GOOGLE ARAMASI
        let data = [];
        if (suggestion) {
            setAiSuggestion(suggestion);
            console.log("🚀 Arama Başlatılıyor:", suggestion);
            data = await fetchGiftsFromGoogle(suggestion);
        } else {
            // Yedek
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
    // --- 1. LİMİT KONTROLÜ (YENİ) ---
    if (refineCount >= 2) {
        setModalVisible(false);
        Alert.alert(
            "Hakkınız Doldu 🛑",
            "En fazla 2 kez değişiklik yapabilirsiniz. Lütfen ana sayfaya dönüp yeni bir arama başlatın."
        );
        return;
    }

    if (!feedback.trim()) return;
    
    setModalVisible(false); 
    setRefineLoading(true); 

    // Profil objesini oluştururken category'yi özellikle vurguluyoruz
    const originalProfile = { 
        age, 
        gender, 
        category: category || 'Genel', // Kategori boşsa 'Genel' gönder
        relation, 
        details, 
        budget 
    };
    
    // AI'ya eski bağlamı (category) hatırlatarak soruyoruz
    const newSuggestion = await refineGiftSuggestion(aiSuggestion, feedback, originalProfile);

    // Dönen temiz kelimeyle aramayı yenile
    if (newSuggestion) {
        // --- SAYAÇ ARTIRMA ---
        setRefineCount(prev => prev + 1); 
        performSearch(true, newSuggestion);
    } else {
        // AI cevap vermezse manuel arama (Yine de sayacı artıralım ki bug'a girmesin)
        setRefineCount(prev => prev + 1);
        performSearch(true, feedback);
    }
    setFeedback(""); 
  };

  // --- STANDARD FONKSİYONLAR ---
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
            <Text style={{marginTop: 10, color: theme.text, fontWeight:'bold', textAlign:'center', paddingHorizontal: 20}}>
                🎁 {category} sever için en uygun hediye seçenekleri taranıyor...
            </Text>
        </View>
      );
  }

  // --- UI RENDER ---
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {aiSuggestion && (
          <View style={[styles.aiBox, { borderColor: darkMode ? '#fff' : '#3498db', backgroundColor: darkMode ? '#2d3436' : '#e8f6fd' }]}>
              <Text style={[styles.aiLabel, { color: theme.text }]}>✨ Akıllı Arama:</Text>
              <Text style={[styles.aiText, { color: theme.text }]}>{aiSuggestion}</Text>
          </View>
      )}

      {refineLoading && <View style={{padding:10, backgroundColor:'#f1c40f'}}><Text style={{textAlign:'center', color:'white', fontWeight:'bold'}}>Sonuçlar güncelleniyor...</Text></View>}

      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{padding: 15, paddingBottom: 100}}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop:50, color: theme.subText}}>😔 Tam eşleşen ürün bulunamadı.{"\n"}Farklı bir şey deneyelim mi?</Text>}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            <View style={styles.info}>
                <Text style={[styles.source, { color: theme.subText }]}>{item.source}</Text>
                <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{item.name}</Text>
                <View style={styles.btnRow}>
                    <TouchableOpacity style={styles.linkBtn} onPress={() => item.link && Linking.openURL(item.link)}><Text style={styles.linkText}>Ürüne Git →</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.favBtn} onPress={() => addToFavorites(item)}><Text style={styles.favText}>❤️</Text></TouchableOpacity>
                </View>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.floatingBtn} onPress={() => setModalVisible(true)}>
        <Text style={{fontSize: 24}}>🪄</Text>
        <Text style={styles.floatingBtnText}>Sonuçları Düzelt ({2 - refineCount} Hak)</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
            <View style={[styles.modalView, { backgroundColor: theme.modalBg }]}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Neyi Değiştirelim?</Text>
                <Text style={{color: theme.subText, marginBottom: 5, fontSize:12, textAlign:'center'}}>
                    Kalan Hakkınız: <Text style={{fontWeight:'bold', color: theme.text}}>{2 - refineCount}</Text>
                </Text>
                <TextInput style={[styles.modalInput, { color: theme.text, borderColor: theme.subText }]} placeholder="Örn: Daha renkli olsun, Figür öner..." placeholderTextColor={theme.subText} value={feedback} onChangeText={setFeedback} multiline />
                <View style={styles.modalBtnRow}>
                    <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#95a5a6' }]} onPress={() => setModalVisible(false)}><Text style={{color:'white'}}>İptal</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#3498db' }]} onPress={handleRefine}><Text style={{color:'white'}}>🔍 Ara</Text></TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  aiBox: { padding: 15, margin: 15, marginBottom: 5, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  aiLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  aiText: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginTop: 5 },
  card: { flexDirection: 'row', marginBottom: 12, borderRadius: 12, padding: 10, elevation: 2 },
  image: { width: 90, height: 90, borderRadius: 8, marginRight: 15, backgroundColor: '#f0f0f0' },
  info: { flex: 1, justifyContent: 'space-between', paddingVertical: 5 },
  title: { fontWeight: '600', fontSize: 14, marginBottom: 5 },
  source: { fontSize: 12, fontWeight: '500' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  linkBtn: { padding: 5 },
  linkText: { color: '#3498db', fontWeight: 'bold', fontSize: 14 },
  favBtn: { backgroundColor: '#ffebee', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  favText: { color: '#e91e63', fontSize: 12, fontWeight: 'bold' },
  floatingBtn: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#2c3e50', flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30, elevation: 5 },
  floatingBtnText: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalView: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 25, shadowColor: '#000', elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalInput: { borderWidth: 1, borderRadius: 10, padding: 10, minHeight: 80, textAlignVertical: 'top', marginBottom: 20 },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'space-between' },
  modalBtn: { flex: 0.48, padding: 15, borderRadius: 10, alignItems: 'center' }
});