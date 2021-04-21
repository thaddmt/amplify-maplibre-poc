// Existing Amplify Library
import Amplify, { Auth } from "aws-amplify";
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from "./aws-exports";

// New MapLibre Plugin
import SearchControl from "./MapLibrePlugin/SearchControl";
import MapBoxRequest from "./MapLibrePlugin/MapBoxRequest";
import GeofenceControl from "./MapLibrePlugin/GeofenceControl";

// New Amplify Plugin
import { Geo } from "./AmplifyGeoPlugin/AmplifyGeo";

// Maplibre
import { Map, NavigationControl } from "maplibre-gl";
import "./App.css";

// Customers initialize Amplify
Amplify.configure(awsconfig);

// Customers initialize Maplibre Map
async function initializeMap() {
  // actually initialize the map
  const map = new Map({
    container: "map",
    center: [-123.1187, 49.2819], // initial map center point
    zoom: 13, // initial map zoom
    style: "test-maps-1",
    transformRequest: new MapBoxRequest(await Auth.currentCredentials())
      .transformRequest,
  });

  map.addControl(new NavigationControl(), "top-left");

  // Customers ass new controls provided by new MapLibre Plugin
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
  return map;
}

// Adding device locations (and history) is not provided through controls. Customers
// get the positions from Amplify and add to their MapLibre map.
async function displayDevicePositions(deviceId, devicePositions, map, color) {
  var positions = [];
  devicePositions.forEach((element) => {
    positions.push(element.Position);
  });
  map.on("load", function () {
    map.addSource(deviceId, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            properties: {},
            type: "Feature",
            geometry: {
              type: "MultiLineString",
              coordinates: [positions],
            },
          },
        ],
      },
    });
    map.addLayer({
      id: deviceId + "layer",
      source: deviceId,
      type: "line",
      paint: {
        "line-color": color,
        "line-width": 3,
      },
    });
  });
}

function App() {
  initializeMap().then(async (map) => {
    // Display device histories for device 1 and device2
    var results = await Geo.getDevicePositionHistory(
      "device1",
      "test-tracker-1"
    );
    displayDevicePositions("device1", results.DevicePositions, map, "red");
    results = await Geo.getDevicePositionHistory("device2", "test-tracker-1");
    displayDevicePositions("device2", results.DevicePositions, map, "blue");

    // Update device locations using double click for device 1
    // and shift double click for device 2
    map.doubleClickZoom.disable();
    map.on("dblclick", function (e) {
      Geo.updateDevicePosition(
        e.originalEvent.shiftKey ? "device2" : "device1",
        [e.lngLat.lng, e.lngLat.lat],
        "test-tracker-1"
      );
    });
  });

  // Customers can listen to the breach notifications for a particular tracker and geofence collection.
  Geo.subscribeToGeofenceEvents();
  return (
    <AmplifyAuthenticator>
      <div id="map" />
    </AmplifyAuthenticator>
  );
}

export default App;
