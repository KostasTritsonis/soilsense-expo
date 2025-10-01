// Map configuration for react-native-maps
// No special configuration needed for react-native-maps
// It uses the default map providers (Google Maps on Android, Apple Maps on iOS)

export const MAP_CONFIG = {
  // Default region (San Francisco)
  defaultRegion: {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  // Map type options
  mapTypes: {
    standard: "standard",
    satellite: "satellite",
    hybrid: "hybrid",
    terrain: "terrain",
  },
};
