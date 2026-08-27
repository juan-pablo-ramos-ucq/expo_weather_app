# WeatherScope React Native

WeatherScope React Native is an in-progress Expo and React Native implementation of the WeatherScope mobile weather app. It currently supports Google Sign-In, location search through Open-Meteo, profile display, and a dynamic current-weather summary.

This repository is the React Native counterpart to the more complete Flutter implementation in [`flutter_weather_app`](https://github.com/juan-pablo-ramos-ucq/flutter_weather_app).

## Current Progress

The current Expo version includes:

- Google Sign-In using `@react-native-google-signin/google-signin`.
- Application-level user state through React Context.
- A profile bottom sheet showing the authenticated user's account information.
- City and region search using the Open-Meteo Geocoding API.
- Debounced search requests.
- `AbortController` cancellation for stale location-search requests.
- Request IDs to prevent outdated responses from replacing newer search results.
- Expo Router navigation from search results to the weather screen.
- Current-weather retrieval using the Open-Meteo Forecast API.
- Loading and error states for weather requests.
- A weather summary that adapts to weather conditions and day/night state.

## Current Weather Data

The weather screen currently retrieves and displays a focused summary based on:

- Temperature
- Feels-like temperature
- Day/night state
- Precipitation
- Weather code and condition label

## Tech Stack

- React Native
- Expo 54
- TypeScript
- React 19
- Expo Router
- React Context
- Google Sign-In
- Open-Meteo Geocoding API
- Open-Meteo Forecast API
- Nunito via Expo Google Fonts

## Architecture

The project separates routing, screens, reusable components, models, services, and shared context.

```text
app/
├── _layout.tsx
├── home.tsx
├── index.tsx
└── weather.tsx

components/
├── EmptyState.tsx
├── GoogleLogin.tsx
├── ProfileSheet.tsx
├── SearchBar.tsx
├── WeatherSummary.tsx
├── WeatherSummaryContainer.tsx
├── avatar.tsx
├── header.tsx
└── logo.tsx

contexts/
└── UserContext.tsx

models/
└── WeatherSummaryModel.ts

screens/
├── GoogleLoginContainer.tsx
└── home.tsx

services/
└── google-auth.ts
```

### Main Responsibilities

| Component | Responsibility |
| --- | --- |
| `RootLayout` | Loads application fonts, provides shared user context, and configures Expo Router. |
| `GoogleLoginContainer` | Handles Google authentication and updates shared user state. |
| `GoogleLogin` | Renders the Google sign-in interface. |
| `SearchBar` | Handles location input, debouncing, stale-request cancellation, geocoding results, and navigation. |
| `WeatherSummaryContainer` | Reads coordinates from the route, requests current weather, and manages loading/error states. |
| `WeatherSummary` | Renders the current-weather summary. |
| `WeatherSummaryModel` | Defines weather data types and maps weather conditions to labels and presentation themes. |
| `ProfileSheet` | Displays the signed-in user's profile information. |
| `UserContext` | Shares the authenticated user across the application. |

## App Flow

1. The application displays the Google Sign-In flow.
2. After successful authentication, the signed-in user is stored in React Context and the app navigates to the home screen.
3. The user searches for a city or region.
4. Search requests are debounced and stale requests are cancelled or ignored.
5. Selecting a location navigates to the weather route with its latitude and longitude.
6. The weather screen retrieves current conditions from Open-Meteo.
7. The application displays either a loading state, an error state, or the weather summary.

## APIs

### Open-Meteo Geocoding API

Used to convert a city or region search into geographic coordinates.

### Open-Meteo Forecast API

Used to retrieve current weather conditions from the selected latitude and longitude.

Open-Meteo does not require an API key for this use case.

## Google Sign-In

Google authentication uses `@react-native-google-signin/google-signin` and requires the appropriate platform credentials and Google Play Services configuration.

The current Expo implementation stores the authenticated user in application memory through React Context. Session persistence across application restarts has not yet been implemented.

## Running the App

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npm start
```

Run Android:

```bash
npm run android
```

Run iOS:

```bash
npm run ios
```

Run the web target:

```bash
npm run web
```

## Comparison with the Flutter Version

The Flutter repository is currently the more complete WeatherScope implementation.

| Capability | Expo / React Native | Flutter |
| --- | :---: | :---: |
| Google Sign-In | ✅ | ✅ |
| Profile information | ✅ | ✅ |
| Location search | ✅ | ✅ |
| Debounced search | ✅ | ✅ |
| Stale-request protection | ✅ | ✅ |
| Current weather summary | ✅ | ✅ |
| Loading/error state for weather request | ✅ | ✅ |
| Persistent login/session | ❌ | ✅ |
| Detailed humidity, UV, cloud, pressure metrics | ❌ | ✅ |
| Wind speed, direction, and gusts | ❌ | ✅ |
| Hourly forecast carousel | ❌ | ✅ |
| Camera profile-photo capture | ❌ | ✅ |
| Local user-data persistence | ❌ | ✅ |
| Mature network timeout/error handling across flows | Partial | ✅ |

### Relative Progress

The Expo version has effectively reached the core of the Flutter project's second development iteration: authentication, profile presentation, geocoded location search, navigation, and a functional current-weather summary are in place.

The Flutter implementation has progressed further into persistence and reliability. It additionally remembers the signed-in user, exposes a much broader set of weather measurements, renders hourly forecasts, supports camera-based profile pictures, and contains more complete network-failure handling.

## Next Logical Milestones

To bring this implementation closer to feature parity with the Flutter version:

1. Add persistent user/session storage.
2. Expand the weather model and request to include humidity, UV index, cloud coverage, pressure, wind, and gust data.
3. Add hourly forecast data and a horizontal forecast component.
4. Add camera-based profile photo capture.
5. Add explicit request timeouts and richer network-error handling.
6. Add automated tests for authentication, search, and weather presentation.

## Status

This repository is actively being developed and is not yet at feature parity with the Flutter WeatherScope application.
