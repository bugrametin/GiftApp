import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  // State Tanımlamaları
  const [age, setAge] = useState('');
  const [relation, setRelation] = useState('Arkadaş');
  const [gender, setGender] = useState('unisex'); 
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const relations = ['Sevgili', 'Arkadaş', 'Anne/Baba', 'Kardeş', 'Eş', 'Çocuk'];

  // ARAMA BUTONU FONKSİYONU
  const handleSearch = () => {
    console.log("Butona basıldı!"); // Debug için
    console.log("Veriler:", { age, budget, category });

    // 1. KONTROL: Eksik bilgi var mı?
    if(!category.trim() || !age.trim() || !budget.trim()) { 
        Alert.alert("Eksik Bilgi ⚠️", "Lütfen şu alanları doldurun:\n- Yaş\n- Bütçe\n- İlgi Alanı"); 
        return; 
    }

    // 2. NAVİGASYON: Her şey tamsa diğer sayfaya git
    console.log("Sonuç sayfasına gidiliyor...");
    navigation.navigate('Result', { 
        gender, 
        budget, 
        category, 
        details, 
        darkMode, 
        age, 
        relation 
    });
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
        
        {/* ÜST BAŞLIK */}
        <View style={styles.topBar}>
            <Text style={[styles.header, { color: theme.text }]}>🎁 Hediye Sihirbazı</Text>
            <View style={styles.switchContainer}>
                <Text style={{ fontSize: 12, color: theme.text, marginRight: 5 }}>{darkMode ? '🌙' : '☀️'}</Text>
                <Switch 
                    value={darkMode} 
                    onValueChange={setDarkMode}
                    trackColor={{ false: "#767577", true: "#3498db" }}
                    thumbColor={darkMode ? "#f1c40f" : "#f4f3f4"}
                />
            </View>
        </View>

        {/* 1. KİME ALIYORUZ? */}
        <Text style={[styles.label, { color: theme.text }]}>Kime Hediye Alıyorsun?</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
            {relations.map((r) => (
                <TouchableOpacity 
                    key={r}
                    style={[styles.chip, relation === r ? styles.selectedChip : { backgroundColor: theme.card }]}
                    onPress={() => setRelation(r)}>
                    <Text style={[styles.chipText, { color: relation === r ? 'white' : theme.text }]}>{r}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

        {/* 2. YAŞ VE CİNSİYET */}
        <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={[styles.label, { color: theme.text }]}>Yaşı Kaç? (*)</Text>
                <TextInput 
                    style={[styles.input, { backgroundColor: theme.card, borderColor: theme.inputBorder, color: theme.text }]} 
                    keyboardType="numeric" 
                    placeholder="Örn: 22" 
                    placeholderTextColor={theme.placeholder}
                    value={age}
                    onChangeText={setAge}
                />
            </View>
            <View style={{ flex: 1.5 }}> 
                <Text style={[styles.label, { color: theme.text }]}>Cinsiyet</Text>
                <View style={{ flexDirection: 'row' }}>
                    {['kadin', 'erkek', 'diger'].map((g) => (
                        <TouchableOpacity 
                            key={g}
                            style={[styles.genderBtn, gender === g ? styles.selectedBtn : { backgroundColor: theme.card }]} 
                            onPress={() => setGender(g)}>
                            <Text style={{ fontSize: 16 }}>
                                {g === 'kadin' ? '👩' : g === 'erkek' ? '👨' : '🌈'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>

        {/* 3. BÜTÇE */}
        <Text style={[styles.label, { color: theme.text }]}>Bütçe (TL) (*)</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.inputBorder, color: theme.text }]} 
          keyboardType="numeric" 
          placeholder="Örn: 5000" 
          placeholderTextColor={theme.placeholder}
          value={budget}
          onChangeText={setBudget}
        />

        {/* 4. İLGİ ALANI */}
        <Text style={[styles.label, { color: theme.text }]}>En Sevdiği Şeyler (*)</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.inputBorder, color: theme.text }]} 
          placeholder="Disney, Futbol, Resim..." 
          placeholderTextColor={theme.placeholder}
          value={category}
          onChangeText={setCategory}
        />

        {/* 5. EKSTRA DETAY */}
        <Text style={[styles.label, { color: theme.text }]}>Ekstra Detay (İsteğe Bağlı)</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.card, borderColor: theme.inputBorder, color: theme.text }]} 
          placeholder="Zarif sever, sporcu..." 
          placeholderTextColor={theme.placeholder}
          value={details}
          onChangeText={setDetails}
        />

        {/* ARAMA BUTONU */}
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>HEDİYELERİ BUL 🚀</Text>
        </TouchableOpacity>

        {/* GEÇMİŞ VE FAVORİLER BUTONLARI */}
        <View style={{ flexDirection: 'row', marginTop: 25, justifyContent: 'space-between', paddingBottom: 40 }}>
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
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  header: { fontSize: 24, fontWeight: 'bold' },
  switchContainer: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 15, marginTop: 15, marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 1, padding: 12, borderRadius: 10, fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  
  chip: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#ddd' },
  selectedChip: { backgroundColor: '#3498db', borderColor: '#3498db' },
  chipText: { fontWeight: '600' },

  genderBtn: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', marginHorizontal: 2, borderWidth: 1, borderColor: '#ddd' },
  selectedBtn: { backgroundColor: '#3498db', borderColor: '#3498db' },

  searchBtn: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 15, alignItems: 'center', marginTop: 30 },
  searchBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },

  smallBtn: { flex: 0.48, padding: 15, borderRadius: 10, alignItems: 'center' },
  smallBtnText: { color: 'white', fontWeight: 'bold' }
});