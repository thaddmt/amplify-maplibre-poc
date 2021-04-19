import Amplify, { Auth } from "aws-amplify";
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";

// New MapLibre Plugin
import SearchControl from "./MapLibrePlugin/SearchControl";
import MapBoxRequest from "./MapLibrePlugin/MapBoxRequest";
import GeofenceControl from "./MapLibrePlugin/GeofenceControl";

// New Amplify Plugin
import { Geo } from "./AmplifyGeoPlugin/AmplifyGeo";
import { Map, NavigationControl } from "maplibre-gl";
import "./App.css";

Amplify.configure(awsconfig);

async function initializeMap() {
  // actually initialize the map
  const map = new Map({
    container: "map",
    center: [-123.1187, 49.2819], // initial map center point
    zoom: 10, // initial map zoom
    style: "test-maps-1",
    transformRequest: new MapBoxRequest(await Auth.currentCredentials())
      .transformRequest,
  });

  map.addControl(new NavigationControl(), "top-left");
  map.addControl(
    new SearchControl({ placeIndexResource: "test-places-1", api: Geo }),
    "top-right"
  );
  map.addControl(
    new GeofenceControl({
      geofenceCollectionResource: "test-geofence-collection-1",
      api: Geo,
    }),
    "bottom-left"
  );
}

function App() {
  initializeMap();
  Geo.subscribeToGeofenceEvents();
  return (
    <AmplifyAuthenticator>
      <div id="map" />
    </AmplifyAuthenticator>
  );
}

export default App;
