import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

type MapControlsProps = {
  onReset: () => void;
  onSave: () => void;
  onLoad: () => void;
  isLoading: boolean;
  isSaving: boolean;
  hasFields: boolean;
};

export default function MapControls({
  onReset,
  onSave,
  onLoad,
  isLoading,
  isSaving,
  hasFields,
}: MapControlsProps) {
  return (
    <View className="space-y-3">
      <TouchableOpacity
        onPress={onReset}
        disabled={isLoading || isSaving || !hasFields}
        className={`flex-row items-center justify-center gap-2 py-3 px-4 rounded-2xl ${
          isLoading || isSaving || !hasFields ? "bg-neutral-400" : "bg-red-600"
        }`}
      >
        <MaterialIcons name="refresh" size={20} color="white" />
        <ThemedText type="defaultSemiBold" className="text-white font-semibold">
          Reset Map
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSave}
        disabled={isLoading || isSaving || !hasFields}
        className={`flex-row items-center justify-center gap-2 py-3 px-4 rounded-2xl ${
          isLoading || isSaving || !hasFields
            ? "bg-neutral-400"
            : "bg-primary-600"
        }`}
      >
        {isSaving ? (
          <>
            <MaterialIcons name="refresh" size={20} color="white" />
            <ThemedText
              type="defaultSemiBold"
              className="text-white font-semibold"
            >
              Creating...
            </ThemedText>
          </>
        ) : (
          <>
            <MaterialIcons name="save" size={20} color="white" />
            <ThemedText
              type="defaultSemiBold"
              className="text-white font-semibold"
            >
              Create/Save Fields
            </ThemedText>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onLoad}
        disabled={isLoading || isSaving}
        className={`flex-row items-center justify-center gap-2 py-3 px-4 rounded-2xl ${
          isLoading || isSaving ? "bg-neutral-400" : "bg-blue-600"
        }`}
      >
        {isLoading ? (
          <>
            <MaterialIcons name="refresh" size={20} color="white" />
            <ThemedText
              type="defaultSemiBold"
              className="text-white font-semibold"
            >
              Loading...
            </ThemedText>
          </>
        ) : (
          <>
            <MaterialIcons name="upload" size={20} color="white" />
            <ThemedText
              type="defaultSemiBold"
              className="text-white font-semibold"
            >
              Load Fields
            </ThemedText>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
