import { useFields } from "@/context/fields-context";
import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { MapSetupReturn, MapboxMapRef } from "./types";

export const MapSetup = (): MapSetupReturn => {
  const mapContainer = useRef<any>(null);
  const mapRef = useRef<MapboxMapRef>(null);
  const drawRef = useRef<any>(null);
  const [lng] = useState<number>(24.0036);
  const [lat] = useState<number>(38.4504);
  const [zoom] = useState<number>(15);
  const [selectedColor, setSelectedColor] = useState<string>("#FF0000");
  const [fieldArea, setFieldArea] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedColorRef = useRef<string>(selectedColor);
  const initialLngRef = useRef<number>(lng);
  const initialLatRef = useRef<number>(lat);

  const { setFields } = useFields();
  const setFieldsRef = useRef(setFields);

  // Store initial coordinates and setFields in refs to avoid dependency changes
  useEffect(() => {
    initialLngRef.current = lng;
    initialLatRef.current = lat;
    setFieldsRef.current = setFields;
  }, [lng, lat, setFields]);

  // Update the ref whenever selectedColor changes
  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  // Initialize map for React Native with Mapbox
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    console.log("Initializing Mapbox map for React Native");

    // Mapbox map is initialized through the MapView component
    // This effect is mainly for setting up event handlers and initial state
    mapRef.current = {
      // Mapbox MapView ref methods
      getCenter: () => ({ lng: lng, lat: lat }),
      getZoom: () => zoom,
      // Add other Mapbox-specific methods as needed
    } as any;

    // Set up field creation simulation (for demo purposes)
    const createFieldInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        // 5% chance every interval
        const fieldId = `field-${Date.now()}`;
        const mockArea = Math.random() * 1000 + 500;
        const mockCoordinates = [
          [
            [lng, lat],
            [lng + 0.001, lat],
            [lng + 0.001, lat + 0.001],
            [lng, lat + 0.001],
            [lng, lat],
          ],
        ];

        setFieldsRef.current((prev) => [
          ...prev,
          {
            id: fieldId,
            color: selectedColorRef.current,
            area: mockArea,
            coordinates: mockCoordinates,
            label: "",
            categories: [],
          },
        ]);

        setFieldArea(mockArea);
        setIsModalOpen(true);

        Alert.alert("Field Created", "A new field has been created!");
      }
    }, 10000);

    return () => {
      clearInterval(createFieldInterval);
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, [lat, lng, zoom]);

  return {
    mapContainer,
    mapRef,
    drawRef,
    lng,
    lat,
    zoom,
    selectedColor,
    fieldArea,
    isModalOpen,
    setSelectedColor,
    setIsModalOpen,
  };
};
