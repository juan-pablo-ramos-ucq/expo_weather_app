import { Pressable, StyleSheet, View } from 'react-native';
import Avatar from './avatar';
import Logo from './logo';

export default function Header({ dummyUrl, onProfileOpen } : { dummyUrl : string,  onProfileOpen : () => void }) {
    return (
      <>
        <View style={styles.container}>
            <Logo />
            <Pressable
              accessibilityLabel="Open profile"
              accessibilityRole="button"
              onPress={onProfileOpen}>
              <Avatar imageUrl={dummyUrl} size={50}/>
            </Pressable>
        </View>
      </>
    );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
});
