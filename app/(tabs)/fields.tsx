import MapComponent from "@/components/map/map";
import { useFieldsStore } from "@/lib/stores/fields-store";
import { Field } from "@/lib/types";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FieldsScreen() {
  const { fields, isLoading, addField } = useFieldsStore();

  const handleFieldPress = (field: Field) => {
    Alert.alert(
      field.label,
      `Area: ${field.area} hectares\nCrops: ${field.categories?.map((cat) => cat.type).join(", ") || "None"}`,
      [{ text: "OK" }]
    );
  };

  const FieldCard = ({ field }: { field: Field }) => (
    <TouchableOpacity
      className="bg-white p-4 rounded-xl mb-3 shadow-sm"
      onPress={() => handleFieldPress(field)}
    >
      <View className="flex-row items-center mb-2">
        <View
          className="w-4 h-4 rounded-full mr-3"
          style={{ backgroundColor: field.color }}
        />
        <Text className="text-lg font-semibold text-soil-900 flex-1">
          {field.label}
        </Text>
      </View>
      <Text className="text-base text-soil-600 mb-2">
        {field.area} hectares
      </Text>
      {field.categories && field.categories.length > 0 && (
        <View className="mb-2">
          <Text className="text-sm text-soil-600 font-medium">Crops:</Text>
          <Text className="text-sm text-soil-900 mt-1">
            {field.categories.map((cat) => cat.type).join(", ")}
          </Text>
        </View>
      )}
      <View className="border-t border-soil-200 pt-2">
        <Text className="text-xs text-soil-400">
          Coordinates: {field.coordinates[0]?.length || 0} points
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-earth-50">
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="py-6 items-center">
          <Text className="text-3xl font-bold text-soil-900 mb-2">
            Field Management
          </Text>
          <Text className="text-base text-soil-600 text-center">
            Manage your agricultural fields
          </Text>
        </View>

        {/* Add Field Button */}
        <TouchableOpacity
          className="bg-primary-500 py-3 px-6 rounded-xl mb-6 items-center"
          onPress={async () => {
            const newField: Field = {
              id: `field-${Date.now()}`,
              color: "#22c55e",
              area: 1.0,
              label: "New Field",
              coordinates: [
                [
                  [37.7749, -122.4194],
                  [37.7849, -122.4094],
                  [37.7849, -122.4294],
                  [37.7749, -122.4194],
                ],
              ],
              categories: [{ type: "Wheat" }],
            };

            const result = await addField(newField);
            if (result.success) {
              Alert.alert("Success", "Field created successfully!");
            } else {
              Alert.alert("Error", result.error || "Failed to create field");
            }
          }}
        >
          <Text className="text-white text-base font-semibold">
            + Add New Field
          </Text>
        </TouchableOpacity>

        {/* Fields List */}
        <View className="mb-6">
          {isLoading ? (
            <View className="bg-white p-8 rounded-xl items-center shadow-sm">
              <Text className="text-lg font-semibold text-soil-900 mb-2">
                Loading Fields...
              </Text>
              <Text className="text-sm text-soil-600 text-center">
                Please wait while we load your fields
              </Text>
            </View>
          ) : fields.length === 0 ? (
            <View className="bg-white p-8 rounded-xl items-center shadow-sm">
              <Text className="text-lg font-semibold text-soil-900 mb-2">
                No Fields Yet
              </Text>
              <Text className="text-sm text-soil-600 text-center">
                Add your first field to start managing your agricultural
                operations
              </Text>
            </View>
          ) : (
            fields.map((field) => <FieldCard key={field.id} field={field} />)
          )}
        </View>

        {/* Map Component */}
        <View className="bg-white rounded-xl mb-6 shadow-sm overflow-hidden">
          <Text className="text-lg font-semibold text-soil-900 p-4 pb-2">
            Field Map
          </Text>
          <Text className="text-sm text-soil-600 px-4 pb-4">
            Interactive field management
          </Text>
          <View className="h-96">
            <MapComponent />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
