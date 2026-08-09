import { Pressable, StyleSheet, Text, View } from 'react-native';

import Logo from './logo';

type GoogleLoginProps = {
  disabled?: boolean;
  onContinueWithGoogle: () => void;
};

export default function GoogleLogin({
  disabled = false,
  onContinueWithGoogle,
}: GoogleLoginProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Logo />
      </View>

      <View style={styles.content}>
        <Pressable
          accessibilityLabel="Continue with Google"
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={onContinueWithGoogle}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            disabled && styles.buttonDisabled,
          ]}>
          <Text style={styles.googleMark}>G</Text>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 360,
    minHeight: 54,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#D7E0E8',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonPressed: {
    backgroundColor: '#F8FAFC',
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  googleMark: {
    position: 'absolute',
    left: 20,
    color: '#4285F4',
    fontFamily: 'Nunito_900Black',
    fontSize: 20,
  },
  buttonText: {
    color: '#1F2937',
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
  },
});
