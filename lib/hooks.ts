import { useFields } from "@/context/fields-context";
import { useState } from "react";
import { Alert } from "react-native";
import { Category, Field } from "./types";

type HandlerProps = {
  mapRef: React.RefObject<any>;
  drawRef: React.RefObject<any>;
  startPointMarkerRef?: React.RefObject<any>;
  setStartPoint?: React.Dispatch<React.SetStateAction<[number, number] | null>>;
};

export const useMapHandlers = ({
  mapRef,
  drawRef,
  startPointMarkerRef,
  setStartPoint,
}: HandlerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalArea, setTotalArea] = useState<number>(0);

  const { fields, setFields } = useFields();

  const addLayers = (
    id: string,
    label: string,
    coordinates: number[][][],
    categories: Category[]
  ) => {
    // For React Native, we'll simulate layer addition
    // In a real implementation, you would work with the map component
    console.log(`Adding layers for field ${id}:`, {
      label,
      coordinates,
      categories,
    });
  };

  const handleReset = () => {
    if (drawRef.current && mapRef.current) {
      // Clear all fields from the map
      console.log("Resetting map and clearing all fields");

      // Clear the directions route if it exists
      const directionsRouteId = "directions-route";
      if (
        mapRef.current.getLayer &&
        mapRef.current.getLayer(directionsRouteId)
      ) {
        mapRef.current.removeLayer(directionsRouteId);
      }
      if (
        mapRef.current.getSource &&
        mapRef.current.getSource(directionsRouteId)
      ) {
        mapRef.current.removeSource(directionsRouteId);
      }

      // Clear the start point marker and state
      if (startPointMarkerRef?.current) {
        startPointMarkerRef.current.remove();
        startPointMarkerRef.current = null;
      }
      if (setStartPoint) {
        setStartPoint(null);
      }

      // Clear all field layers
      fields.forEach((field) => {
        if (mapRef.current?.getLayer && mapRef.current.getLayer(field.id)) {
          mapRef.current.removeLayer(field.id);
        }
        const labelLayerId = `${field.id}-label`;
        if (mapRef.current?.getLayer && mapRef.current.getLayer(labelLayerId)) {
          mapRef.current.removeLayer(labelLayerId);
        }
        const borderLayerId = `${field.id}-border`;
        if (
          mapRef.current?.getLayer &&
          mapRef.current.getLayer(borderLayerId)
        ) {
          mapRef.current.removeLayer(borderLayerId);
        }
        const iconLayerId = `${field.id}-icon`;
        if (mapRef.current?.getLayer && mapRef.current.getLayer(iconLayerId)) {
          mapRef.current.removeLayer(iconLayerId);
        }
      });

      // Clear all field sources
      fields.forEach((field) => {
        if (mapRef.current?.getSource && mapRef.current.getSource(field.id)) {
          mapRef.current.removeSource(field.id);
        }
        const labelLayerId = `${field.id}-label`;
        if (
          mapRef.current?.getSource &&
          mapRef.current.getSource(labelLayerId)
        ) {
          mapRef.current.removeSource(labelLayerId);
        }
        const borderLayerId = `${field.id}-border`;
        if (
          mapRef.current?.getSource &&
          mapRef.current.getSource(borderLayerId)
        ) {
          mapRef.current.removeSource(borderLayerId);
        }
        const iconLayerId = `${field.id}-icon`;
        if (
          mapRef.current?.getSource &&
          mapRef.current.getSource(iconLayerId)
        ) {
          mapRef.current.removeSource(iconLayerId);
        }
      });

      setFields([]);
      setTotalArea(0);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // In a real app, you would make API calls here
      // For now, we'll simulate the save operation
      console.log("Saving fields:", fields);

      const validFields = fields.filter(
        (field) => field && field.id && field.coordinates && field.color
      );

      if (validFields.length === 0) {
        throw new Error("No valid fields to save");
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Alert.alert("Success", "All fields saved successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save fields.";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = async () => {
    try {
      setIsLoading(true);

      // In a real app, you would fetch from API
      // For now, we'll simulate loading existing fields
      console.log("Loading fields from storage");

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock some sample fields for demonstration
      const mockFields: Field[] = [
        {
          id: "field-1",
          color: "#10b981",
          area: 2500,
          label: "North Field",
          coordinates: [
            [
              [24.0036, 38.4504],
              [24.0046, 38.4504],
              [24.0046, 38.4514],
              [24.0036, 38.4514],
              [24.0036, 38.4504],
            ],
          ],
          categories: [{ type: "Wheat" }],
        },
        {
          id: "field-2",
          color: "#3b82f6",
          area: 1800,
          label: "South Field",
          coordinates: [
            [
              [24.0026, 38.4494],
              [24.0036, 38.4494],
              [24.0036, 38.4504],
              [24.0026, 38.4504],
              [24.0026, 38.4494],
            ],
          ],
          categories: [{ type: "Corn" }],
        },
      ];

      handleReset();
      setFields(mockFields);

      // Calculate total area
      const total = mockFields.reduce((sum, field) => sum + field.area, 0);
      setTotalArea(total);

      Alert.alert("Success", `Loaded ${mockFields.length} fields`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load fields.";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldUpdate = async (id: string, updates: Partial<Field>) => {
    try {
      if (!id || !updates || Object.keys(updates).length === 0) {
        throw new Error("Invalid update data");
      }

      setFields((currentFields) =>
        currentFields.map((field) =>
          field.id === id ? { ...field, isUpdating: true } : field
        )
      );

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setFields((currentFields) => {
        const newFields = currentFields.map((field) =>
          field.id === id ? { ...field, ...updates, isUpdating: false } : field
        );

        // Update map visualization if needed
        if (mapRef.current) {
          console.log(`Updating field ${id} on map:`, updates);
        }

        return newFields;
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update field.";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    }
  };

  const handleFieldChanges = async (field: Field, updates: Partial<Field>) => {
    try {
      setIsSaving(true);

      // In a real app, you would make API calls here
      console.log("Saving field changes:", { field, updates });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedField = { ...field, ...updates };
      setFields((currentFields) =>
        currentFields.map((f) => (f.id === field.id ? updatedField : f))
      );

      Alert.alert(
        "Success",
        `Field "${updatedField.label}" updated successfully.`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCategorySelect = (categoryType: string, label: string) => {
    if (drawRef.current) {
      const all = drawRef.current.getAll();
      if (all.features && all.features.length > 0) {
        const fieldId = all.features[all.features.length - 1].id as string;
        setFields((prev) =>
          prev.map((f) =>
            f.id === fieldId
              ? { ...f, label: label, categories: [{ type: categoryType }] }
              : f
          )
        );

        const field = fields.find((f) => f.id === fieldId);
        if (field) {
          addLayers(field.id, label, field.coordinates, [
            { type: categoryType },
          ]);
        }
      }
    }
  };

  return {
    isLoading,
    isSaving,
    error,
    totalArea,
    handleReset,
    handleSave,
    handleLoad,
    handleFieldUpdate,
    handleFieldChanges,
    handleCategorySelect,
  };
};
