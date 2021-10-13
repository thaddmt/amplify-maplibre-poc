// Existing Amplify Library
import Amplify from "aws-amplify";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import awsconfig from "./aws-exports";

// https://github.com/aws-amplify/maplibre-gl-js-amplify
import {
  AmplifyMapLibreRequest,
  drawPoints,
  AmplifyGeocoderAPI,
  createMap,
  createDefaultIcon,
  createAmplifyGeocoder,
  // drawLine,
} from "maplibre-gl-js-amplify";
import "maplibre-gl-js-amplify/dist/public/amplify-geocoder.css";

// https://github.com/maplibre/maplibre-gl-geocoder
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";

// Maplibre
import maplibregl, { Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
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
      const map = await AmplifyMapLibreRequest.createMapLibreMap({
        container: "map",
        center: [-122.431297, 37.773972],
        zoom: 11,
        region: "us-west-2",
        maplibreMap: Map,
      });

      const geocoder = createAmplifyGeocoder({});
      map.addControl(geocoder);
      geocoder.on("error", (error) => {
        console.log(error);
      });

      map.on("load", function () {
        drawPoints(
          "myPointData",
          [
            [-122.483696, 37.833818],
            [-122.483482, 37.833174],
            [-122.483396, 37.8327],
            [-122.483568, 37.832056],
            [-122.48404, 37.831141],
            [-122.48404, 37.830497],
            [-122.483482, 37.82992],
            [-122.483568, 37.829548],
            [-122.48507, 37.829446],
            [-122.4861, 37.828802],
            [-122.486958, 37.82931],
            [-122.487001, 37.830802],
            [-122.487516, 37.831683],
            [-122.488031, 37.832158],
            [-122.488889, 37.832971],
            [-122.489876, 37.832632],
            [-122.490434, 37.832937],
            [-122.49125, 37.832429],
            [-122.491636, 37.832564],
            [-122.492237, 37.833378],
            [-122.493782, 37.833683],
          ],
          map,
          {
            showCluster: true,
            unclusteredOptions: {
              showMarkerPopup: true,
            },
          }
        );
      });

      map.on("load", (e) => {
        const coords = [
          [-122.483696, 37.833818],
          [-122.483482, 37.833174],
          [-122.483396, 37.8327],
          [-122.483568, 37.832056],
          [-122.48404, 37.831141],
          [-122.48404, 37.830497],
          [-122.483482, 37.82992],
          [-122.483568, 37.829548],
          [-122.48507, 37.829446],
          [-122.4861, 37.828802],
          [-122.486958, 37.82931],
          [-122.487001, 37.830802],
          [-122.487516, 37.831683],
          [-122.488031, 37.832158],
          [-122.488889, 37.832971],
          [-122.489876, 37.832632],
          [-122.490434, 37.832937],
          [-122.49125, 37.832429],
          [-122.491636, 37.832564],
          [-122.492237, 37.833378],
          [-122.493782, 37.833683],
        ];

        // drawLine("line-source", coords, map);
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
