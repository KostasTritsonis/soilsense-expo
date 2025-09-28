import Mapbox from "@rnmapbox/maps";

// Set your Mapbox access token here
// You can get a free token from https://account.mapbox.com/access-tokens/
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1Ijoia29zdGFzdHJpIiwiYSI6ImNtNnBmZ3Y2cjE5OTAya3NodGRpc2MwMzgifQ.i1BiNurDcmUx7-HbNIfsjA";

// Initialize Mapbox with the access token
// Only set the token if it's not already set
if (!Mapbox.getAccessToken()) {
  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
}

export { MAPBOX_ACCESS_TOKEN };
