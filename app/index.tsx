import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Home from '../components/home';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <Home />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});