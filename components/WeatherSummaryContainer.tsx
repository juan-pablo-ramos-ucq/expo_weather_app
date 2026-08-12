import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import type { CurrentWeather } from '../models/WeatherSummaryModel';
import WeatherSummary from './WeatherSummary';

import {
    getCardTheme,
    getConditionFamily,
    WEATHER_CODE_LABELS,
} from '../models/WeatherSummaryModel';

export default function WeatherSummaryContainer() {
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
        <WeatherSummary
            weather={weather}
            theme={theme}
            label={label}
            isRaining={isRaining}
        />
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
    }
});
