import { useFieldsStore } from "@/lib/stores/fields-store";
import { Field } from "@/lib/types";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import CategoryModal from "./category-modal";
import DirectionsPanel from "./directions-panel";
import FieldAnnotation from "./field-annotation";
import FieldEditor from "./field-editor";
import FieldInfoPanel from "./field-info-panel";
import MapControls from "./map-controls";
import MapView from "./map-view";

export default function MapComponent() {
  const { fields, updateField } = useFieldsStore();
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routeInfo, setRouteInfo] = useState<any>(null);
  const [showDirectionsPanel, setShowDirectionsPanel] = useState(false);
  const [isGettingDirections, setIsGettingDirections] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleFieldSelect = (field: Field) => {
    setSelectedField(field);
    setIsSidebarOpen(false);
  };

  const handleDeselect = () => {
    setSelectedField(null);
  };

  const handleEditField = (fieldId: string) => {
    setEditingFieldId(fieldId);
  };

  const handleFieldUpdate = async (id: string, updates: Partial<Field>) => {
    const result = await updateField(id, updates);

    if (!result.success) {
      console.error("Failed to update field:", result.error);
      // TODO: Show error message to user
    }
  };

  const handleFieldChanges = async (field: Field, updates: Partial<Field>) => {
    const result = await updateField(field.id, updates);

    if (result.success) {
      setEditingFieldId(null);
    } else {
      console.error("Failed to save field changes:", result.error);
      // TODO: Show error message to user
    }
  };

  const handleCategorySelect = (category: string, label: string) => {
    // TODO: Implement category selection logic
    console.log("Category selected:", category, label);
  };

  const handleReset = () => {
    // Note: We don't clear fields from the store as they come from the API
    // This should only reset the UI state
    setSelectedField(null);
    setEditingFieldId(null);
    // TODO: Implement map reset logic
  };

  const handleSave = () => {
    setIsSaving(true);
    // TODO: Implement save logic
    setTimeout(() => {
      setIsSaving(false);
    }, 2000);
  };

  const handleLoad = () => {
    setIsLoading(true);
    // TODO: Implement load logic
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleGetDirections = async (field: Field) => {
    setIsGettingDirections(true);
    // TODO: Implement directions logic
    setTimeout(() => {
      setIsGettingDirections(false);
      setShowDirectionsPanel(true);
    }, 2000);
  };

  return (
    <View className="flex-1 bg-neutral-100">
      {/* Mobile header */}
      <View className="flex-row items-center justify-between p-4 bg-white/95 border-b border-neutral-200">
        <ThemedText
          type="defaultSemiBold"
          className="text-xl font-bold text-primary-700"
        >
          Field Manager
        </ThemedText>
        <TouchableOpacity
          onPress={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-primary-600 p-2 rounded-xl shadow-sm"
        >
          <MaterialIcons
            name={isSidebarOpen ? "close" : "menu"}
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Main content with map */}
      <View className="flex-1 relative">
        {/* Map */}
        <MapView
          className="flex-1"
          initialRegion={{
            latitude: 37.7749,
            longitude: -122.4194,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* Field annotations */}
          {fields.map((field) => (
            <FieldAnnotation
              key={field.id}
              field={field}
              onPress={handleFieldSelect}
            />
          ))}
        </MapView>

        {/* Sidebar */}
        {isSidebarOpen && (
          <View className="absolute top-0 left-0 w-80 h-full bg-white/95 shadow-lg border-r border-white/60 z-50">
            <ScrollView className="flex-1">
              {/* Sidebar header */}
              <View className="p-4 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-blue-50">
                <ThemedText
                  type="defaultSemiBold"
                  className="text-lg font-semibold text-primary-700"
                >
                  Menu
                </ThemedText>
              </View>

              {/* Controls section */}
              <View className="p-4">
                <MapControls
                  onReset={handleReset}
                  onSave={handleSave}
                  onLoad={handleLoad}
                  isLoading={isLoading}
                  isSaving={isSaving}
                  hasFields={fields.length > 0}
                />
              </View>

              {/* Fields list */}
              <View className="flex-1 px-4 pb-4">
                <ThemedText
                  type="defaultSemiBold"
                  className="text-lg font-semibold text-neutral-900 mb-4"
                >
                  Fields
                </ThemedText>
                <ScrollView
                  className="flex-1"
                  showsVerticalScrollIndicator={false}
                >
                  <View className="space-y-3">
                    {fields.map((field) => (
                      <TouchableOpacity
                        key={field.id}
                        onPress={() => handleFieldSelect(field)}
                        className={`p-4 rounded-2xl border ${
                          selectedField?.id === field.id
                            ? "border-primary-500 bg-primary-50"
                            : "border-neutral-200 bg-white"
                        }`}
                      >
                        <View className="flex-row items-center gap-3">
                          <View
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: field.color }}
                          />
                          <View className="flex-1">
                            <ThemedText
                              type="defaultSemiBold"
                              className="text-sm font-semibold text-neutral-900"
                            >
                              {field.label || "Unnamed Field"}
                            </ThemedText>
                            <ThemedText
                              type="default"
                              className="text-xs text-neutral-600"
                            >
                              {(field.area || 0).toFixed(2)} m²
                            </ThemedText>
                          </View>
                          <TouchableOpacity
                            onPress={() => handleEditField(field.id)}
                            className="w-6 h-6 bg-neutral-100 rounded-lg flex items-center justify-center"
                          >
                            <MaterialIcons
                              name="edit"
                              size={12}
                              color="#6b7280"
                            />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        )}

        {/* Field Info Panel */}
        {selectedField && (
          <FieldInfoPanel
            selectedField={selectedField}
            onGetDirections={handleGetDirections}
            onDeselect={handleDeselect}
            isLoading={isGettingDirections}
            hasCustomStartPoint={false}
          />
        )}

        {/* Field Editor */}
        {editingFieldId && (
          <FieldEditor
            field={fields.find((f) => f.id === editingFieldId) || null}
            onUpdate={handleFieldUpdate}
            onSave={handleFieldChanges}
            onClose={() => setEditingFieldId(null)}
            isVisible={!!editingFieldId}
          />
        )}

        {/* Category Modal */}
        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleCategorySelect}
        />

        {/* Directions Panel */}
        {showDirectionsPanel && routeInfo && (
          <DirectionsPanel
            routeInfo={routeInfo}
            onClose={() => {
              setShowDirectionsPanel(false);
              setRouteInfo(null);
            }}
            startPoint={null}
            destination={selectedField?.label || "Field"}
          />
        )}
      </View>
    </View>
  );
}
