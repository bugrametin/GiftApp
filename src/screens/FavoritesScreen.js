import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { FlatList, Image, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FavoritesScreen({ route, navigation }) {
  const { darkMode = false } = route.params || {};
  const [favorites, setFavorites] = useState([]);
  const isFocused = useIsFocused();

  const theme = {
    bgColors: darkMode ? ['#141E30', '#3b0f30ff'] : ['rgba(245, 134, 236, 1)', 'rgba(135, 240, 234, 1)'],
    cardBg: darkMode ? '#2C3A47' : '#ffffff',
    text: darkMode ? '#ecf0f1' : '#2d3436',
    subText: darkMode ? '#bdc3c7' : '#636e72',
    shadow: darkMode ? '#000' : '#e6be8a',
    deleteBg: darkMode ? '#c0392b' : '#ffebee',
    deleteIcon: darkMode ? '#fff' : '#e74c3c'
  };

  useEffect(() => { if (isFocused) loadFavorites(); }, [isFocused]);
  const loadFavorites = async () => {
    const data = await AsyncStorage.getItem('favorites');
    if (data) setFavorites(JSON.parse(data));
  };
  const removeFavorite = async (itemToRemove) => {
      const newFavs = favorites.filter(item => item.link !== itemToRemove.link);
      setFavorites(newFavs);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  return (
    <LinearGradient colors={theme.bgColors} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* ÖZEL HEADER */}
        <View style={styles.customHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="chevron-back" size={28} color={theme.text} />
            </TouchableOpacity>
            <View>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Favori Listem</Text>
                <Text style={{ color: theme.subText, fontSize: 12 }}>{favorites.length} ürün kayıtlı</Text>
            </View>
            <View style={{width: 28}} />
        </View>

        <FlatList
            data={favorites}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{padding: 20}}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-dislike-outline" size={50} color={theme.subText} />
                    <Text style={{ color: theme.subText, marginTop: 10 }}>Listeniz boş.</Text>
                </View>
            }
            renderItem={({ item }) => (
                <View style={[styles.card, { backgroundColor: theme.cardBg, shadowColor: theme.shadow }]}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
                    </View>
                    <View style={styles.info}>
                        <View>
                            <Text style={[styles.source, { color: theme.subText }]}>{item.source}</Text>
                            <Text style={[styles.prodTitle, { color: theme.text }]} numberOfLines={2}>{item.name}</Text>
                        </View>
                        <View style={styles.btnRow}>
                            <TouchableOpacity style={{flex: 1, marginRight: 10}} activeOpacity={0.8} onPress={() => Linking.openURL(item.link)}>
                                <LinearGradient colors={['#2ecc71', '#27ae60']} style={styles.buyBtn}>
                                    <Text style={styles.buyText}>Satın Al 🛒</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: theme.deleteBg }]} onPress={() => removeFavorite(item)}>
                                <Ionicons name="trash-outline" size={20} color={theme.deleteIcon} />
                            </TouchableOpacity>
                        </View>
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
  customHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingTop: 10, marginBottom: 10 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  card: { flexDirection: 'row', borderRadius: 20, marginBottom: 16, padding: 10, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
  imageContainer: { width: 90, height: 90, borderRadius: 15, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  image: { width: '90%', height: '90%' },
  info: { flex: 1, justifyContent: 'space-between', paddingVertical: 2 },
  source: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  prodTitle: { fontWeight: '700', fontSize: 14, lineHeight: 18 },
  btnRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  buyBtn: { paddingVertical: 8, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  buyText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  deleteBtn: { width: 35, height: 35, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 80 }
});