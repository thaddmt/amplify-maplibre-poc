import { LngLatBounds, Map } from "maplibre-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

type Options = {
  geofenceCollectionResource?: string;
  allowCreationOfGeofence?: boolean;
  api: any;
};

class GeofenceControl {
  options: Options;
  _placeIndexResource?: string;
  _geofenceAPI?: any;
  _map?: Map;
  _container?: HTMLElement;
  _innerContainer?: HTMLElement;
  _geoFenceContainer?: HTMLElement;
  _geofenceResultsList?: HTMLElement;
  _geofenceCreateButton?: HTMLElement;
  _mapBoxDraw?: MapboxDraw = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
      polygon: true,
      trash: true,
    },
    defaultMode: "draw_polygon",
  });
  _geofences?: [any?];

  constructor(options: Options) {
    this.options = options;
    this._geofenceAPI = options.api;
    this._geofences = [];
    this._createGeofence = this._createGeofence.bind(this);
    this._createElement = this._createElement.bind(this);
    this._displayResultOnMap = this._displayResultOnMap.bind(this);
  }

  getDefaultPosition() {
    return "bottom-left";
  }

  onAdd(map: Map) {
    this._map = map;
    this._container = this._createElement("div", "mapboxgl-ctrl");

    this._innerContainer = this._createElement(
      "div",
      "search-container",
      this._container
    );

    this._createGeofenceContainer();
    this._loadAllGeofences();

    return this._container;
  }

  async _loadAllGeofences() {
    const results = (await this._geofenceAPI.listGeofences(
      "test-geofence-collection-1"
    )) as any;

    // Make this class methods available in `_drawGeofences`
    const _drawGeofences = this._drawGeofences;
    const _map = this._map;
    const _createElement = this._createElement;
    const _geofenceResultsList = this._geofenceResultsList;
    this._map.on("load", function () {
      _drawGeofences(results, _map, _createElement, _geofenceResultsList);
    });
  }

  _drawGeofences(
    geofences: any,
    map: Map,
    _createElement: any,
    _geofenceResultsList: any
  ) {
    geofences.Entries.forEach((geofence: any) => {
      console.log("Drawing " + geofence.GeofenceId);
      map.addSource(geofence.GeofenceId, {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: geofence.Geometry.Polygon,
          },
          properties: {},
        },
      });

      // Add a new layer to visualize the polygon.
      map.addLayer({
        id: geofence.GeofenceId + "layer",
        type: "fill",
        source: geofence.GeofenceId, // reference the data source
        layout: {},
        paint: {
          "fill-color": "#0080ff", // blue color fill
          "fill-opacity": 0.5,
        },
      });

      // Add a black outline around the polygon.
      map.addLayer({
        id: geofence.GeofenceId,
        type: "line",
        source: geofence.GeofenceId,
        layout: {},
        paint: {
          "line-color": "#000",
          "line-width": 1,
        },
      });

      // Create list of results and render on the map
      const listItem = _createElement(
        "li",
        "geofence-result-item",
        _geofenceResultsList
      );
      const anchorForListItem = _createElement(
        "a",
        "geofence-result-anchor-item",
        listItem
      );
      anchorForListItem.addEventListener("click", function () {
        var bounds = new LngLatBounds();
        geofence.Geometry.Polygon[0].forEach((bound: any) => {
          bounds.extend(bound);
        });
        map.fitBounds(bounds, { padding: 100 });
      });
      anchorForListItem.innerHTML = geofence.GeofenceId;
    });
  }

  onRemove() {
    this._removeElement(this._container);
  }

  _createGeofenceContainer() {
    this._geoFenceContainer = this._createElement(
      "div",
      "geofence-container",
      this._innerContainer
    );
    this._geofenceResultsList = this._createElement(
      "ul",
      "geofence-results-list",
      this._geoFenceContainer
    );
    this._geofenceCreateButton = this._createElement(
      "button",
      "geofence-create-button",
      this._geoFenceContainer
    );
    this._geofenceCreateButton.addEventListener("click", this._createGeofence);
    this._geofenceCreateButton.title = "Create Geofence";
    this._geofenceCreateButton.innerHTML = "Create Geofence";
    // this._geoFenceContainer.classList.add("hide");
  }

  _displayResultOnMap(point: any) {
    this._map.flyTo({ center: point, zoom: 13 });
  }

  _createElement(tagName: string, className?: string, container?: HTMLElement) {
    const el = window.document.createElement(tagName);
    if (className !== undefined) el.className = className;
    if (container) container.appendChild(el);
    return el;
  }

  _createGeofence() {
    this._map.addControl(this._mapBoxDraw, "bottom-left");
    this._map.on("draw.create", () => {
      console.log(
        "Drew a polygon " +
          (this._mapBoxDraw.getAll().features[0].geometry as any).coordinates
      );
    });
  }

  _removeElement(node: HTMLElement) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
}

export default GeofenceControl;
