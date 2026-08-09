import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoogleLogin from '../components/GoogleLogin';

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <GoogleLogin onContinueWithGoogle={() => {}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});