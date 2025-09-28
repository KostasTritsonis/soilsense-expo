export type Field = {
  id: string;
  color: string;
  area: number;
  label: string;
  isUpdating?: boolean;
  coordinates: number[][][];
  authorId?: string;
  categories?: Category[];
};

export type Category = {
  id?: string;
  type: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export type WeatherApiResponse = {
  coord: {
    lat: number;
    lon: number;
  };
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  rain?: {
    "1h": number;
  };
  dt: number;
  name: string;
};

export type ForecastApiResponse = {
  list: {
    dt: number;
    main: {
      temp_min: number;
      temp_max: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    pop: number; // Probability of precipitation
  }[];
};

export type CurrentWeather = {
  temperature: string;
  humidity: string;
  windSpeed: string;
  forecast: string;
  rainfall: string;
  location: string;
  lastUpdated: string;
  icon: string;
};

export type ForecastDay = {
  date: string;
  day: string;
  high: string;
  low: string;
  forecast: string;
  rainChance: string;
  icon: string;
};

export type JobStatus = "Completed" | "Due" | "Ongoing";

export type Job = {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  startDate: Date;
  endDate: Date;
  location?: string | null;
  assignedToId?: string | null;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
};

export type JobFormData = {
  title: string;
  description: string;
  status: JobStatus;
  startDate: Date;
  endDate: Date;
  location?: string;
  assignedToId?: string;
};

export type WeatherAlert = {
  id: string;
  type: "warning" | "info" | "danger";
  message: string;
  severity: "low" | "medium" | "high";
};

// Route and Directions types
export interface RouteInfo {
  geometry: GeoJSONGeometry;
  distance: number; // in meters
  duration: number; // in seconds
  distanceText: string; // formatted distance (e.g., "2.5 km")
  durationText: string; // formatted duration (e.g., "15 min")
  steps: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  maneuver: {
    type: string;
    instruction: string;
    bearing_after: number;
    bearing_before: number;
  };
}

interface GeoJSONGeometry {
  type: string;
  coordinates: number[][];
}

// Map creation types
export interface MapSetupReturn {
  mapContainer: React.RefObject<any>;
  mapRef: React.RefObject<any>;
  drawRef: React.RefObject<any>;
  lng: number;
  lat: number;
  zoom: number;
  selectedColor: string;
  fieldArea: number;
  isModalOpen: boolean;
  setSelectedColor: (color: string) => void;
  setIsModalOpen: (open: boolean) => void;
}

// Mapbox specific types
export interface MapboxMapRef {
  getCenter: () => { lng: number; lat: number };
  getZoom: () => number;
  flyTo: (coordinates: [number, number], zoomLevel?: number) => void;
  setCamera: (camera: MapboxCamera) => void;
}

export interface MapboxCamera {
  centerCoordinate?: [number, number];
  zoomLevel?: number;
  pitch?: number;
  heading?: number;
  animationMode?: "flyTo" | "easeTo" | "linearTo";
  animationDuration?: number;
}

export interface MapboxStyle {
  styleURL?: string;
  styleJSON?: any;
}

export interface MapboxUserLocation {
  visible?: boolean;
  showsUserHeadingIndicator?: boolean;
  androidRenderMode?: "normal" | "compass" | "gps";
  iosShowsUserHeadingIndicator?: boolean;
}
