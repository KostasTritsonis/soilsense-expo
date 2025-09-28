import { Field } from "@/lib/types";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedView } from "../themed-view";

type FieldEditorProps = {
  field: Field | null;
  onUpdate: (id: string, updates: Partial<Field>) => void;
  onSave: (field: Field, updates: Partial<Field>) => void;
  onClose: () => void;
  isVisible: boolean;
};

const CATEGORIES = [
  "Wheat",
  "Corn",
  "Soybeans",
  "Rice",
  "Barley",
  "Oats",
  "Cotton",
  "Potatoes",
  "Tomatoes",
  "Lettuce",
  "Carrots",
  "General",
  "Uncategorized",
];

export default function FieldEditor({
  field,
  onUpdate,
  onSave,
  onClose,
  isVisible,
}: FieldEditorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  React.useEffect(() => {
    if (field) {
      setSelectedCategory(field.categories?.[0]?.type || "General");
    }
  }, [field]);

  if (!field) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ThemedView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-blue-50">
          <Text className="text-xl font-bold text-primary-700">Edit Field</Text>
          <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 bg-neutral-100 rounded-xl flex items-center justify-center"
          >
            <MaterialIcons name="close" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          <View className="space-y-6">
            {/* Label Input */}
            <View>
              <Text className="text-neutral-700 text-sm mb-2">Label</Text>
              <TextInput
                value={field.label || ""}
                onChangeText={(text) => onUpdate(field.id, { label: text })}
                className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-neutral-200 text-neutral-900"
                placeholder="Enter field label"
                placeholderTextColor="#9ca3af"
                editable={!field.isUpdating}
              />
            </View>

            {/* Category Selection */}
            <View>
              <Text className="text-neutral-700 text-sm mb-2">Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-2"
              >
                <View className="flex-row gap-2">
                  {CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() => {
                        setSelectedCategory(category);
                        onUpdate(field.id, {
                          categories: [{ type: category }],
                        });
                      }}
                      className={`px-4 py-2 rounded-xl border ${
                        selectedCategory === category
                          ? "bg-primary-100 border-primary-500"
                          : "bg-white border-neutral-200"
                      }`}
                      disabled={field.isUpdating}
                    >
                      <Text
                        className={`text-sm ${
                          selectedCategory === category
                            ? "text-primary-700 font-semibold"
                            : "text-neutral-600"
                        }`}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Color Picker */}
            <View>
              <Text className="text-soil-700 text-sm mb-2 flex-row items-center gap-2">
                <MaterialIcons name="palette" size={16} color="#7c3aed" />
                Color
              </Text>
              <View className="flex-row gap-3 flex-wrap">
                {[
                  "#22c55e", // primary-500
                  "#16a34a", // primary-600
                  "#15803d", // primary-700
                  "#f4a261", // crop.wheat
                  "#e63946", // crop.tomato
                  "#2a9d8f", // crop.olive
                  "#ffd166", // crop.corn
                  "#06d6a0", // crop.rice
                  "#118ab2", // crop.soybean
                  "#ed8936", // earth-500
                ].map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => onUpdate(field.id, { color })}
                    className={`w-12 h-12 rounded-2xl border-2 ${
                      field.color === color
                        ? "border-soil-400"
                        : "border-soil-200"
                    }`}
                    style={{ backgroundColor: color }}
                    disabled={field.isUpdating}
                  />
                ))}
              </View>
            </View>

            {/* Field Info Display */}
            <View className="p-4 bg-soil-50/80 rounded-2xl">
              <Text className="text-soil-700 text-sm mb-2">
                Field Information
              </Text>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-soil-600">Area:</Text>
                  <Text className="text-neutral-900 font-semibold">
                    {field.area?.toFixed(2) || 0} m²
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-soil-600">Category:</Text>
                  <Text className="text-neutral-900 font-semibold">
                    {field.categories?.[0]?.type || "Uncategorized"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Updating Indicator */}
            {field.isUpdating && (
              <View className="flex-row items-center gap-2 p-3 bg-primary-50 rounded-2xl">
                <MaterialIcons name="refresh" size={16} color="#7c3aed" />
                <Text className="text-primary-600 text-sm">Saving...</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="p-4 border-t border-neutral-200 bg-white">
          <View className="space-y-3">
            <TouchableOpacity
              className="w-full bg-primary-600 py-3 px-4 rounded-2xl flex-row items-center justify-center"
              onPress={() => {
                onSave(field, {
                  label: field.label,
                  color: field.color,
                  area: field.area,
                  coordinates: field.coordinates,
                  categories: field.categories ?? [{ type: "Uncategorized" }],
                });
              }}
              disabled={field.isUpdating}
            >
              <MaterialIcons name="save" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">
                Update Field
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-neutral-100 py-3 px-4 rounded-2xl flex-row items-center justify-center"
              onPress={onClose}
            >
              <MaterialIcons name="close" size={20} color="#6b7280" />
              <Text className="text-neutral-700 font-semibold ml-2">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </Modal>
  );
}
