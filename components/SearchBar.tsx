import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type GeoResult = {
    id: string;
    name: string;
    country: string;
    admin1?: string;
    latitude: number;
    longitude: number;
};

export default function SearchBar({
    onSelectLocation,
}: {
    onSelectLocation?: (place: { name: string; latitude: number; longitude: number }) => void;
}) {
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<GeoResult[]>([]);
    const debounceRef = useRef<number | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!q) {
            setResults([]);
            setLoading(false);
            if (abortRef.current) {
                abortRef.current.abort();
                abortRef.current = null;
            }
            return;
        }

        setLoading(true);
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = window.setTimeout(() => {
            // abort previous
            if (abortRef.current) {
                abortRef.current.abort();
            }
            const controller = new AbortController();
            abortRef.current = controller;

            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                q,
            )}&count=6&language=en&format=json`;

            fetch(url, { signal: controller.signal })
                .then(res => res.json())
                .then((data) => {
                    const items: GeoResult[] = (data?.results || []).map((r: any, idx: number) => ({
                        id: `${r.latitude}_${r.longitude}_${idx}`,
                        name: r.name,
                        country: r.country,
                        admin1: r.admin1,
                        latitude: r.latitude,
                        longitude: r.longitude,
                    }));
                    setResults(items);
                })
                .catch((err) => {
                    if (err.name === 'AbortError') return;
                    console.warn('Geocoding error', err);
                    setResults([]);
                })
                .finally(() => {
                    setLoading(false);
                    abortRef.current = null;
                });
        }, 300);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [q]);

    function handleSelect(item: GeoResult) {
        setQ(item.name + (item.admin1 ? `, ${item.admin1}` : '') + `, ${item.country}`);
        setResults([]);
        if (onSelectLocation) {
            onSelectLocation({ name: item.name, latitude: item.latitude, longitude: item.longitude });
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                <Feather name="search" size={18} color="#8D98A6" style={styles.icon} />
                <TextInput
                    placeholder="Search city or region..."
                    placeholderTextColor="#8D98A6"
                    style={styles.input}
                    value={q}
                    onChangeText={setQ}
                    accessibilityLabel="Search city or region"
                    returnKeyType="search"
                />
                {loading ? <ActivityIndicator size="small" color="#8D98A6" /> : null}
            </View>

            {results.length > 0 && (
                <View style={styles.dropdown}>
                    <FlatList
                        data={results}
                        keyExtractor={item => item.id}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.row} onPress={() => handleSelect(item)}>
                                <Text style={styles.rowText} numberOfLines={1}>
                                    {item.name}{item.admin1 ? `, ${item.admin1}` : ''}, {item.country}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 20,
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F6F7FB',
        borderRadius: 19,
        paddingVertical: 12,
        paddingHorizontal: 14,
        height: 48,
        // shadow (iOS)
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowOffset: { width: 0, height: 6 },
                shadowRadius: 12,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#222',
        padding: 0,
        margin: 0,
    },
    dropdown: {
        marginTop: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        maxHeight: 220,
        // shadow
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowOffset: { width: 0, height: 6 },
                shadowRadius: 12,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    row: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    rowText: {
        fontSize: 15,
        color: '#222',
    },
});