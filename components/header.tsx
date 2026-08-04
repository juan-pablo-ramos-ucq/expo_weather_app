import { Pressable, StyleSheet, View } from 'react-native';
import Avatar from './avatar';
import Logo from './logo';

export default function Header({ dummyUrl, onOpen } : { dummyUrl : string,  onOpen : () => void }) {
    return (
      <>
        <View style={styles.container}>
            <Logo />
            <Pressable
              accessibilityLabel="Open profile"
              accessibilityRole="button"
              onPress={onOpen}>
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
