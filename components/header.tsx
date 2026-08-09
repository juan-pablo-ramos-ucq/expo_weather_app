import { Pressable, StyleSheet, View } from 'react-native';
import Avatar from './avatar';
import Logo from './logo';

export default function Header({ imgUrl, onOpen } : { imgUrl : string,  onOpen : () => void }) {
    return (
      <>
        <View style={styles.container}>
            <Logo />
            <Pressable
              onPress={onOpen}>
              <Avatar imageUrl={imgUrl} size={50}/>
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
