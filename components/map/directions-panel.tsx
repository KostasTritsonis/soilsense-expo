import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedView } from "../themed-view";

interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  maneuver: {
    type: string;
  };
}

interface RouteInfo {
  distanceText: string;
  durationText: string;
  steps: RouteStep[];
  geometry: any;
}

interface DirectionsPanelProps {
  routeInfo: RouteInfo | null;
  onClose: () => void;
  startPoint: [number, number] | null;
  destination: string;
}

export default function DirectionsPanel({
  routeInfo,
  onClose,
  startPoint,
  destination,
}: DirectionsPanelProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  if (!routeInfo) {
    return null;
  }

  const formatStepDistance = (meters: number): string => {
    if (meters < 100) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const getStepIcon = (maneuverType: string) => {
    switch (maneuverType) {
      case "turn":
        return "turn-right";
      case "merge":
        return "merge";
      case "depart":
        return "navigation";
      case "arrive":
        return "place";
      case "roundabout":
        return "refresh";
      default:
        return "arrow-forward";
    }
  };

  const openInMaps = () => {
    if (startPoint) {
      const url = `https://www.google.com/maps/dir/${startPoint[1]},${startPoint[0]}/${destination}`;
      Linking.openURL(url);
    }
  };

  return (
    <ThemedView className="absolute top-4 left-4 right-4 bg-white/95 rounded-3xl shadow-lg border border-white/60 z-50 max-h-[85vh] overflow-hidden">
      {/* Header */}
      <View className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 border-b border-neutral-200">
        <View className="flex-row justify-between items-center pb-3">
          <Text className="text-xl font-bold text-neutral-900">Directions</Text>
          <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 bg-white/80 rounded-xl flex items-center justify-center"
          >
            <MaterialIcons name="close" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Route Summary */}
        <View className="space-y-3">
          <View className="flex-row items-center gap-3 p-3 bg-white/80 rounded-2xl">
            <View className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
              <MaterialIcons name="place" size={16} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-neutral-600 font-medium">
                Destination
              </Text>
              <Text
                className="text-sm font-semibold text-neutral-900"
                numberOfLines={1}
              >
                {destination}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 flex-row items-center gap-3 p-3 bg-white/80 rounded-2xl">
              <View className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                <MaterialIcons name="navigation" size={16} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-neutral-600 font-medium">
                  Distance
                </Text>
                <Text className="text-sm font-semibold text-neutral-900">
                  {routeInfo.distanceText}
                </Text>
              </View>
            </View>

            <View className="flex-1 flex-row items-center gap-3 p-3 bg-white/80 rounded-2xl">
              <View className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center">
                <MaterialIcons name="access-time" size={16} color="#d97706" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-neutral-600 font-medium">
                  Duration
                </Text>
                <Text className="text-sm font-semibold text-neutral-900">
                  {routeInfo.durationText}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Route Steps */}
      <ScrollView className="max-h-64" showsVerticalScrollIndicator={false}>
        <View className="p-4 space-y-3">
          {routeInfo.steps.map((step: RouteStep, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                setSelectedStep(selectedStep === index ? null : index)
              }
              className={`flex-row items-start gap-3 p-3 rounded-2xl ${
                selectedStep === index
                  ? "bg-primary-50 border-2 border-primary-200"
                  : "bg-neutral-50/80"
              }`}
            >
              {/* Step Number */}
              <View className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
                <Text className="text-white text-sm font-bold">
                  {index + 1}
                </Text>
              </View>

              {/* Step Content */}
              <View className="flex-1">
                <View className="flex-row items-center gap-2 pb-2">
                  <MaterialIcons
                    name={getStepIcon(step.maneuver.type)}
                    size={16}
                    color="#7c3aed"
                  />
                  <Text className="text-sm font-semibold text-neutral-900 flex-1">
                    {step.instruction}
                  </Text>
                </View>

                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons
                      name="navigation"
                      size={12}
                      color="#6b7280"
                    />
                    <Text className="text-xs text-neutral-500">
                      {formatStepDistance(step.distance)}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons
                      name="access-time"
                      size={12}
                      color="#6b7280"
                    />
                    <Text className="text-xs text-neutral-500">
                      {Math.round(step.duration / 60)} min
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View className="border-t border-neutral-200 p-4">
        <View className="space-y-3">
          <TouchableOpacity
            onPress={openInMaps}
            className="flex-row items-center justify-center gap-2 bg-primary-600 py-3 px-4 rounded-2xl"
          >
            <MaterialIcons name="open-in-new" size={16} color="white" />
            <Text className="text-white text-sm font-semibold">
              Open in Maps
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}
