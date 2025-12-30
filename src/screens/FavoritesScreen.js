// src/screens/FavoritesScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, Image, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FavoritesScreen({ route }) {
  const { darkMode = false } = route.params || {};
  const [favorites, setFavorites] = useState([]);
  const isFocused = useIsFocused();

  // Tema Ayarları
  const theme = {
    bg: darkMode ? '#1e272e' : '#f4f6f8',
    card: darkMode ? '#485460' : '#fff',
    text: darkMode ? '#d2dae2' : '#2c3e50',
    subText: darkMode ? '#bdc3c7' : '#95a5a6',
    emptyText: darkMode ? '#808e9b' : '#bdc3c7'
  };

  useEffect(() => {
    if (isFocused) {
        loadFavorites();
    }
  }, [isFocused]);

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>❤️ Favori Listem</Text>
        <Text style={{ color: theme.subText }}>Toplam: {favorites.length} ürün</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{padding: 15}}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={{fontSize: 50, marginBottom: 10}}>💔</Text>
                <Text style={[styles.empty, { color: theme.emptyText }]}>Listeniz boş.</Text>
                <Text style={{ color: theme.emptyText, fontSize: 12, marginTop: 5 }}>Beğendiğiniz ürünleri ekleyin.</Text>
            </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            <View style={styles.info}>
                <Text style={[styles.prodTitle, { color: theme.text }]} numberOfLines={2}>{item.name}</Text>
                <Text style={[styles.source, { color: theme.subText }]}>{item.source}</Text>
                
                <View style={styles.btnRow}>
                    <TouchableOpacity 
                        style={styles.buyBtn} 
                        onPress={() => Linking.openURL(item.link)}>
                        <Text style={styles.buyText}>Satın Al 🛒</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.deleteBtn} 
                        onPress={() => removeFavorite(item)}>
                        <Text style={styles.deleteText}>Sil</Text>
                    </TouchableOpacity>
                </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingBottom: 5 },
  title: { fontSize: 26, fontWeight: 'bold' },
  
  card: { flexDirection: 'row', borderRadius: 16, marginBottom: 15, padding: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6 },
  image: { width: 100, height: 100, borderRadius: 12, marginRight: 15, backgroundColor: 'white' },
  info: { flex: 1, justifyContent: 'space-between', paddingVertical: 5 },
  prodTitle: { fontWeight: 'bold', fontSize: 15, lineHeight: 20 },
  source: { fontSize: 12, marginBottom: 10 },
  
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  buyBtn: { backgroundColor: '#2ecc71', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, flex: 1, alignItems: 'center' },
  buyText: { color: 'white', fontWeight: 'bold', fontSize: 13 },
  deleteBtn: { backgroundColor: '#ffebee', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  deleteText: { color: '#e74c3c', fontWeight: 'bold', fontSize: 13 },

  emptyContainer: { alignItems: 'center', marginTop: 100 },
  empty: { fontSize: 18, fontWeight: 'bold' }
});