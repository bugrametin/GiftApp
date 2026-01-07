import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

// --- DÜZELTME 1: Bu bileşeni ana fonksiyonun DIŞINA aldık. ---
// Artık her harf yazışında yeniden oluşturulmayacak, kasma sorunu bitecek.
const CustomInput = ({ icon, placeholder, value, onChange, keyboard = 'default', theme }) => (
  <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, shadowColor: theme.shadow }]}>
      <Ionicons name={icon} size={20} color={theme.subText} style={{ marginRight: 10 }} />
      <TextInput 
          style={[styles.input, { color: theme.text }]} 
          placeholder={placeholder}
          placeholderTextColor={theme.subText}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboard}
      />
  </View>
);
// -------------------------------------------------------------

export default function HomeScreen({ navigation }) {
  const [age, setAge] = useState('');
  const [relation, setRelation] = useState('Arkadaş');
  const [gender, setGender] = useState('unisex'); 
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const relations = ['Sevgili', 'Arkadaş', 'Anne/Baba', 'Kardeş', 'Eş', 'Çocuk'];

  const handleSearch = () => {
    if(!category.trim() || !age.trim() || !budget.trim()) { 
        Alert.alert("Eksik Bilgi ⚠️", "Lütfen şu alanları doldurun:\n- Yaş\n- Bütçe\n- İlgi Alanı"); 
        return; 
    }
    navigation.navigate('Result', { gender, budget, category, details, darkMode, age, relation });
  };

  const theme = {
    bgColors: darkMode ? ['#141E30', '#3b0f30ff'] : ['rgba(245, 134, 236, 1)', 'rgba(135, 240, 234, 1)'],
    text: darkMode ? '#ecf0f1' : '#2d3436',
    subText: darkMode ? '#bdc3c7' : '#636e72',
    cardBg: darkMode ? '#2C3A47' : '#ffffff',
    inputBg: darkMode ? '#1e272e' : '#ffffff', 
    shadow: darkMode ? '#000' : '#e6be8a',
    primary: '#3498db',
  };

  return (
    <LinearGradient colors={theme.bgColors} style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
            
            {/* --- DÜZELTME 2: Klavye açılınca ekranı yukarı iten yapı --- */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                style={{ flex: 1 }}
            >
                <ScrollView 
                    contentContainerStyle={styles.container} 
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled" // Klavye açıkken butona basabilmek için
                >
                    
                    {/* ÜST BAŞLIK */}
                    <View style={styles.topBar}>
                        <View>
                            <Text style={[styles.header, { color: theme.text }]}>Hediye Sihirbazı</Text>
                            <Text style={{ color: theme.subText, fontSize: 13 }}>En doğru hediyeyi saniyeler içinde bul ✨</Text>
                        </View>
                        <View style={styles.switchContainer}>
                            <Ionicons name={darkMode ? "moon" : "sunny"} size={20} color={darkMode ? "#f1c40f" : "#f39c12"} style={{ marginRight: 5 }} />
                            <Switch 
                                value={darkMode} 
                                onValueChange={setDarkMode}
                                trackColor={{ false: "#dfe6e9", true: "#34495e" }}
                                thumbColor={darkMode ? "#3498db" : "#f1c40f"}
                            />
                        </View>
                    </View>

                    {/* 1. KİME ALIYORUZ? */}
                    <Text style={[styles.label, { color: theme.text }]}>Kime Hediye Alıyorsun?</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                        {relations.map((r) => (
                            <TouchableOpacity 
                                key={r}
                                activeOpacity={0.8}
                                style={[
                                    styles.chip, 
                                    relation === r ? styles.selectedChip : { backgroundColor: theme.cardBg, borderColor: theme.inputBg }
                                ]}
                                onPress={() => setRelation(r)}>
                                <Text style={[styles.chipText, { color: relation === r ? 'white' : theme.text }]}>{r}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* 2. YAŞ VE CİNSİYET */}
                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 15 }}>
                            <Text style={[styles.label, { color: theme.text }]}>Yaşı Kaç? (*)</Text>
                            <CustomInput theme={theme} icon="calendar-outline" placeholder="Örn: 22" value={age} onChange={setAge} keyboard="numeric" />
                        </View>
                        
                        <View style={{ flex: 1.2 }}> 
                            <Text style={[styles.label, { color: theme.text }]}>Cinsiyet</Text>
                            <View style={[styles.genderContainer, { backgroundColor: theme.inputBg }]}>
                                {['kadin', 'erkek', 'diger'].map((g) => (
                                    <TouchableOpacity 
                                        key={g}
                                        style={[styles.genderBtn, gender === g && styles.selectedGenderBtn]} 
                                        onPress={() => setGender(g)}>
                                        <Text style={{ fontSize: 20 }}>
                                            {g === 'kadin' ? '👩' : g === 'erkek' ? '👨' : '🌈'}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* 3. BÜTÇE */}
                    <Text style={[styles.label, { color: theme.text }]}>Bütçe (TL) (*)</Text>
                    <CustomInput theme={theme} icon="wallet-outline" placeholder="Maksimum tutar (Örn: 5000)" value={budget} onChange={setBudget} keyboard="numeric" />

                    {/* 4. İLGİ ALANI */}
                    <Text style={[styles.label, { color: theme.text }]}>İlgi Alanları (*)</Text>
                    <CustomInput theme={theme} icon="heart-outline" placeholder="Futbol, Resim, Teknoloji..." value={category} onChange={setCategory} />

                    {/* 5. EKSTRA DETAY (Sorunlu olan kısım burasıydı) */}
                    <Text style={[styles.label, { color: theme.text }]}>İpucu (Opsiyonel)</Text>
                    <CustomInput theme={theme} icon="bulb-outline" placeholder="Minimalist sever, kahve bağımlısı..." value={details} onChange={setDetails} />

                    {/* ARAMA BUTONU */}
                    <TouchableOpacity onPress={handleSearch} activeOpacity={0.9} style={{ marginTop: 30 }}>
                        <LinearGradient
                            colors={['#11998e', '#38ef7d']} 
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.searchBtn}>
                            <Ionicons name="sparkles" size={20} color="white" style={{ marginRight: 10 }} />
                            <Text style={styles.searchBtnText}>SİHİRBAZI ÇALIŞTIR</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* GEÇMİŞ VE FAVORİLER */}
                    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', marginBottom: 40 }}>
                        <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#f39c12' }]} onPress={() => navigation.navigate('History', { darkMode })}>
                            <Ionicons name="time-outline" size={18} color="white" style={{ marginRight: 5 }} />
                            <Text style={styles.smallBtnText}>Geçmiş</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#e74c3c' }]} onPress={() => navigation.navigate('Favorites', { darkMode })}>
                            <Ionicons name="heart" size={18} color="white" style={{ marginRight: 5 }} />
                            <Text style={styles.smallBtnText}>Favoriler</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  // Klavye açılınca rahatça scroll yapılabilsin diye alt boşluğu artırdık
  container: { padding: 24, paddingBottom: 100 },
  
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  header: { fontSize: 26, fontWeight: '800', letterSpacing: 0.5 },
  switchContainer: { flexDirection: 'row', alignItems: 'center' },
  
  label: { fontSize: 14, marginTop: 15, marginBottom: 8, fontWeight: '700', opacity: 0.8 },
  
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    height: 50, 
    borderRadius: 12, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, 
  },
  input: { flex: 1, fontSize: 16, height: '100%' },

  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  
  chip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, marginRight: 10, borderWidth: 1, borderColor: 'transparent' },
  selectedChip: { backgroundColor: '#3498db', shadowColor: '#3498db', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  chipText: { fontWeight: '600' },

  genderContainer: { flexDirection: 'row', borderRadius: 12, padding: 4, height: 50, alignItems: 'center', justifyContent: 'space-between' },
  genderBtn: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  selectedGenderBtn: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.2, shadowRadius: 2, elevation: 3 },

  searchBtn: { padding: 18, borderRadius: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', shadowColor: '#2ecc71', shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  searchBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },

  smallBtn: { flex: 0.48, padding: 15, borderRadius: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  smallBtnText: { color: 'white', fontWeight: 'bold' }
});