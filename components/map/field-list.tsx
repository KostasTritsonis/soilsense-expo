import { useFieldsStore } from "@/lib/stores/fields-store";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

type FieldListProps = {
  onFieldSelect: (fieldId: string) => void;
  selectedFieldId: string | null;
  onEditField: (fieldId: string) => void;
};

export default function FieldList({
  onFieldSelect,
  selectedFieldId,
  onEditField,
}: FieldListProps) {
  const { fields, deleteField } = useFieldsStore();

  const handleDeleteField = async (fieldId: string) => {
    const result = await deleteField(fieldId);

    if (!result.success) {
      console.error("Failed to delete field:", result.error);
      // TODO: Show error message to user
    }
  };

  return (
    <View className="w-full">
      {fields.length === 0 ? (
        <View className="items-center py-8">
          <View className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-3">
            <MaterialIcons name="place" size={24} color="#9ca3af" />
          </View>
          <ThemedText
            type="defaultSemiBold"
            className="text-neutral-500 font-medium"
          >
            No fields created yet
          </ThemedText>
          <ThemedText type="default" className="text-sm text-neutral-400">
            Create your first field to get started
          </ThemedText>
        </View>
      ) : (
        <View className="space-y-3">
          {fields.map((field) => (
            <TouchableOpacity
              key={field.id}
              onPress={() => onFieldSelect(field.id)}
              className={`p-4 rounded-2xl transition-all duration-200 ${
                selectedFieldId === field.id
                  ? "bg-primary-100 border-2 border-primary-200 shadow-md"
                  : "bg-white/80 border border-white/60"
              }`}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: field.color }}
                />
                <ThemedText
                  type="defaultSemiBold"
                  className={`text-sm font-semibold truncate flex-1 ${
                    selectedFieldId === field.id
                      ? "text-primary-900"
                      : "text-neutral-900"
                  }`}
                >
                  {field.label || "Unnamed Field"}
                </ThemedText>
                <TouchableOpacity
                  className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0"
                  onPress={() => handleDeleteField(field.id)}
                >
                  <MaterialIcons name="close" size={12} color="#dc2626" />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center gap-4 mt-3">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="straighten" size={12} color="#6b7280" />
                  <ThemedText
                    type="default"
                    className="text-xs text-neutral-600"
                  >
                    {(field.area || 0).toFixed(2)} m²
                  </ThemedText>
                </View>
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="place" size={12} color="#6b7280" />
                  <ThemedText
                    type="default"
                    className="text-xs text-neutral-600"
                  >
                    {field.categories?.[0]?.type || "Uncategorized"}
                  </ThemedText>
                </View>
              </View>

              <TouchableOpacity
                className={`absolute top-4 right-12 w-6 h-6 flex items-center justify-center rounded-lg ${
                  selectedFieldId === field.id
                    ? "bg-primary-200"
                    : "bg-neutral-100"
                }`}
                onPress={() => onEditField(field.id)}
              >
                <MaterialIcons
                  name="edit"
                  size={12}
                  color={selectedFieldId === field.id ? "#7c3aed" : "#6b7280"}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
