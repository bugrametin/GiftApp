// src/screens/HomeScreen.js
import { Picker } from '@react-native-picker/picker'; // YENİ PAKET
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [gender, setGender] = useState('unisex');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  
  // YENİ STATE'LER
  const [occasion, setOccasion] = useState('Doğum Günü'); // Varsayılan sebep
  const [details, setDetails] = useState(''); // Detaylı yorum

  const handleSearch = () => {
    if(!budget) { Alert.alert("Eksik Bilgi", "Lütfen bir bütçe girin."); return; }
    if(!category) { Alert.alert("Eksik Bilgi", "Lütfen en az bir ilgi alanı girin."); return; }

    // Tüm yeni bilgileri Sonuç ekranına gönderiyoruz
    navigation.navigate('Result', { gender, budget, category, occasion, details });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* KeyboardAvoidingView: Klavye açılınca ekranı yukarı iter */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>🎁 Yapay Zeka Asistanı</Text>
        
        {/* 1. CİNSİYET */}
        <Text style={styles.label}>Kime hediye bakıyoruz?</Text>
        <View style={styles.row}>
          {['erkek', 'kadin', 'unisex'].map((g) => (
              <TouchableOpacity 
                  key={g}
                  style={[styles.optionBtn, gender === g && styles.selectedBtn]} 
                  onPress={() => setGender(g)}>
                  <Text style={[styles.btnText, gender === g && styles.selectedBtnText]}>
                    {g === 'kadin' ? 'Kadın' : g === 'erkek' ? 'Erkek' : 'Farketmez'}
                  </Text>
              </TouchableOpacity>
          ))}
        </View>

        {/* 2. SEBEP (PICKER - YENİ) */}
        <Text style={styles.label}>Hediye Sebebi Nedir?</Text>
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={occasion}
                onValueChange={(itemValue) => setOccasion(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="🎂 Doğum Günü" value="Doğum Günü" />
                <Picker.Item label="💑 Yıldönümü/Sevgililer Günü" value="Yıldönümü veya Sevgililer Günü" />
                <Picker.Item label="🎄 Yılbaşı" value="Yılbaşı" />
                <Picker.Item label="🎓 Mezuniyet/Yeni İş" value="Mezuniyet veya Yeni İş Tebriği" />
                <Picker.Item label="🏡 Ev Hediyesi" value="Ev Görme Hediyesi" />
                <Picker.Item label="✨ Sadece İçimden Geldi" value="Sebepsiz, içimden geldi" />
            </Picker>
        </View>

        {/* 3. BÜTÇE */}
        <Text style={styles.label}>Maksimum Bütçe (TL)</Text>
        <TextInput 
          style={styles.input} 
          keyboardType="numeric" 
          placeholder="Örn: 2000" 
          value={budget}
          onChangeText={setBudget}
        />

        {/* 4. İLGİ ALANLARI */}
        <Text style={styles.label}>İlgi Alanları / Hobiler:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Örn: Kahve, Kamp, Yazılım, Kedi..." 
          value={category}
          onChangeText={setCategory}
        />

        {/* 5. DETAYLI YORUM (TEXTAREA - YENİ) */}
        <Text style={styles.label}>Ekstra Detaylar (İsteğe Bağlı):</Text>
        <Text style={styles.subLabel}>AI'ya ipucu ver (Örn: "Pembe sevmez, retro tarzı sever")</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Yapay zekaya notun..." 
          value={details}
          onChangeText={setDetails}
          multiline={true} // Çok satırlı olması için
          numberOfLines={3}
        />

        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>YAPAY ZEKAYA SOR 🧠</Text>
        </TouchableOpacity>

        {/* ALT MENÜ */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 30}}>
            <TouchableOpacity 
                style={[styles.historyBtn, {flex: 1, marginRight: 5, backgroundColor: '#e8f6fd'}]} 
                onPress={() => navigation.navigate('History')}>
                <Text style={styles.historyBtnText}>⏳ Geçmiş</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.historyBtn, {flex: 1, marginLeft: 5, backgroundColor: '#fde8e8'}]} 
                onPress={() => navigation.navigate('Favorites')}>
                <Text style={[styles.historyBtnText, {color: '#e74c3c'}]}>❤️ Favoriler</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f4f6f8' },
  container: { padding: 20, justifyContent: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#2c3e50', marginTop: 10 },
  label: { fontSize: 16, marginTop: 15, marginBottom: 8, fontWeight: '700', color: '#34495e' },
  subLabel: { fontSize: 12, color: '#7f8c8d', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#dcdcdc', padding: 15, borderRadius: 12, backgroundColor: '#fff', fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' }, // Çok satırlı alan stili
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  optionBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#dcdcdc', borderRadius: 10, alignItems: 'center', marginHorizontal: 4, backgroundColor: 'white' },
  selectedBtn: { backgroundColor: '#3498db', borderColor: '#3498db' },
  btnText: { color: '#7f8c8d', fontWeight: '600' },
  selectedBtnText: { color: 'white' },
  pickerContainer: { borderWidth: 1, borderColor: '#dcdcdc', borderRadius: 12, backgroundColor: '#fff', overflow: 'hidden' },
  picker: { height: Platform.OS === 'ios' ? 150 : 55 }, // iOS'ta picker daha yüksek olmalı
  searchBtn: { backgroundColor: '#6c5ce7', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 25, shadowColor: '#6c5ce7', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  searchBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  historyBtn: { marginTop: 10, alignItems: 'center', padding: 12, borderRadius: 10 },
  historyBtnText: { fontSize: 14, fontWeight: '600', color: '#3498db' }
});