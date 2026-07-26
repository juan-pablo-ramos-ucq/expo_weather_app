import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import Logo from './logo';
import Avatar from './avatar';

const dummyUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format';

export default function Header() {
    return (
        <View style={styles.container}>
            <Logo />
            <Avatar imageUrl={dummyUrl} size={50}/>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
});