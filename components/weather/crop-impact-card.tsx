import { CurrentWeather, ForecastDay } from "@/lib/types";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";

import React from "react";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

interface CropImpactCardProps {
  currentWeather: CurrentWeather;
  forecast: ForecastDay[];
}

export default function CropImpactCard({
  currentWeather,
  forecast,
}: CropImpactCardProps) {
  if (!currentWeather) {
    return (
      <ThemedView className="bg-white/90 rounded-3xl shadow-sm border border-white/60 p-6 items-center">
        <ThemedText type="default" className="text-neutral-500">
          Weather data not available.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="bg-white/90 rounded-3xl shadow-sm border border-white/60 p-6">
      <View className="flex-row items-center gap-3 pb-6">
        <View className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
          <MaterialIcons name="eco" size={20} color="#16a34a" />
        </View>
        <ThemedText
          type="defaultSemiBold"
          className="text-xl font-semibold text-neutral-900"
        >
          Crop Impact Analysis
        </ThemedText>
      </View>

      <View className="space-y-4">
        <CropImpactItem
          cropName="Corn (Field 3)"
          currentWeather={currentWeather}
          forecast={forecast}
          optimalTempRange={[18, 25]}
          highHumidityThreshold={70}
        />

        <CropImpactItem
          cropName="Wheat (Field 1)"
          currentWeather={currentWeather}
          forecast={forecast}
          optimalTempRange={[15, 24]}
          highHumidityThreshold={75}
        />
      </View>
    </ThemedView>
  );
}

interface CropImpactItemProps {
  cropName: string;
  currentWeather: CurrentWeather;
  forecast: ForecastDay[];
  optimalTempRange: [number, number];
  highHumidityThreshold: number;
}

const CropImpactItem: React.FC<CropImpactItemProps> = ({
  cropName,
  currentWeather,
  forecast,
  optimalTempRange,
  highHumidityThreshold,
}) => {
  const currentTemp = parseInt(currentWeather.temperature);
  const currentHumidity = parseInt(currentWeather.humidity);
  const isOptimalTemp =
    currentTemp >= optimalTempRange[0] && currentTemp <= optimalTempRange[1];
  const isHighHumidity = currentHumidity > highHumidityThreshold;
  const heavyRainExpected = forecast
    .slice(0, 3)
    .some((day) => parseFloat(day.rainChance) > 60);

  return (
    <View className="p-4 bg-neutral-50/80 rounded-2xl border border-neutral-100">
      <ThemedText
        type="defaultSemiBold"
        className="font-semibold text-neutral-900 text-sm pb-3"
      >
        {cropName}
      </ThemedText>

      <View className="space-y-3">
        {/* Temperature Status */}
        <View className="flex-row items-center gap-3">
          <MaterialIcons name="thermostat" size={16} color="#dc2626" />
          <View className="flex-1">
            <ThemedText type="default" className="text-xs text-neutral-600">
              Temperature
            </ThemedText>
            <ThemedText
              type="default"
              className="text-sm font-medium text-neutral-900"
            >
              {currentWeather.temperature}°C (Optimal: {optimalTempRange[0]}-
              {optimalTempRange[1]}°C)
            </ThemedText>
          </View>
          <View
            className={`px-2 py-1 rounded-full ${
              isOptimalTemp ? "bg-green-100" : "bg-yellow-100"
            }`}
          >
            <ThemedText
              type="default"
              className={`text-xs font-medium ${
                isOptimalTemp ? "text-green-700" : "text-yellow-700"
              }`}
            >
              {isOptimalTemp ? "Optimal" : "Moderate"}
            </ThemedText>
          </View>
        </View>

        {/* Humidity Status */}
        <View className="flex-row items-center gap-3">
          <MaterialIcons name="water-drop" size={16} color="#2563eb" />
          <View className="flex-1">
            <ThemedText type="default" className="text-xs text-neutral-600">
              Humidity
            </ThemedText>
            <ThemedText
              type="default"
              className="text-sm font-medium text-neutral-900"
            >
              {currentWeather.humidity}%
            </ThemedText>
          </View>
          <View
            className={`px-2 py-1 rounded-full ${
              isHighHumidity ? "bg-orange-100" : "bg-green-100"
            }`}
          >
            <ThemedText
              type="default"
              className={`text-xs font-medium ${
                isHighHumidity ? "text-orange-700" : "text-green-700"
              }`}
            >
              {isHighHumidity ? "High" : "Normal"}
            </ThemedText>
          </View>
        </View>

        {/* Recommendations */}
        {(isHighHumidity || heavyRainExpected) && (
          <View className="flex-row items-start gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
            <MaterialIcons name="warning" size={16} color="#ea580c" />
            <View className="flex-1">
              <ThemedText type="default" className="text-xs text-orange-800">
                {isHighHumidity && (
                  <ThemedText type="default" className="pb-1">
                    Monitor for fungal diseases due to high humidity
                  </ThemedText>
                )}
                {heavyRainExpected && (
                  <ThemedText type="default">
                    Heavy rain expected - consider protective measures
                  </ThemedText>
                )}
              </ThemedText>
            </View>
          </View>
        )}

        {!isHighHumidity && !heavyRainExpected && (
          <ThemedText
            type="default"
            className="text-xs text-green-700 font-medium"
          >
            ✓ Conditions are favorable for growth
          </ThemedText>
        )}
      </View>
    </View>
  );
};
