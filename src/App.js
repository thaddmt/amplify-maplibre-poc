// Existing Amplify Library
import Amplify, { Auth } from "aws-amplify";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import awsconfig from "./aws-exports";

// https://github.com/aws-amplify/maplibre-gl-js-amplify
import { AmplifyMapLibreRequest, drawPoints } from "maplibre-gl-js-amplify";

// https://github.com/maplibre/maplibre-gl-geocoder
import MaplibreGeocoder from "@maplibre/maplibre-gl-geocoder";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";

// Maplibre
import maplibregl, { Map } from "maplibre-gl";
import "./App.css";
import { useEffect, useState } from "react";
import { Geo } from "@aws-amplify/geo";

// Customers initialize Amplify
Amplify.configure(awsconfig);

function App() {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();
  const [map, setMap] = useState();

  // Amplify auth updates. Resetting map on sign out.
  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
      if (nextAuthState === "signedout") {
        setMap(null);
      }
    });
  }, []);

  // When user signs in, initialize the map and add controls.
  useEffect(() => {
    async function initializeMap() {
      const credentials = await Auth.currentCredentials();

      const defaultMap = Geo.getDefaultMap();

      // actually initialize the map
      const map = new Map({
        container: "map",
        center: [-123.1187, 49.2819],
        zoom: 13,
        style: defaultMap.mapName,
        transformRequest: new AmplifyMapLibreRequest(credentials, "us-west-2")
          .transformRequest,
      });
      setMap(map);

      // Create a Geo API from the Location service apis
      // This can be turned into a plugin so or wrapped around MaplibreGeocoder specifically for interfacing with amplify
      // This will be moved to a plugin for geocoder
      const geocoderApi = {
        forwardGeocode: async (config) => {
          const data = await Geo.searchByText(config.query, {
            biasPosition: config.proximity,
          });
          const features = data.map((result) => {
            const { geometry, ...otherResults } = result;
            return {
              type: "Feature",
              geometry: { type: "Point", coordinates: geometry.point },
              properties: { ...otherResults },
              place_name: otherResults.label,
              text: otherResults.label,
              center: geometry.point,
            };
          });
          return { features };
        },
        reverseGeocode: async (config) => {
          const data = await Geo.searchByCoordinates(config.query);
          const { geometry, ...otherResults } = data;
          const feature = {
            type: "Feature",
            geometry: { type: "Point", coordinates: geometry.point },
            properties: { ...otherResults },
            place_name: otherResults.label,
            text: otherResults.label,
            center: geometry.point,
          };
          return { features: [feature] };
        },
      };

      const geocoder = new MaplibreGeocoder(geocoderApi, {
        maplibregl: maplibregl,
        showResultMarkers: true,
        popup: true,
        reverseGeocode: true,
      });
      map.addControl(geocoder);
      geocoder.on("error", (error) => {
        console.log(error);
      });

      // Render some coordinates on the map using the drawPoints method
      map.on("load", function () {
        drawPoints(
          "foobar",
          [
            [-123.1187, 49.2819],
            [-122.849, 49.1913],
          ],
          map,
          {
            showCluster: true,
            unclusteredOptions: {
              showMarkerPopup: true,
              popupBackgroundColor: "red",
              popupFontColor: "purple",
            },
            clusterOptions: {
              showCount: true,
            },
          },
          defaultMap.style
        );
      });
    }

    if (!map && authState === AuthState.SignedIn && user) {
      initializeMap();
    }
  }, [authState, user, map]);

  return authState === AuthState.SignedIn && user ? (
    <div className="App">
      <AmplifySignOut />
      <div id="map" />
    </div>
  ) : (
    <AmplifyAuthenticator />
  );
}

export default App;
