export type CurrentWeather = {
  temperature: number;
  apparentTemperature: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
};

export type ConditionFamily = 'clear' | 'cloudy' | 'precip';

// WMO weather codes, https://open-meteo.com/en/docs
export const WEATHER_CODE_LABELS: Record<number, string> = {
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

export function getConditionFamily(weatherCode: number): ConditionFamily {
  if (weatherCode === 0) return 'clear';
  if ([1, 2, 3, 45, 48].includes(weatherCode)) return 'cloudy';
  return 'precip';
}

// Dot positions for the starry night background, kept static so the sky
// doesn't re-shuffle on every render.
export const NIGHT_DOTS = [
  { top: '8%', left: '12%' }, { top: '14%', left: '82%' },
  { top: '20%', left: '38%' }, { top: '26%', left: '68%' },
  { top: '32%', left: '18%' }, { top: '38%', left: '90%' },
  { top: '46%', left: '55%' }, { top: '52%', left: '8%' },
  { top: '58%', left: '75%' }, { top: '64%', left: '30%' },
  { top: '70%', left: '92%' }, { top: '78%', left: '48%' },
];

export function getCardTheme(family: ConditionFamily, isDay: boolean) {
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