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

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (category: string, label: string) => void;
}

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

export default function CategoryModal({
  isOpen,
  onClose,
  onConfirm,
}: CategoryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("General");
  const [fieldLabel, setFieldLabel] = useState("");

  React.useEffect(() => {
    if (isOpen) {
      setFieldLabel("");
      setSelectedCategory("General");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (fieldLabel.trim()) {
      onConfirm(selectedCategory, fieldLabel.trim());
      onClose();
    }
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ThemedView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-blue-50">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="local-offer" size={20} color="#7c3aed" />
            <Text className="text-xl font-bold text-primary-700">
              Add Field Details
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="w-8 h-8 bg-neutral-100 rounded-xl flex items-center justify-center"
          >
            <MaterialIcons name="close" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          <View className="space-y-6">
            {/* Field Label Input */}
            <View>
              <Text className="text-neutral-700 text-sm mb-2">Field Label</Text>
              <TextInput
                value={fieldLabel}
                onChangeText={setFieldLabel}
                className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-neutral-200 text-neutral-900"
                placeholder="Enter field label"
                placeholderTextColor="#9ca3af"
                autoFocus
              />
            </View>

            {/* Category Selection */}
            <View>
              <Text className="text-neutral-700 text-sm mb-2">Category</Text>
              <View className="space-y-2">
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setSelectedCategory(category)}
                    className={`p-4 rounded-2xl border ${
                      selectedCategory === category
                        ? "bg-primary-100 border-primary-500"
                        : "bg-white border-neutral-200"
                    }`}
                  >
                    <View className="flex-row items-center justify-between">
                      <Text
                        className={`text-sm ${
                          selectedCategory === category
                            ? "text-primary-700"
                            : "text-neutral-900"
                        }`}
                      >
                        {category}
                      </Text>
                      {selectedCategory === category && (
                        <MaterialIcons name="check" size={20} color="#7c3aed" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="p-4 border-t border-neutral-200 bg-white">
          <View className="space-y-3">
            <TouchableOpacity
              className="w-full bg-primary-600 py-3 px-4 rounded-2xl flex-row items-center justify-center"
              onPress={handleConfirm}
              disabled={!fieldLabel.trim()}
            >
              <MaterialIcons name="check" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Confirm</Text>
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
