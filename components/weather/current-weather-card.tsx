import { CurrentWeather } from "@/lib/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { ThemedView } from "../themed-view";

interface CurrentWeatherCardProps {
  currentWeather: CurrentWeather;
}

interface WeatherDetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export default function CurrentWeatherCard({
  currentWeather,
}: CurrentWeatherCardProps) {
  if (!currentWeather) {
    return (
      <ThemedView className="bg-white/90 rounded-3xl shadow-sm border border-white/60 p-6 items-center">
        <Text className="text-neutral-500 dark:text-neutral-400">
          Weather data not available.
        </Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="bg-white/90 rounded-3xl shadow-sm border border-white/60 p-6">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-6">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
            <MaterialIcons name="cloud" size={20} color="#2563eb" />
          </View>
          <View>
            <Text className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Current Weather
            </Text>
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="place" size={16} color="#6b7280" />
              <Text className="text-sm text-neutral-600 dark:text-neutral-400">
                {currentWeather.location}
              </Text>
            </View>
          </View>
        </View>
        <View className="text-right">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="schedule" size={16} color="#6b7280" />
            <Text className="text-sm text-neutral-500 dark:text-neutral-400">
              Updated: {currentWeather.lastUpdated}
            </Text>
          </View>
        </View>
      </View>

      {/* Main Weather Display */}
      <View className="flex-col lg:flex-row gap-8">
        {/* Temperature and Icon */}
        <View className="flex-row items-center gap-6">
          <View className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center">
            <MaterialIcons name="wb-sunny" size={48} color="#f59e0b" />
          </View>
          <View>
            <Text className="text-5xl font-bold text-neutral-900 dark:text-neutral-100">
              {currentWeather.temperature}
            </Text>
            <Text className="text-xl text-neutral-600 dark:text-neutral-400 font-medium">
              {currentWeather.forecast}
            </Text>
          </View>
        </View>

        {/* Weather Details */}
        <View className="flex-row flex-wrap gap-4">
          <WeatherDetailItem
            icon={<MaterialIcons name="thermostat" size={20} color="#dc2626" />}
            label="Temperature"
            value={currentWeather.temperature}
          />
          <WeatherDetailItem
            icon={<MaterialIcons name="water-drop" size={20} color="#2563eb" />}
            label="Humidity"
            value={currentWeather.humidity}
          />
          <WeatherDetailItem
            icon={<MaterialIcons name="air" size={20} color="#6b7280" />}
            label="Wind Speed"
            value={currentWeather.windSpeed}
          />
          <WeatherDetailItem
            icon={<MaterialIcons name="umbrella" size={20} color="#2563eb" />}
            label="Rainfall"
            value={currentWeather.rainfall}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const WeatherDetailItem: React.FC<WeatherDetailItemProps> = ({
  icon,
  label,
  value,
}) => {
  return (
    <View className="flex-row items-center gap-3 p-3 bg-neutral-50/80 rounded-2xl flex-1 min-w-[140px]">
      <View className="flex-shrink-0">{icon}</View>
      <View>
        <Text className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
          {label}
        </Text>
        <Text className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {value}
        </Text>
      </View>
    </View>
  );
};
