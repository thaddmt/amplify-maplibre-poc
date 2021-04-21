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
import { useEffect } from "react";

const device1 = "device3",
  device2 = "device4";

// Customers initialize Amplify
Amplify.configure(awsconfig);

// Customers initialize Maplibre Map
async function initializeMap() {
  console.log("0");
  const credentials = await Auth.currentCredentials();
  console.log("1");
  // actually initialize the map
  const map = new Map({
    container: "map",
    center: [-123.1187, 49.2819],
    zoom: 13,
    style: "test-maps-1",
    transformRequest: new MapBoxRequest(credentials)
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

// Possible addition to Geo.getDevicePositionHistory
function generateDevicePositionsData(positions) {
  return {
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
  };
}

function App() {
  var device1Positions = [],
    device2Positions = [];

  useEffect(() => {
    initializeMap().then((map) => {
      // Display device histories for device 1 and device2
      getAndDisplayDeviceHistories(map, device1Positions, device2Positions);

      // "SIMULATION OF UPDATING DEVICE LOCATION"
      // Update device locations using double click for device 1
      // and shift double click for device 2
      map.doubleClickZoom.disable();
      map.on("dblclick", function (e) {
        Geo.updateDevicePosition(
          e.originalEvent.shiftKey ? device2 : device1,
          [e.lngLat.lng, e.lngLat.lat],
          "test-tracker-1"
        );
        console.log(e);
        if (e.originalEvent.shiftKey) {
          device2Positions.push([e.lngLat.lng, e.lngLat.lat]);
          map
            .getSource(device2)
            .setData(generateDevicePositionsData(device2Positions));
        } else {
          device1Positions.push([e.lngLat.lng, e.lngLat.lat]);
          map
            .getSource(device1)
            .setData(generateDevicePositionsData(device1Positions));
        }
      });
    });

    // Customers can listen to the breach notifications for a particular tracker and geofence collection.
    const subscription = Geo.subscribeToGeofenceEvents().subscribe({
      next: (value) => {
        if (value.breach && value.breach.DeviceId) {
          const breach = value.breach;
          console.log(
            breach.DeviceId +
            " breached " +
            breach.GeofenceId +
            " on " +
            breach.Time +
            " at " +
            breach.Position
          );
        }
      },
      error: (error) => console.warn(error),
    });

    return () => subscription.unsubscribe();
  }, []);
  return (
    <AmplifyAuthenticator>
      <div id="map" />
    </AmplifyAuthenticator>
  );
}

// Adding device locations (and history) is not provided through controls. Customers
// get the positions from Amplify and add to their MapLibre map.
async function displayDevicePositionsDataOnMap(deviceId, data, map, color) {
  map.on("load", function () {
    map.addSource(deviceId, {
      type: "geojson",
      data: data,
    });
    map.addLayer({
      id: deviceId + "layer",
      source: deviceId,
      type: "line",
      paint: {
        "line-color": color || "black",
        "line-width": 3,
      },
    });
  });
}

async function getAndDisplayDeviceHistories(
  map,
  device1Positions,
  device2Positions
) {
  (
    await Geo.getDevicePositionHistory(device1, "test-tracker-1")
  ).DevicePositions.forEach((element) => {
    device1Positions.push(element.Position);
  });
  displayDevicePositionsDataOnMap(
    device1,
    generateDevicePositionsData(device1Positions),
    map,
    "red"
  );
  (
    await Geo.getDevicePositionHistory(device2, "test-tracker-1")
  ).DevicePositions.forEach((element) => {
    device2Positions.push(element.Position);
  });
  displayDevicePositionsDataOnMap(
    device2,
    generateDevicePositionsData(device2Positions),
    map,
    "blue"
  );
}

export default App;
