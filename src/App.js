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
import { Geo } from "./AmplifyGeoPlugin/AmplifyGeo";

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

      // actually initialize the map
      const map = new Map({
        container: "map",
        center: [-123.1187, 49.2819],
        zoom: 13,
        style: "test-maps-1",
        transformRequest: new AmplifyMapLibreRequest(credentials, "us-west-2")
          .transformRequest,
      });
      setMap(map);

      // Create a Geo API from the Location service apis
      // This can be turned into a plugin so or wrapped around MaplibreGeocoder specifically for interfacing with amplify
      const geo = {
        forwardGeocode: async (config) => {
          const data = await Geo.searchForPlaces(
            config.query,
            config.proximity
          );

          const features = data.Results.map((result) => {
            const { Geometry, ...otherResults } = result.Place;
            return {
              type: "Feature",
              properties: { ...otherResults },
              geometry: { type: "Point", coordinates: Geometry.Point },
              place_name: otherResults.Label,
              text: otherResults.Label,
              center: Geometry.Point,
            };
          });
          return { features };
        },
        reverseGeocode: async (config) => {
          const data = await Geo.searchForCoordinates(config.query);
          const features = data.Results.map((result) => {
            const { Geometry, ...otherResults } = result.Place;
            return {
              type: "Feature",
              properties: { ...otherResults },
              geometry: { type: "Point", coordinates: Geometry.Point },
              place_name: otherResults.Label,
              text: otherResults.Label,
              center: Geometry.Point,
            };
          });
          return { features };
        },
      };

      const geocoder = new MaplibreGeocoder(geo, {
        maplibregl: maplibregl,
        showResultMarkers: true,
        popup: true,
        reverseGeocode: true,
      });
      map.addControl(geocoder);

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
          "VectorEsriNavigation"
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
