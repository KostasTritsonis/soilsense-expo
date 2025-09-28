import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface MapViewProps {
  children?: React.ReactNode;
  className?: string;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta?: number;
    longitudeDelta?: number;
  };
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
}

export default function MapView({
  children,
  className = "flex-1",
  initialRegion,
  showsUserLocation = false,
  showsMyLocationButton = false,
}: MapViewProps) {
  // Check if we're running in Expo Go or development build
  const isExpoGo = typeof __DEV__ !== "undefined" && __DEV__;

  // For now, show a placeholder that works with Expo Go
  // In production, you would build a development build with native Mapbox support
  return (
    <View className={className}>
      <View className="flex-1 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg justify-center items-center">
        <View className="bg-white/90 p-6 rounded-2xl shadow-lg border border-white/60">
          <View className="items-center mb-4">
            <MaterialIcons name="map" size={48} color="#2563eb" />
          </View>
          <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100 text-center mb-2">
            Interactive Map
          </Text>
          <Text className="text-sm text-neutral-600 dark:text-neutral-400 text-center mb-4">
            Field visualization and management
          </Text>

          {initialRegion && (
            <View className="bg-neutral-100 p-3 rounded-xl mb-3">
              <Text className="text-xs text-neutral-600 dark:text-neutral-400 text-center">
                Location: {initialRegion.latitude.toFixed(4)},{" "}
                {initialRegion.longitude.toFixed(4)}
              </Text>
            </View>
          )}

          {showsUserLocation && (
            <View className="bg-green-100 p-2 rounded-lg mb-2">
              <Text className="text-xs text-green-700 text-center">
                📍 User Location Enabled
              </Text>
            </View>
          )}

          <View className="bg-blue-100 p-3 rounded-xl mb-3">
            <Text className="text-xs text-blue-700 text-center">
              🗺️ Mapbox integration ready
            </Text>
          </View>

          <View className="bg-yellow-100 p-3 rounded-xl">
            <Text className="text-xs text-yellow-700 text-center">
              💡 Build development build for full map features
            </Text>
          </View>

          {children && (
            <View className="mt-4 p-3 bg-neutral-50 rounded-xl">
              <Text className="text-xs text-neutral-600 dark:text-neutral-400 text-center">
                Map overlays would appear here
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
