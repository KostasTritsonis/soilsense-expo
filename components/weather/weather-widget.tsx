import { useWeatherStore } from "@/lib/stores/weather-store";
import { CurrentWeather } from "@/lib/types";
import { fetchWeatherData } from "@/lib/weather";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Loader from "../loader";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

export default function WeatherWidget() {
  const { currentLocation } = useWeatherStore();
  const router = useRouter();
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setLoading(true);

        const { currentWeather } = await fetchWeatherData(
          currentLocation.lat,
          currentLocation.lon,
          currentLocation.name
        );
        setWeather(currentWeather);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
    const intervalId = setInterval(loadWeatherData, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [currentLocation]);

  if (loading) {
    return (
      <ThemedView className="bg-white dark:bg-neutral-800 rounded-3xl shadow-md border border-soil-200/80 dark:border-neutral-700/80 p-6">
        <View className="flex-row items-center justify-between pb-4">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
              <MaterialIcons name="cloud" size={20} color="#2563eb" />
            </View>
            <ThemedText
              type="defaultSemiBold"
              className="text-lg font-semibold text-neutral-900"
            >
              Weather
            </ThemedText>
          </View>
        </View>
        <View className="flex justify-center items-center py-8">
          <Loader size="md" text="Loading weather..." />
        </View>
      </ThemedView>
    );
  }

  if (!weather) {
    return (
      <ThemedView className="bg-white dark:bg-neutral-800 rounded-3xl shadow-md border border-soil-200/80 dark:border-neutral-700/80 p-6">
        <View className="flex-row items-center justify-between pb-4">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
              <MaterialIcons name="cloud" size={20} color="#2563eb" />
            </View>
            <ThemedText
              type="defaultSemiBold"
              className="text-lg font-semibold text-neutral-900"
            >
              Weather
            </ThemedText>
          </View>
        </View>
        <View className="py-8">
          <ThemedText type="default" className="text-center text-neutral-500">
            Unable to load weather data
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="bg-white/95 dark:bg-neutral-800/95 rounded-3xl shadow-sm border border-soil-200/60 dark:border-neutral-700/60 p-6">
      <View className="flex-row items-center justify-between pb-4">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
            <MaterialIcons name="cloud" size={20} color="#2563eb" />
          </View>
          <View>
            <ThemedText
              type="defaultSemiBold"
              className="text-lg font-semibold text-neutral-900"
            >
              Weather
            </ThemedText>
            {weather && (
              <ThemedText type="default" className="text-sm text-neutral-600">
                {weather.location}
              </ThemedText>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            try {
              router.push("/weather");
            } catch {
              console.log("Navigation not available yet");
            }
          }}
          className="flex-row items-center gap-1"
        >
          <ThemedText
            type="default"
            className="text-sm text-primary-600 font-medium"
          >
            View all
          </ThemedText>
          <MaterialIcons name="arrow-forward" size={16} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <View className="space-y-5 flex flex-col gap-3">
        <View className="flex-row items-center justify-between p-3 bg-neutral-50/80 rounded-2xl">
          <View className="flex-row items-center gap-3">
            <MaterialIcons name="thermostat" size={20} color="#dc2626" />
            <ThemedText type="default" className="text-sm text-neutral-600">
              Temperature
            </ThemedText>
          </View>
          <ThemedText
            type="defaultSemiBold"
            className="font-semibold text-neutral-900"
          >
            {weather.temperature}
          </ThemedText>
        </View>

        <View className="flex-row items-center justify-between p-3 bg-neutral-50/80 rounded-2xl">
          <View className="flex-row items-center gap-3">
            <MaterialIcons name="water-drop" size={20} color="#2563eb" />
            <ThemedText type="default" className="text-sm text-neutral-600">
              Humidity
            </ThemedText>
          </View>
          <ThemedText
            type="defaultSemiBold"
            className="font-semibold text-neutral-900"
          >
            {weather.humidity}
          </ThemedText>
        </View>

        <View className="flex-row items-center justify-between p-3 bg-neutral-50/80 rounded-2xl">
          <View className="flex-row items-center gap-3">
            <MaterialIcons name="wb-sunny" size={20} color="#eab308" />
            <ThemedText type="default" className="text-sm text-neutral-600">
              Forecast
            </ThemedText>
          </View>
          <ThemedText
            type="defaultSemiBold"
            className="font-semibold text-neutral-900"
          >
            {weather.forecast}
          </ThemedText>
        </View>

        <View className="flex-row items-center justify-between p-3 bg-neutral-50/80 rounded-2xl">
          <View className="flex-row items-center gap-3">
            <MaterialIcons name="cloud" size={20} color="#6b7280" />
            <ThemedText type="default" className="text-sm text-neutral-600">
              Rainfall
            </ThemedText>
          </View>
          <ThemedText
            type="defaultSemiBold"
            className="font-semibold text-neutral-900"
          >
            {weather.rainfall}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}
