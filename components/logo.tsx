import { StyleSheet, Text, View } from 'react-native';

export default function Logo() {
    return (
        <View style={styles.flexContainer}>
            <View style={styles.iconContainer}>
                <Text allowFontScaling={false} style={styles.icon}>
                    🌐
                </Text>
            </View>
            <View>
                <Text style={styles.title}>WeatherScope</Text>
                <Text style={styles.subtitle}>Real-time global weather</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flexContainer: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: '#eef2ff',
        width: 44,
        height: 44,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 20
    },
    title: {
        fontFamily: 'Nunito_900Black',
        fontSize: 19,
    },

    subtitle: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#91A0BC',
    },
});