import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

type InfoPanelProps = {
  lng: number;
  lat: number;
  zoom: number;
  fieldArea: number;
};

export default function InfoPanel({
  lng,
  lat,
  zoom,
  fieldArea,
}: InfoPanelProps) {
  return (
    <ThemedView className="p-4 bg-white/90 border-t border-neutral-200">
      <View className="space-y-3">
        <View className="flex-row items-center justify-between p-2 bg-neutral-50/80 rounded-xl">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="place" size={16} color="#6b7280" />
            <ThemedText
              type="default"
              className="text-sm text-neutral-600 font-medium"
            >
              Longitude
            </ThemedText>
          </View>
          <ThemedText
            type="defaultSemiBold"
            className="text-sm font-semibold text-neutral-900"
          >
            {lng.toFixed(4)}
          </ThemedText>
        </View>

        <View className="flex-row items-center justify-between p-2 bg-neutral-50/80 rounded-xl">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="place" size={16} color="#6b7280" />
            <ThemedText
              type="default"
              className="text-sm text-neutral-600 font-medium"
            >
              Latitude
            </ThemedText>
          </View>
          <ThemedText
            type="defaultSemiBold"
            className="text-sm font-semibold text-neutral-900"
          >
            {lat.toFixed(4)}
          </ThemedText>
        </View>

        <View className="flex-row items-center justify-between p-2 bg-neutral-50/80 rounded-xl">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="zoom-in" size={16} color="#6b7280" />
            <ThemedText
              type="default"
              className="text-sm text-neutral-600 font-medium"
            >
              Zoom
            </ThemedText>
          </View>
          <ThemedText
            type="defaultSemiBold"
            className="text-sm font-semibold text-neutral-900"
          >
            {zoom.toFixed(2)}
          </ThemedText>
        </View>

        <View className="flex-row items-center justify-between p-2 bg-neutral-50/80 rounded-xl">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="straighten" size={16} color="#6b7280" />
            <ThemedText
              type="default"
              className="text-sm text-neutral-600 font-medium"
            >
              Area
            </ThemedText>
          </View>
          <ThemedText
            type="defaultSemiBold"
            className="text-sm font-semibold text-neutral-900"
          >
            {fieldArea.toFixed(2)} m²
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}
