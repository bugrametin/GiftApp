import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Ekranları çağırıyoruz
import FavoritesScreen from './src/screens/FavoritesScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import HomeScreen from './src/screens/HomeScreen';
import ResultScreen from './src/screens/ResultScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
            headerStyle: { backgroundColor: '#3498db' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            headerBackTitleVisible: false, // Geri butonunda yazı yazmasın, sadece ok olsun
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Hediye Bulucu', headerShown: false }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: 'Sonuçlar' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Geçmiş Aramalar' }} />
        
        
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: '❤️ Favoriler' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}