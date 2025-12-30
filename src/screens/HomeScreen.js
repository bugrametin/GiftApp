// src/screens/HomeScreen.js
import { useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [gender, setGender] = useState('unisex');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const occasions = [
    { id: 'dogum_gunu', label: 'Doğum Günü', emoji: '🎂' },
    { id: 'yildonumu', label: 'Yıldönümü', emoji: '💍' },
    { id: 'yilbasi', label: 'Yılbaşı', emoji: '🎄' },
    { id: 'sevgililer', label: 'Sevgililer G.', emoji: '❤️' },
    { id: 'yeni_is', label: 'Yeni İş', emoji: '💼' },
    { id: 'icimden_geldi', label: 'Öylesine', emoji: '🎁' },
  ];

  const handleSearch = () => {
    if(!category) { 
        Alert.alert("Eksik Bilgi", "Lütfen bir ilgi alanı girin."); 
        return; 
    }
    navigation.navigate('Result', { gender, budget, category, details, darkMode });
  };

  const theme = {
    bg: darkMode ? '#1e272e' : '#f4f6f8',
    text: darkMode ? '#d2dae2' : '#2c3e50',
    card: darkMode ? '#485460' : '#fff',
    inputBorder: darkMode ? '#808e9b' : '#dcdcdc',
    placeholder: darkMode ? '#95a5a6' : '#7f8c8d'
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Üst Bar */}
        <View style={styles.topBar}>
            <Text style={[styles.header, { color: theme.text }]}>🎁 Hediye Sihirbazı</Text>
            <View style={styles.switchContainer}>
                <Text style={{ fontSize: 12, color: theme.text, marginRight: 5 }}>
                    {darkMode ? '🌙' : '☀️'}
                </Text>
                <Switch 
                    value={darkMode} 
                    onValueChange={setDarkMode}
                    trackColor={{ false: "#767577", true: "#3498db" }}
                    thumbColor={darkMode ? "#f1c40f" : "#f4f3f4"}
                />
            </View>
        </View>

        {/* LOGO */}
        <View style={styles.logoContainer}>
            <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4213/4213652.png' }} 
                style={styles.logo} 
                resizeMode="contain"
            />
        </View>
        
        {/* CİNSİYET SEÇİMİ (DÜZELTİLDİ) */}
        <Text style={[styles.label, { color: theme.text }]}>Kime hediye bakıyoruz?</Text>
        <View style={styles.row}>
          {['erkek', 'kadin', 'unisex'].map((g) => {
              const isSelected = gender === g;
              return (
                <TouchableOpacity 
                    key={g}
                    // Mantık: Seçiliyse Mavi (#3498db), Değilse Tema Rengi
                    style={[
                        styles.optionBtn, 
                        { 
                            backgroundColor: isSelected ? '#3498db' : theme.card, 
                            borderColor: isSelected ? '#3498db' : theme.inputBorder 
                        }
                    ]} 
                    onPress={() => setGender(g)}>
                    
                    <Text style={[
                        styles.btnText, 
                        // Mantık: Seçiliyse Beyaz, Değilse Tema Rengi
                        { color: isSelected ? 'white' : theme.text }
                    ]}>
                        {g === 'kadin' ? 'Kadın' : g === 'erkek' ? 'Erkek' : 'Farketmez'}
                    </Text>
                </TouchableOpacity>
              );
          })}
        </View>

        {/* SEBEP SEÇİMİ (DÜZELTİLDİ) */}
        <Text style={[styles.label, { color: theme.text }]}>Sebep Nedir?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
            {occasions.map((item) => {
                const isSelected = details.includes(item.label);
                return (
                    <TouchableOpacity 
                        key={item.id}
                        // Aynı mantık buraya da uygulandı
                        style={[
                            styles.occasionBtn, 
                            { 
                                backgroundColor: isSelected ? '#3498db' : theme.card, 
                                borderColor: isSelected ? '#3498db' : theme.inputBorder 
                            }
                        ]}
                        onPress={() => setDetails(item.label)}
                    >
                        <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                        <Text style={[
                            styles.occasionText, 
                            { color: isSelected ? 'white' : theme.text }
                        ]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>

        {/* Bütçe */}
        <Text style={[styles.label, { color: theme.text }]}>Bütçen ne kadar? (TL)</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.inputBorder, color: theme.text }]} 
          keyboardType="numeric" 
          placeholder="Örn: 1000" 
          placeholderTextColor={theme.placeholder}
          value={budget}
          onChangeText={setBudget}
        />

        {/* İlgi Alanı */}
        <Text style={[styles.label, { color: theme.text }]}>İlgi Alanı / Kategori:</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.inputBorder, color: theme.text }]} 
          placeholder="Örn: Futbol, Teknoloji, Makyaj..." 
          placeholderTextColor={theme.placeholder}
          value={category}
          onChangeText={setCategory}
        />

        {/* Detay */}
        <Text style={[styles.label, { color: theme.text }]}>Ekstra Detay:</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.inputBorder, color: theme.text }]} 
          placeholder="Örn: Kırmızı, Nike, L beden..." 
          placeholderTextColor={theme.placeholder}
          value={details}
          onChangeText={setDetails}
        />

        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>HEDİYELERİ BUL 🚀</Text>
        </TouchableOpacity>

        {/* Alt Butonlar */}
        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', paddingBottom: 30 }}>
            <TouchableOpacity 
                style={[styles.smallBtn, { backgroundColor: '#f39c12' }]} 
                onPress={() => navigation.navigate('History', { darkMode })}>
                <Text style={styles.smallBtnText}>🕒 Geçmiş</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.smallBtn, { backgroundColor: '#e74c3c' }]} 
                onPress={() => navigation.navigate('Favorites', { darkMode })}>
                <Text style={styles.smallBtnText}>❤️ Favoriler</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 10 },
  header: { fontSize: 28, fontWeight: 'bold' },
  switchContainer: { flexDirection: 'row', alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 120, height: 120 },
  label: { fontSize: 16, marginTop: 15, marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 1, padding: 12, borderRadius: 10, fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  
  optionBtn: { flex: 1, padding: 12, borderWidth: 1, borderRadius: 10, alignItems: 'center', marginHorizontal: 4 },
  btnText: { fontWeight: '600' },

  occasionBtn: { alignItems: 'center', padding: 10, borderWidth: 1, borderRadius: 12, marginRight: 10, width: 85, height: 80, justifyContent: 'center' },
  occasionText: { fontSize: 11, fontWeight: 'bold', marginTop: 5, textAlign: 'center' },

  searchBtn: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 15, alignItems: 'center', marginTop: 25, shadowColor: '#2ecc71', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  searchBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  smallBtn: { flex: 0.48, padding: 15, borderRadius: 10, alignItems: 'center' },
  smallBtnText: { color: 'white', fontWeight: 'bold' }
});