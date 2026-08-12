import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type CurrentWeather = {
  temperature: number;
  apparentTemperature: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
};

type ConditionFamily = 'clear' | 'cloudy' | 'precip';

// WMO weather codes, https://open-meteo.com/en/docs
const WEATHER_CODE_LABELS: Record<number, string> = {
  0: 'Clear Sky',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime Fog',
  51: 'Light Drizzle',
  53: 'Drizzle',
  55: 'Dense Drizzle',
  56: 'Freezing Drizzle',
  57: 'Freezing Drizzle',
  61: 'Light Rain',
  63: 'Rain',
  65: 'Heavy Rain',
  66: 'Freezing Rain',
  67: 'Freezing Rain',
  71: 'Light Snow',
  73: 'Snow',
  75: 'Heavy Snow',
  77: 'Snow Grains',
  80: 'Rain Showers',
  81: 'Rain Showers',
  82: 'Violent Showers',
  85: 'Snow Showers',
  86: 'Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm',
  99: 'Thunderstorm',
};

function getConditionFamily(weatherCode: number): ConditionFamily {
  if (weatherCode === 0) return 'clear';
  if ([1, 2, 3, 45, 48].includes(weatherCode)) return 'cloudy';
  return 'precip';
}

// Dot positions for the starry night background, kept static so the sky
// doesn't re-shuffle on every render.
const NIGHT_DOTS = [
  { top: '8%', left: '12%' }, { top: '14%', left: '82%' },
  { top: '20%', left: '38%' }, { top: '26%', left: '68%' },
  { top: '32%', left: '18%' }, { top: '38%', left: '90%' },
  { top: '46%', left: '55%' }, { top: '52%', left: '8%' },
  { top: '58%', left: '75%' }, { top: '64%', left: '30%' },
  { top: '70%', left: '92%' }, { top: '78%', left: '48%' },
];

function getCardTheme(family: ConditionFamily, isDay: boolean) {
  if (family === 'clear' && isDay) {
    return { backgroundColor: '#2E86DE', icon: '☀️', showDots: false };
  }
  if (!isDay) {
    const icon = family === 'clear' ? '🌙' : family === 'cloudy' ? '☁️' : '🌧️';
    return { backgroundColor: '#0B1226', icon, showDots: true };
  }
  const icon = family === 'cloudy' ? '☁️' : '🌦️';
  return { backgroundColor: '#16233D', icon, showDots: false };
}

export default function WeatherSummary() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const router = useRouter();
  const params = useLocalSearchParams<{
    latitude: string;
    longitude: string;
  }>();

  const latitude = Number(params.latitude);
  const longitude = Number(params.longitude);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,is_day,precipitation,weather_code`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error('No se pudo cargar el clima.');
        }

        const data = await response.json();
        const current = data?.current;

        if (requestId !== requestIdRef.current) return;

        if (!current) {
          throw new Error('Respuesta de clima incompleta.');
        }

        setWeather({
          temperature: Math.round(current.temperature_2m),
          apparentTemperature: Math.round(current.apparent_temperature),
          isDay: current.is_day === 1,
          precipitation: current.precipitation ?? 0,
          weatherCode: current.weather_code,
        });
      } catch {
        if (controller.signal.aborted || requestId !== requestIdRef.current) return;
        setError('No se pudo cargar el clima.');
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    })();

    return () => controller.abort();
  }, [latitude, longitude]);

  if (isLoading) {
    return (
      <View style={styles.statusContainer}>
        <ActivityIndicator color="#2E86DE" size="large" />
      </View>
    );
  }

  if (error || !weather) {
    return (
      <View style={styles.statusContainer}>
        <Text style={styles.errorText}>{error ?? 'No se pudo cargar el clima.'}</Text>
      </View>
    );
  }

  const family = getConditionFamily(weather.weatherCode);
  const theme = getCardTheme(family, weather.isDay);
  const label = WEATHER_CODE_LABELS[weather.weatherCode] ?? 'Unknown';
  const isRaining = family === 'precip' && weather.precipitation > 0;

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
