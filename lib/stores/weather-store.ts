import { create } from "zustand";

interface WeatherLocation {
  lat: number;
  lon: number;
  name: string;
}

interface WeatherState {
  // State
  currentLocation: WeatherLocation;

  // Actions
  setCurrentLocation: (location: WeatherLocation) => void;
  updateLocation: (lat: number, lon: number, name: string) => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  // Initial state
  currentLocation: {
    lat: 38.4504,
    lon: 24.0036,
    name: "Athens, Greece",
  },

  // Actions
  setCurrentLocation: (location) => set({ currentLocation: location }),

  updateLocation: (lat, lon, name) =>
    set({
      currentLocation: {
        lat,
        lon,
        name,
      },
    }),
}));
