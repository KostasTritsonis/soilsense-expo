import { RouteInfo } from "./types";

// Helper function to convert coordinates
function toCoordinates(
  lngLat:
    | [number, number]
    | { lng: number; lat: number }
    | { lon: number; lat: number }
): [number, number] {
  if (Array.isArray(lngLat)) {
    return lngLat as [number, number];
  }
  if ("lng" in lngLat && "lat" in lngLat) {
    return [lngLat.lng, lngLat.lat];
  }
  if ("lon" in lngLat && "lat" in lngLat) {
    return [lngLat.lon, lngLat.lat];
  }
  throw new Error("Invalid coordinate object");
}

interface GeoJSONGeometry {
  type: string;
  coordinates: number[][];
}

interface MapboxStep {
  maneuver: {
    type: string;
    instruction: string;
    bearing_after: number;
    bearing_before: number;
  };
  distance: number;
  duration: number;
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${remainingMinutes} min`;
}

export async function getDirections(
  start:
    | [number, number]
    | { lng: number; lat: number }
    | { lon: number; lat: number },
  end:
    | [number, number]
    | { lng: number; lat: number }
    | { lon: number; lat: number }
): Promise<RouteInfo> {
  const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn("Mapbox access token is not set - using mock directions");
    return getMockDirections(start, end);
  }

  const startCoords = toCoordinates(start);
  const endCoords = toCoordinates(end);

  // Enhanced URL to get detailed route information
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&steps=true&overview=full&access_token=${accessToken}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== "Ok") {
      throw new Error(data.message || "Error fetching directions.");
    }

    const route = data.routes[0];
    const leg = route.legs[0];

    return {
      geometry: route.geometry as GeoJSONGeometry,
      distance: leg.distance,
      duration: leg.duration,
      distanceText: formatDistance(leg.distance),
      durationText: formatDuration(leg.duration),
      steps: leg.steps.map((step: MapboxStep) => ({
        instruction: step.maneuver.instruction,
        distance: step.distance,
        duration: step.duration,
        maneuver: {
          type: step.maneuver.type,
          instruction: step.maneuver.instruction,
          bearing_after: step.maneuver.bearing_after,
          bearing_before: step.maneuver.bearing_before,
        },
      })),
    };
  } catch (error) {
    console.error("Error fetching directions:", error);
    // Return mock directions as fallback
    return getMockDirections(start, end);
  }
}

// Mock directions for development/testing
function getMockDirections(
  start:
    | [number, number]
    | { lng: number; lat: number }
    | { lon: number; lat: number },
  end:
    | [number, number]
    | { lng: number; lat: number }
    | { lon: number; lat: number }
): RouteInfo {
  const startCoords = toCoordinates(start);
  const endCoords = toCoordinates(end);

  // Calculate approximate distance (simplified)
  const distance =
    Math.sqrt(
      Math.pow(endCoords[0] - startCoords[0], 2) +
        Math.pow(endCoords[1] - startCoords[1], 2)
    ) * 111000; // Rough conversion to meters

  const duration = (distance / 1000) * 60; // Rough estimate: 1km per minute

  return {
    geometry: {
      type: "LineString",
      coordinates: [startCoords, endCoords],
    },
    distance: distance,
    duration: duration,
    distanceText: formatDistance(distance),
    durationText: formatDuration(duration),
    steps: [
      {
        instruction: "Head toward destination",
        distance: distance,
        duration: duration,
        maneuver: {
          type: "depart",
          instruction: "Head toward destination",
          bearing_after: 0,
          bearing_before: 0,
        },
      },
      {
        instruction: "Arrive at destination",
        distance: 0,
        duration: 0,
        maneuver: {
          type: "arrive",
          instruction: "Arrive at destination",
          bearing_after: 0,
          bearing_before: 0,
        },
      },
    ],
  };
}

// Legacy function for backward compatibility
export async function getDirectionsGeometry(
  start:
    | [number, number]
    | { lng: number; lat: number }
    | { lon: number; lat: number },
  end:
    | [number, number]
    | { lng: number; lat: number }
    | { lon: number; lat: number }
) {
  const routeInfo = await getDirections(start, end);
  return routeInfo.geometry;
}
