import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_900Black,
  useFonts,
} from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../contexts/UserContext';
import '../services/google-auth';

export default function RootLayout() {
  const [user, setUser] = useState(null);
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_900Black,
  });

  if (fontError) {
    throw fontError;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: styles.screen,
            }}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </UserContext.Provider>

  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
  },
});