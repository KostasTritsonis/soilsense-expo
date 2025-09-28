import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useWeatherStore } from "@/lib/stores/weather-store";
import { CurrentWeather, ForecastDay } from "@/lib/types";
import { fetchWeatherData, getCoordinatesFromCity } from "@/lib/weather";
import React, { useCallback, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Move components outside to prevent re-creation on every render
const WeatherCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <ThemedView className="bg-white dark:bg-neutral-800 p-4 rounded-xl mb-4 shadow-md border border-soil-200/80 dark:border-neutral-700/80">
    <ThemedText className="text-lg font-semibold text-soil-900 dark:text-neutral-100 mb-3">
      {title}
    </ThemedText>
    {children}
  </ThemedView>
);

const ForecastCard = ({ day }: { day: ForecastDay }) => (
  <ThemedView className="bg-neutral-50 dark:bg-neutral-700/50 p-3 rounded-lg mb-2 shadow-sm">
    <View className="flex-row justify-between items-center">
      <View className="flex-1">
        <ThemedText className="text-base font-semibold text-soil-900 dark:text-neutral-100">
          {day.day}
        </ThemedText>
        <ThemedText className="text-sm text-soil-600 dark:text-neutral-400">
          {day.forecast}
        </ThemedText>
      </View>
      <Image
        source={{ uri: day.icon }}
        className="w-8 h-8 mr-3"
        resizeMode="contain"
      />
      <View className="items-end">
        <ThemedText className="text-base font-semibold text-soil-900 dark:text-neutral-100">
          {day.high}
        </ThemedText>
        <ThemedText className="text-sm text-soil-600 dark:text-neutral-400">
          {day.low}
        </ThemedText>
        <ThemedText className="text-xs text-soil-500 dark:text-neutral-500">
          {day.rainChance}
        </ThemedText>
      </View>
    </View>
  </ThemedView>
);

export default function WeatherScreen() {
  const { setCurrentLocation, currentLocation } = useWeatherStore();
  const [location, setLocation] = useState<string>("Athens");
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const { currentWeather, forecast } = await fetchWeatherData(lat, lon);
      setCurrentWeather(currentWeather);
      setForecast(forecast);
    } catch (err) {
      setError("Failed to load weather data. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (location.includes(",")) {
        // Handle coordinates format: "lat,lon"
        const [lat, lon] = location.split(",").map(Number);
        if (!lat || !lon) {
          setError("Invalid coordinates. Use format: lat,lon");
          return;
        }
        await fetchWeather(lat, lon);
        // Update global weather context
        setCurrentLocation({ lat, lon, name: `${lat}, ${lon}` });
      } else {
        // Handle city name search
        const coords = await getCoordinatesFromCity(location);
        await fetchWeather(coords.lat, coords.lon);
        // Update global weather context
        setCurrentLocation({
          lat: coords.lat,
          lon: coords.lon,
          name: coords.name,
        });
      }
    } catch (err) {
      setError(
        "Failed to find location. Please try a different city or coordinates."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [location, setCurrentLocation]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="py-6 items-center">
          <ThemedText className="text-3xl font-bold text-soil-900 mb-2">
            Weather Dashboard
          </ThemedText>
          <ThemedText className="text-base text-soil-600  text-center mb-3">
            Monitor weather conditions for your agricultural operations
          </ThemedText>
          {currentLocation && (
            <View className="bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-full border border-primary-200 dark:border-primary-800">
              <ThemedText className="text-sm font-medium text-primary-700 dark:text-primary-300">
                📍 {currentLocation.name}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Search Section */}
        <WeatherCard title="📍 Location Search">
          <View className="flex-row gap-3">
            <TextInput
              ref={inputRef}
              className="flex-1 px-4 py-3 border border-soil-200 dark:border-neutral-600 rounded-xl bg-soil-50 dark:bg-neutral-700 text-soil-900 dark:text-neutral-100"
              value={location}
              onChangeText={setLocation}
              placeholder="Enter city name (e.g., London, New York) or coordinates (37.7749,-122.4194)"
              placeholderTextColor="#6b7280"
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TouchableOpacity
              className="bg-primary-500 px-6 py-3 rounded-xl items-center justify-center"
              onPress={handleSearch}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold">
                {isLoading ? "..." : "🔍"}
              </Text>
            </TouchableOpacity>
          </View>
        </WeatherCard>

        {error ? (
          <ThemedView className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
            <ThemedText className="text-red-700 dark:text-red-400 font-medium mb-3 text-center">
              {error}
            </ThemedText>
            <TouchableOpacity
              className="bg-red-500 py-2 px-4 rounded-lg self-center"
              onPress={handleSearch}
            >
              <Text className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <>
            {/* Current Weather */}
            <WeatherCard title="Current Weather">
              {currentWeather && (
                <View className="items-center">
                  <Image
                    source={{ uri: currentWeather.icon }}
                    className="w-16 h-16 mb-2"
                    resizeMode="contain"
                  />
                  <ThemedText className="text-3xl font-bold text-soil-900 dark:text-neutral-100 mb-1">
                    {currentWeather.temperature}
                  </ThemedText>
                  <ThemedText className="text-lg text-soil-600 dark:text-neutral-400 mb-4">
                    {currentWeather.forecast}
                  </ThemedText>
                  <View className="flex-row justify-around w-full">
                    <View className="items-center">
                      <ThemedText className="text-sm text-soil-500 dark:text-neutral-500">
                        Humidity
                      </ThemedText>
                      <ThemedText className="text-base font-semibold text-soil-900 dark:text-neutral-100">
                        {currentWeather.humidity}
                      </ThemedText>
                    </View>
                    <View className="items-center">
                      <ThemedText className="text-sm text-soil-500 dark:text-neutral-500">
                        Wind
                      </ThemedText>
                      <ThemedText className="text-base font-semibold text-soil-900 dark:text-neutral-100">
                        {currentWeather.windSpeed}
                      </ThemedText>
                    </View>
                    <View className="items-center">
                      <ThemedText className="text-sm text-soil-500 dark:text-neutral-500">
                        Rainfall
                      </ThemedText>
                      <ThemedText className="text-base font-semibold text-soil-900 dark:text-neutral-100">
                        {currentWeather.rainfall}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText className="text-xs text-soil-400 dark:text-neutral-500 mt-3">
                    Last updated: {currentWeather.lastUpdated}
                  </ThemedText>
                </View>
              )}
            </WeatherCard>

            {/* Forecast */}
            <WeatherCard title="5-Day Forecast">
              {forecast.map((day, index) => (
                <ForecastCard key={index} day={day} />
              ))}
            </WeatherCard>

            {/* Weather Alerts */}
            <WeatherCard title="⚠️ Weather Alerts">
              <ThemedView className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg p-3">
                <ThemedText className="text-warning-800 dark:text-warning-400 font-medium mb-1">
                  Agricultural Advisory
                </ThemedText>
                <ThemedText className="text-warning-700 dark:text-warning-300 text-sm">
                  Moderate wind conditions expected. Consider protecting
                  sensitive crops.
                </ThemedText>
              </ThemedView>
            </WeatherCard>

            {/* Crop Impact */}
            <WeatherCard title="🌱 Crop Impact">
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <ThemedText className="text-sm text-soil-600 dark:text-neutral-400">
                    Wheat Growth
                  </ThemedText>
                  <View className="flex-row items-center">
                    <View className="w-16 h-2 bg-soil-200 dark:bg-neutral-600 rounded-full mr-2">
                      <View className="w-12 h-2 bg-success-500 rounded-full" />
                    </View>
                    <ThemedText className="text-sm font-medium text-soil-900 dark:text-neutral-100">
                      Good
                    </ThemedText>
                  </View>
                </View>
                <View className="flex-row justify-between items-center">
                  <ThemedText className="text-sm text-soil-600 dark:text-neutral-400">
                    Corn Growth
                  </ThemedText>
                  <View className="flex-row items-center">
                    <View className="w-16 h-2 bg-soil-200 dark:bg-neutral-600 rounded-full mr-2">
                      <View className="w-10 h-2 bg-warning-500 rounded-full" />
                    </View>
                    <ThemedText className="text-sm font-medium text-soil-900 dark:text-neutral-100">
                      Fair
                    </ThemedText>
                  </View>
                </View>
              </View>
            </WeatherCard>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
