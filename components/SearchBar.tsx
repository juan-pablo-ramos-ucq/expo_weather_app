import { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';

type GeocodingResult = {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	admin1?: string;
	country?: string;
	country_code?: string;
};

type SearchBarProps = {
	onSelectLocation?: (location: GeocodingResult) => void;
};

function SearchIcon() {
	return (
		<View style={styles.iconWrap}>
			<View style={styles.iconCircle} />
			<View style={styles.iconHandle} />
		</View>
	);
}

function formatLocation(result: GeocodingResult) {
	const parts = [result.name, result.admin1, result.country].filter(Boolean);
	return parts.join(', ');
}

export default function SearchBar({ onSelectLocation }: SearchBarProps) {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<GeocodingResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<TextInput>(null);
	const requestIdRef = useRef(0); // a value that persists between re-renders without ever triggering a component render. useRef creates this object: { current: 0 }
	const q = query.trim();
	const hasText = q.length > 0;

	useEffect(() => {
		if (!q) {
			setResults([]);
			setError(null);
			setIsLoading(false);
			return;
		}

		const controller = new AbortController(); // to cancel a stale HTTP request
		const requestId = ++requestIdRef.current; // assign the same updated addition value to requestIdRef.current and requestID. requestIdRef.current++ would discard the updated addition in the assignment to the requestID.

		setIsLoading(true);
		setError(null);

		const timeoutId = setTimeout(async () => {
			try {
				const response = await fetch(
					`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=en&format=json`,
					{ signal: controller.signal },
				);

				if (!response.ok) {
					throw new Error('No se pudieron cargar las ubicaciones.');
				}

				const data = await response.json();

				if (requestId !== requestIdRef.current) {
					/*
					It is like the call stack. Each call instance of the anonymous async fetch function has its own local variable values
					(e.g., requestId), even when all function instances share the same variable names.
					
					Conversely, they have a shared reference in common, i.e., requestIdRef.current, which is guaranteed to contain the 
					latest fetch request ID.

					Each fetch function instance checks whether its fetch request is the current one by comparing its local requestId with 
					the shared reference. If they do not match, it means that the fetch function instance is stale and can be freed from 
					memory using the useEffect return statement.
					*/
					return;
				}

				/*
				Even though the Open-Meteo API response always returns an array for the results property, checking it with 
				Array.isArray() is a safe defensive way to handle API responses when the status code is not 200, which may 
				not return an array.
				*/
				setResults(Array.isArray(data?.results) ? data.results : []);
				setError(
					Array.isArray(data?.results) && data.results.length === 0
						? 'Sin coincidencias.'
						: null,
				);
			} catch {
				if (controller.signal.aborted || requestId !== requestIdRef.current) {
					/*
					Ignore the error if this is a stale anonymous fetch function instance whose request was aborted.
					Note: controller.abort() causes the stale anonymous fetch function to enter the catch block.
					*/
					return;
				}

				setResults([]);
				setError('No se pudo buscar la ubicación.');
			} finally {
				if (requestId === requestIdRef.current) {
					setIsLoading(false);
				}
			}
		}, 280);

		return () => {
			// Freeing stale anonymous fetch function instances from memory
			controller.abort();
			clearTimeout(timeoutId);
		};
	}, [q]);

	const showDropdown =
		isFocused &&
		hasText &&
		(results.length > 0 || error !== null);

	const clearQuery = () => {
		setQuery('');
		setResults([]);
		setError(null);
		setIsFocused(true);
		inputRef.current?.focus();
	};

	return (
		<View style={styles.container}>
			<View style={styles.inputShell}>
				<View style={styles.leftAction}>
					{isLoading ? (
						<ActivityIndicator color="#94A3B8" size="small" />
					) : (
						<SearchIcon />
					)}
				</View>
				<TextInput
					ref={inputRef}
					autoCapitalize="words"
					autoCorrect={false}
					placeholder="Search city or region..."
					placeholderTextColor="#A4AFC1"
					selectionColor="#6B7B93"
					style={styles.input}
					value={query}
					onBlur={() => {
						setTimeout(() => setIsFocused(false), 120);
					}}
					onChangeText={setQuery}
					onFocus={() => setIsFocused(true)}
					returnKeyType="search"
				/>
				{hasText ? (
					<Pressable
						accessibilityLabel="Clear search"
						accessibilityRole="button"
						onPress={clearQuery}
						style={({ pressed }) => [
							styles.clearButton,
							pressed && styles.clearButtonPressed,
						]}>
						<Text style={styles.clearText}>×</Text>
					</Pressable>
				) : null}
			</View>

			{showDropdown ? (
				<View style={styles.dropdown}>
					{results.map((result, index) => (
						<Pressable
							key={`${result.id}-${index}`}
							accessibilityRole="button"
							onPress={() => {
								setQuery(formatLocation(result));
								setResults([]);
								setError(null);
								setIsFocused(false);
								onSelectLocation?.(result);
							}}
							style={({ pressed }) => [
								styles.option,
								index !== results.length - 1 && styles.optionDivider,
								pressed && styles.optionPressed,
							]}>
							<View style={styles.optionTextBlock}>
								<Text numberOfLines={1} style={styles.optionTitle}>
									{result.name}
								</Text>
								<Text numberOfLines={1} style={styles.optionSubtitle}>
									{formatLocation(result)}
								</Text>
							</View>
						</Pressable>
					))}

					{error ? <Text style={styles.emptyState}>{error}</Text> : null}
				</View>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginTop: 18,
	},
	inputShell: {
		minHeight: 58,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		paddingLeft: 16,
		paddingRight: 10,
		borderWidth: 1,
		borderColor: '#E4EAF2',
		borderRadius: 22,
		backgroundColor: '#FFFFFF',
		shadowColor: '#0F172A',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.05,
		shadowRadius: 18,
		elevation: 3,
	},
	leftAction: {
		width: 24,
		height: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconWrap: {
		width: 24,
		height: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconCircle: {
		width: 16,
		height: 16,
		borderWidth: 2,
		borderColor: '#90A0B6',
		borderRadius: 12,
	},
	iconHandle: {
		position: 'absolute',
		right: 1,
		bottom: 3,
		width: 8,
		height: 2,
		borderRadius: 2,
		backgroundColor: '#90A0B6',
		transform: [{ rotate: '45deg' }],
	},
	input: {
		flex: 1,
		fontFamily: 'Nunito_600SemiBold',
		fontSize: 15.5,
		color: '#1F2A3B',
		paddingVertical: 0,
	},
	clearButton: {
		width: 34,
		height: 34,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 17,
		backgroundColor: '#F3F6FA',
	},
	clearButtonPressed: {
		opacity: 0.72,
	},
	clearText: {
		marginTop: -1,
		fontSize: 22,
		lineHeight: 22,
		color: '#6F7D90',
	},
	dropdown: {
		marginTop: 10,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: '#E4EAF2',
		borderRadius: 24,
		backgroundColor: '#FFFFFF',
		shadowColor: '#0F172A',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.08,
		shadowRadius: 24,
		elevation: 3,
	},
	option: {
		paddingHorizontal: 18,
		paddingVertical: 14,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 12,
	},
	optionPressed: {
		backgroundColor: '#F4F7FB',
	},
	optionDivider: {
		borderBottomWidth: 1,
		borderBottomColor: '#EEF2F7',
	},
	optionTextBlock: {
		flex: 1,
		gap: 2,
	},
	optionTitle: {
		fontFamily: 'Nunito_600SemiBold',
		fontSize: 16,
		color: '#132033',
	},
	optionSubtitle: {
		fontFamily: 'Nunito_600SemiBold',
		fontSize: 13,
		color: '#8A97AA',
	},
	emptyState: {
		paddingHorizontal: 18,
		paddingVertical: 14,
		fontFamily: 'Nunito_600SemiBold',
		color: '#8A97AA',
	},
});
