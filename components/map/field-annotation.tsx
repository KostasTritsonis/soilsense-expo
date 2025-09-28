import { Field } from "@/lib/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

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
    <View className="absolute top-4 right-4 bg-white/90 p-3 rounded-xl shadow-lg border border-white/60">
      <TouchableOpacity onPress={() => onPress?.(field)}>
        <View className="flex-row items-center gap-2">
          <View
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: field.color }}
          />
          <ThemedText
            type="defaultSemiBold"
            className="text-sm font-semibold text-neutral-900"
          >
            {field.label || "Field"}
          </ThemedText>
          <MaterialIcons name="info" size={16} color="#6b7280" />
        </View>
        <ThemedText type="default" className="text-xs text-neutral-600 mt-1">
          Area: {field.area.toFixed(2)} m²
        </ThemedText>
        <ThemedText type="default" className="text-xs text-neutral-500 mt-1">
          📍 {centerLat.toFixed(4)}, {centerLng.toFixed(4)}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}
