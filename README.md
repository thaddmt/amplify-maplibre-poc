# Getting Started

## Until these packages are published to npm...

```
git clone git@github.com:maplibre/maplibre-gl-geocoder.git
yarn link

-- Go to amazon-location-service-poc-amplify
yarn link "maplibre-gl-geocoder
```

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

Note: You need aws-exports.js file in the source directory created through amplify-cli.

### Simulating device location updates

- Update `App.js` line 19,20 to create new devices.
- Double click anywhere on the map to send that point coordinates as device location for device 1
- Shift + Double click anywhere on the map to send that point coordinates as device location for device 2

### Geofence breach updates

- The app comes with default three geofences showed on the bottom left. Click on any to zoom on the map.
- Use device location simulation to place the device inside the geofence to trigger a geofence event.
- Geofence events are shown on the web console.

### Reverse geocoding

Command + click anywhere in the map to show the address of that location.

### Search for POIs and addresses.

Type search text on the top-left search bar and click on one of the results to show on the map.
