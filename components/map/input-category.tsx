import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

type InputCategoryProps = {
  onCreateCategory?: (categoryName: string) => Promise<void>;
};

export default function InputCategory({
  onCreateCategory,
}: InputCategoryProps) {
  const [categoryName, setCategoryName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return;

    setIsSaving(true);
    setError("");

    try {
      if (onCreateCategory) {
        await onCreateCategory(categoryName.trim());
      }
      setCategoryName(""); // Reset input after saving
    } catch (err) {
      setError("Failed to create category.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="w-full">
      <ThemedText
        type="defaultSemiBold"
        className="text-lg font-semibold text-neutral-900 pb-4"
      >
        Add Category
      </ThemedText>
      <View className="space-y-3">
        <TextInput
          value={categoryName}
          onChangeText={setCategoryName}
          placeholder="New category name"
          placeholderTextColor="#9ca3af"
          className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-neutral-200 text-neutral-900"
          editable={!isSaving}
        />

        <TouchableOpacity
          onPress={handleCreateCategory}
          disabled={isSaving || !categoryName.trim()}
          className={`flex-row items-center justify-center gap-2 py-3 rounded-2xl ${
            isSaving || !categoryName.trim()
              ? "bg-neutral-400"
              : "bg-primary-600"
          }`}
        >
          {isSaving ? (
            <>
              <MaterialIcons name="refresh" size={16} color="white" />
              <ThemedText
                type="defaultSemiBold"
                className="text-white font-semibold"
              >
                Saving...
              </ThemedText>
            </>
          ) : (
            <>
              <MaterialIcons name="add" size={16} color="white" />
              <ThemedText
                type="defaultSemiBold"
                className="text-white font-semibold"
              >
                Add Category
              </ThemedText>
            </>
          )}
        </TouchableOpacity>

        {error && (
          <View className="p-3 bg-red-50 border border-red-200 rounded-2xl">
            <ThemedText type="default" className="text-red-700 text-sm">
              {error}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}
