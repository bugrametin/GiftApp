import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['rgba(245, 134, 236, 1)', 'rgba(135, 240, 234, 1)']} 
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
            <Ionicons name="gift-outline" size={80} color="#e67e22" />
        </View>

        <Text style={styles.title}>Hediye Sihirbazı</Text>
        <Text style={styles.subtitle}>
          Sevdiklerin için en doğru hediyeyi bulmanın en kolay yolu.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => navigation.replace('Home')}
        >
            <LinearGradient
                colors={['#f1c40f', '#e67e22']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.gradientBtn}
            >
                <Text style={styles.btnText}>Haydi Başlayalım 🚀</Text>
            </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 },
  iconContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 100,
    marginBottom: 30,
    shadowColor: '#e67e22',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#2d3436', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#636e72', textAlign: 'center', lineHeight: 24 },
  footer: { padding: 30, paddingBottom: 50 },
  button: { width: '100%', borderRadius: 20, overflow: 'hidden' },
  gradientBtn: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});