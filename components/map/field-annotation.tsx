import { Field } from "@/lib/types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface FieldAnnotationProps {
  field: Field;
  onPress?: (field: Field) => void;
}

export default function FieldAnnotation({
  field,
  onPress,
}: FieldAnnotationProps) {
  // Convert field coordinates to center point for display
  const coordinates = field.coordinates[0];
  const centerLng =
    coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length;
  const centerLat =
    coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length;

  return (
    <View className="absolute top-4 right-4 bg-white/90 p-3 rounded-xl shadow-lg border border-white/60 max-w-xs">
      <TouchableOpacity onPress={() => onPress?.(field)}>
        <View className="flex-row items-center gap-2 mb-2">
          <View
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: field.color }}
          />
          <Text className="text-sm font-semibold text-neutral-900 flex-1">
            {field.label || "Field"}
          </Text>
        </View>
        <Text className="text-xs text-neutral-600 mb-1">
          Area: {field.area.toFixed(2)} hectares
        </Text>
        <Text className="text-xs text-neutral-500">
          📍 {centerLat.toFixed(4)}, {centerLng.toFixed(4)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
