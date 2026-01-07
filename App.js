import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Dosya yollarını kontrol et
import FavoritesScreen from './src/screens/FavoritesScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import HomeScreen from './src/screens/HomeScreen';
import ResultScreen from './src/screens/ResultScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* Status Bar ikonlarını koyu yapıyoruz ki krem zeminde görünsün */}
      <StatusBar style="dark" />
      
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false, // <-- İŞTE BU KOD MAVİ BARI TÜM UYGULAMADA KAPATIR
          animation: 'slide_from_right' // Sayfa geçiş animasyonu
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}