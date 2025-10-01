import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

interface MapViewProps {
  children?: React.ReactNode;
  className?: string;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
  onPress?: (event: any) => void;
  onRegionChange?: (region: any) => void;
}

export default function MapView({
  children,
  className = "flex-1",
  initialRegion = {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  showsUserLocation = false,
  showsMyLocationButton = false,
  onPress,
  onRegionChange,
}: MapViewProps) {
  const [userLocation, setUserLocation] =
    useState<Location.LocationObject | null>(null);

  useEffect(() => {
    // Get user location if requested
    const getLocation = async () => {
      if (showsUserLocation) {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === "granted") {
            const location = await Location.getCurrentPositionAsync({});
            setUserLocation(location);
          }
        } catch (error) {
          console.error("Failed to get location:", error);
        }
      }
    };

    getLocation();
  }, [showsUserLocation]);

  const openInMaps = () => {
    const url = `https://www.google.com/maps?q=${initialRegion.latitude},${initialRegion.longitude}`;
    Linking.openURL(url);
  };

  const openUserLocation = () => {
    if (userLocation) {
      const url = `https://www.google.com/maps?q=${userLocation.coords.latitude},${userLocation.coords.longitude}`;
      Linking.openURL(url);
    }
  };

  // Show interactive map placeholder for Expo Go
  return (
    <View
      className={`${className} bg-gradient-to-br from-blue-50 to-green-50 justify-center items-center`}
    >
      <View className="bg-white/90 p-6 rounded-2xl shadow-lg border border-white/60 max-w-sm mx-4">
        <View className="items-center mb-4">
          <View className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <Text className="text-2xl">🗺️</Text>
          </View>
        </View>

        <Text className="text-lg font-bold text-neutral-900 text-center mb-2">
          Interactive Map
        </Text>

        <Text className="text-sm text-neutral-600 text-center mb-4">
          Field visualization and management
        </Text>

        {initialRegion && (
          <View className="bg-neutral-100 p-3 rounded-xl mb-3">
            <Text className="text-xs text-neutral-600 text-center">
              Location: {initialRegion.latitude.toFixed(4)},{" "}
              {initialRegion.longitude.toFixed(4)}
            </Text>
          </View>
        )}

        {showsUserLocation && userLocation && (
          <View className="bg-green-100 p-2 rounded-lg mb-3">
            <Text className="text-xs text-green-700 text-center">
              📍 User Location: {userLocation.coords.latitude.toFixed(4)},{" "}
              {userLocation.coords.longitude.toFixed(4)}
            </Text>
          </View>
        )}

        <View className="space-y-2 mb-4">
          <TouchableOpacity
            onPress={openInMaps}
            className="bg-blue-500 p-3 rounded-xl"
          >
            <Text className="text-white text-center font-medium">
              📍 Open in Google Maps
            </Text>
          </TouchableOpacity>

          {showsUserLocation && userLocation && (
            <TouchableOpacity
              onPress={openUserLocation}
              className="bg-green-500 p-3 rounded-xl"
            >
              <Text className="text-white text-center font-medium">
                🎯 My Location
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="bg-neutral-50 p-3 rounded-xl">
          <Text className="text-xs text-neutral-600 text-center">
            Tap to open in your default map app
          </Text>
        </View>

        {children && (
          <View className="mt-4 p-3 bg-neutral-50 rounded-xl">
            <Text className="text-xs text-neutral-600 text-center">
              Field annotations available in development build
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
