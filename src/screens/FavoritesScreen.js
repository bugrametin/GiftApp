// src/screens/FavoritesScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const isFocused = useIsFocused(); 

  useEffect(() => {
    if (isFocused) {
        loadFavorites();
    }
  }, [isFocused]);

  const loadFavorites = async () => {
    try {
        // BURASI KRİTİK NOKTA: 'favorites' anahtarı kullanılıyor mu? EVET.
        const data = await AsyncStorage.getItem('favorites');
        
        if (data) {
            setFavorites(JSON.parse(data));
        } else {
            setFavorites([]); // Veri yoksa boş dizi yap
        }
    } catch (e) {
        console.error("Favori yükleme hatası:", e);
    }
  };

  const removeFavorite = async (itemToRemove) => {
      Alert.alert("Sil", "Favorilerden kaldırılsın mı?", [
          { text: "Vazgeç" },
          { text: "Sil", style: 'destructive', onPress: async () => {
              const newFavs = favorites.filter(item => item.link !== itemToRemove.link);
              setFavorites(newFavs);
              await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
          }}
      ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{padding: 15}}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>💔</Text>
                <Text style={styles.emptyText}>Henüz favori ürünün yok.</Text>
            </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
                
                <View style={styles.btnRow}>
                    <TouchableOpacity onPress={() => item.link && Linking.openURL(item.link)}>
                        <Text style={styles.linkText}>Satın Al</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => removeFavorite(item)}>
                        <Text style={styles.removeText}>Kaldır</Text>
                    </TouchableOpacity>
                </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 12, borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#eee', shadowColor: "#000", shadowOpacity: 0.05, elevation: 2 },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 15 },
  info: { flex: 1, justifyContent: 'space-between' },
  title: { fontWeight: '600', fontSize: 14, color: '#333' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  linkText: { color: '#2ecc71', fontWeight: 'bold' },
  removeText: { color: '#e74c3c', fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyEmoji: { fontSize: 50, marginBottom: 10 },
  emptyText: { color: '#999', fontSize: 16 }
});