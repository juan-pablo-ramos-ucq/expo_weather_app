import { StyleSheet, Text, View } from 'react-native';
import type { CurrentWeather } from '../models/WeatherSummaryModel';
import { NIGHT_DOTS } from '../models/WeatherSummaryModel';

type WeatherSummaryProps = {
  weather: CurrentWeather;
  theme: {
    backgroundColor: string;
    icon: string;
    showDots: boolean;
  };
  label: string;
  isRaining: boolean;
};

export default function WeatherSummary({ 
  weather, 
  theme, 
  label, 
  isRaining 
}: WeatherSummaryProps) {
  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundColor }]}>
      {theme.showDots
        ? NIGHT_DOTS.map((dot, index) => (
            <View key={index} style={[styles.dot, dot as object]} />
          ))
        : null}

      <Text style={styles.icon}>{theme.icon}</Text>

      <View style={styles.temperatureRow}>
        <Text style={styles.temperature}>{weather.temperature}</Text>
        <Text style={styles.temperatureUnit}>°C</Text>
      </View>

      <Text style={styles.condition}>{label}</Text>

      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🌡️ Feels {weather.apparentTemperature}°C</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {weather.isDay ? '☀️ Daytime' : '🌙 Nighttime'}
          </Text>
        </View>
      </View>

      <View style={[styles.badge, isRaining ? styles.rainBadge : styles.noRainBadge]}>
        <Text style={isRaining ? styles.rainText : styles.noRainText}>
          {isRaining ? `💧 Raining ${weather.precipitation.toFixed(1)}mm` : 'No Rain'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusContainer: {
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 15,
    color: '#94A3B8',
  },
  card: {
    marginTop: 18,
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  dot: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  icon: {
    fontSize: 72,
    marginBottom: 8,
  },
  temperatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  temperature: {
    fontFamily: 'Nunito_900Black',
    fontSize: 72,
    color: '#FFFFFF',
  },
  temperatureUnit: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 28,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 10,
  },
  condition: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  badgeText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#E2E8F0',
  },
  noRainBadge: {
    marginTop: 10,
    backgroundColor: 'rgba(74, 222, 128, 0.16)',
  },
  noRainText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#4ADE80',
  },
  rainBadge: {
    marginTop: 10,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
  },
  rainText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 13,
    color: '#93C5FD',
  },
});
