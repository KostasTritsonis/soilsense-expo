import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { ThemedView } from "../themed-view";

export interface WeatherAlert {
  type: "warning" | "info";
  message: string;
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

export default function WeatherAlerts({ alerts }: WeatherAlertsProps) {
  if (alerts.length === 0) {
    return (
      <ThemedView className="bg-white/90 rounded-3xl shadow-sm border border-white/60 p-6">
        <View className="flex-row items-center gap-3 pb-4">
          <View className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
            <MaterialIcons name="info" size={20} color="#16a34a" />
          </View>
          <Text className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Weather Alerts
          </Text>
        </View>
        <View className="items-center py-8">
          <Text className="text-neutral-500 dark:text-neutral-400">
            No weather alerts at this time
          </Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="bg-white/90 rounded-3xl shadow-sm border border-white/60 p-6">
      <View className="flex-row items-center gap-3 pb-4">
        <View className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
          <MaterialIcons name="warning" size={20} color="#ea580c" />
        </View>
        <Text className="text-xl font-semibold text-neutral-900">
          Weather Alerts
        </Text>
      </View>

      <View className="space-y-3">
        {alerts.map((alert, index) => (
          <View
            key={index}
            className={`p-4 rounded-2xl border ${
              alert.type === "warning"
                ? "bg-orange-50 border-orange-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <View className="flex-row items-start gap-3">
              {alert.type === "warning" ? (
                <MaterialIcons name="warning" size={20} color="#ea580c" />
              ) : (
                <MaterialIcons name="info" size={20} color="#2563eb" />
              )}
              <Text
                className={`text-sm font-medium ${
                  alert.type === "warning" ? "text-orange-800" : "text-blue-800"
                }`}
              >
                {alert.message}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}
