import { ForecastDay } from "@/lib/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { ThemedView } from "../themed-view";

interface ForecastCardProps {
  forecast: ForecastDay[];
}

interface ForecastDayItemProps {
  day: ForecastDay;
}

export default function ForecastCard({ forecast }: ForecastCardProps) {
  return (
    <ThemedView className="bg-white/90 rounded-3xl shadow-sm border border-white/60 p-6">
      {/* Header */}
      <View className="flex-row items-center gap-3 pb-6">
        <View className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
          <MaterialIcons name="calendar-today" size={20} color="#7c3aed" />
        </View>
        <Text className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          5-Day Forecast
        </Text>
      </View>

      {/* Forecast Items */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-4">
          {forecast.map((day, index) => (
            <ForecastDayItem key={index} day={day} />
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const ForecastDayItem: React.FC<ForecastDayItemProps> = ({ day }) => {
  return (
    <View className="p-4 bg-neutral-50/80 rounded-2xl border border-neutral-100 items-center min-w-[120px]">
      <Text className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm pb-1">
        {day.day}
      </Text>
      <Text className="text-xs text-neutral-500 dark:text-neutral-400 pb-3">
        {day.date}
      </Text>

      <View className="flex justify-center pb-3">
        <View className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
          <MaterialIcons name="wb-sunny" size={32} color="#f59e0b" />
        </View>
      </View>

      <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300 pb-2 text-center">
        {day.forecast}
      </Text>

      <View className="flex-row justify-center gap-2 pb-2">
        <Text className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {day.high}
        </Text>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">
          {day.low}
        </Text>
      </View>

      <Text className="text-xs text-blue-600 font-medium">
        {day.rainChance}
      </Text>
    </View>
  );
};
