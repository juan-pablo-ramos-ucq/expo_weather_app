import { StyleSheet, Text, View } from 'react-native';

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.illustration}>
        <Text
          allowFontScaling={false}
          style={styles.emoji}>
          🌎
        </Text>
      </View>

      <Text style={styles.title}>
        Find your weather
      </Text>

      <Text style={styles.description}>
        Search for any city or region to get real-time conditions and
        today's hourly forecast.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 50,
    },

    illustration: {
        marginBottom: 18,
        elevation: 5,
    },

    emoji: {
        fontSize: 64,
    },

    title: {
        color: '#171717',
        fontFamily: 'Nunito_900Black',
        fontSize: 23,
        lineHeight: 29,
        textAlign: 'center',
    },

    description: {
        maxWidth: 310,
        marginTop: 12,
        color: '#94A3B8',
        fontFamily: 'Nunito_400Regular',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
});