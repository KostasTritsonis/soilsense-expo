import { Field } from "@/lib/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

type FieldInfoPanelProps = {
  selectedField: Field;
  onGetDirections: (field: Field) => void;
  onDeselect: () => void;
  isLoading?: boolean;
  hasCustomStartPoint?: boolean;
};

export default function FieldInfoPanel({
  selectedField,
  onGetDirections,
  onDeselect,
  isLoading = false,
  hasCustomStartPoint = false,
}: FieldInfoPanelProps) {
  return (
    <ThemedView className="absolute bottom-4 left-4 right-4 bg-white/95 rounded-3xl shadow-lg border border-white/60 p-4 z-10">
      <View className="flex-row justify-between items-center pb-3">
        <View className="flex-row items-center gap-3 flex-1">
          <View
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: selectedField.color }}
          />
          <ThemedText
            type="defaultSemiBold"
            className="text-lg font-bold text-neutral-900 flex-1"
            numberOfLines={1}
          >
            {selectedField.label || "Unnamed Field"}
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={onDeselect}
          className="w-8 h-8 bg-neutral-100 rounded-xl flex items-center justify-center"
        >
          <MaterialIcons name="close" size={16} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View className="space-y-3 pb-4">
        <View className="flex-row items-center gap-3 p-3 bg-neutral-50/80 rounded-2xl">
          <View className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
            <MaterialIcons name="local-offer" size={16} color="#059669" />
          </View>
          <View className="flex-1">
            <ThemedText
              type="default"
              className="text-xs text-neutral-600 font-medium"
            >
              Crop Type
            </ThemedText>
            <ThemedText
              type="defaultSemiBold"
              className="text-sm font-semibold text-neutral-900"
              numberOfLines={1}
            >
              {selectedField.categories?.[0]?.type || "N/A"}
            </ThemedText>
          </View>
        </View>

        <View className="flex-row items-center gap-3 p-3 bg-neutral-50/80 rounded-2xl">
          <View className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
            <MaterialIcons name="straighten" size={16} color="#2563eb" />
          </View>
          <View className="flex-1">
            <ThemedText
              type="default"
              className="text-xs text-neutral-600 font-medium"
            >
              Area
            </ThemedText>
            <ThemedText
              type="defaultSemiBold"
              className="text-sm font-semibold text-neutral-900"
            >
              {selectedField.area?.toFixed(2) || 0} m²
            </ThemedText>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => onGetDirections(selectedField)}
        disabled={isLoading}
        className={`w-full py-3 px-4 rounded-2xl flex-row items-center justify-center ${
          isLoading ? "bg-neutral-400" : "bg-primary-600"
        }`}
      >
        {isLoading ? (
          <>
            <MaterialIcons name="refresh" size={16} color="white" />
            <ThemedText
              type="defaultSemiBold"
              className="text-white text-sm font-semibold ml-2"
            >
              Getting Location...
            </ThemedText>
          </>
        ) : (
          <>
            <MaterialIcons name="navigation" size={16} color="white" />
            <ThemedText
              type="defaultSemiBold"
              className="text-white text-sm font-semibold ml-2"
            >
              Get Directions
            </ThemedText>
          </>
        )}
      </TouchableOpacity>

      <ThemedText
        type="default"
        className="text-xs text-neutral-500 mt-3 text-center"
      >
        {hasCustomStartPoint
          ? "Will use your placed start point"
          : "Uses your current location"}
      </ThemedText>
    </ThemedView>
  );
}
