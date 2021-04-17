import mapboxgl, { Map } from "maplibre-gl";

type Options = {
  placeIndexResource?: string;
  api: any;
};

class SearchControl {
  options: Options;
  _placeIndexResource?: string;
  _searchAPI?: any;
  _map?: Map;
  _container?: HTMLElement;
  _innerContainer?: HTMLElement;
  _searchButton?: any;
  _searchTextField?: HTMLElement;
  _searchResultsContainer?: HTMLElement;
  _searchResultsList?: HTMLElement;
  _searchResultsClearButton?: HTMLElement;
  _markers?: [any?];

  constructor(options: Options) {
    this.options = options;
    this._searchAPI = options.api;
    this._markers = [];
    this._performSearch = this._performSearch.bind(this);
    this._clearSearchResults = this._clearSearchResults.bind(this);
    this._displayResultOnMap = this._displayResultOnMap.bind(this);
  }

  getDefaultPosition() {
    return "bottom-right";
  }

  onAdd(map: Map) {
    this._map = map;
    this._container = this._createElement("div", "mapboxgl-ctrl");

    this._innerContainer = this._createElement(
      "div",
      "search-container",
      this._container
    );

    this._searchTextField = this._createElement(
      "input",
      "search-text-field",
      this._innerContainer
    );
    this._searchTextField.addEventListener("change", this._performSearch);

    this._searchButton = this._createElement(
      "button",
      "Search-button",
      this._innerContainer
    );
    this._searchButton.addEventListener("click", this._performSearch);
    this._searchButton.title = "Search";
    this._searchButton.innerHTML = "Search";

    this._createSearchResultsContainer();
    return this._container;
  }

  async _performSearch() {
    this._clearSearchResults();
    const searchInput = (this._searchTextField as HTMLInputElement).value;
    const results = (await this._searchAPI.searchForPlaces(searchInput, [
      this._map.getCenter().lng,
      this._map.getCenter().lat,
    ])) as any;
    if (results.Results && results.Results.length > 0) {
      this._searchResultsContainer.classList.remove("hide");

      results.Results.forEach((element: any) => {
        // Mark it all over the map
        this._markers.push(
          new mapboxgl.Marker()
            .setLngLat(element.Place.Geometry.Point)
            .addTo(this._map)
        );

        // Create list of results and render on the map
        const listItem = this._createElement(
          "li",
          "search-result-item",
          this._searchResultsList
        );

        const anchorForListItem = this._createElement(
          "a",
          "search-result-anchor-item",
          listItem
        );
        const _displayResultOnMap = this._displayResultOnMap;
        anchorForListItem.addEventListener("click", function () {
          _displayResultOnMap(element.Place.Geometry.Point);
        });
        anchorForListItem.innerHTML = element.Place.Label;
      });
    }
  }

  onRemove() {
    this._removeElement(this._container);
    this._clearSearchResults();
  }

  _createSearchResultsContainer() {
    this._searchResultsContainer = this._createElement(
      "div",
      "search-results-container",
      this._innerContainer
    );
    this._searchResultsList = this._createElement(
      "ul",
      "search-results-list",
      this._searchResultsContainer
    );
    this._searchResultsClearButton = this._createElement(
      "button",
      "search-results-clear",
      this._searchResultsContainer
    );
    this._searchResultsClearButton.addEventListener(
      "click",
      this._clearSearchResults
    );
    this._searchResultsClearButton.title = "Clear Results";
    this._searchResultsClearButton.innerHTML = "Clear Results";
    this._searchResultsContainer.classList.add("hide");
  }

  _clearSearchResults() {
    this._searchResultsContainer.classList.add("hide");
    while (this._searchResultsList.firstChild) {
      this._searchResultsList.removeChild(this._searchResultsList.firstChild);
    }
    this._markers?.forEach((element) => {
      element.remove();
    });
  }

  _displayResultOnMap(point: any) {
    this._map.flyTo({ center: point, zoom: 10 });
  }

  _createElement(tagName: string, className?: string, container?: HTMLElement) {
    const el = window.document.createElement(tagName);
    if (className !== undefined) el.className = className;
    if (container) container.appendChild(el);
    return el;
  }

  _removeElement(node: HTMLElement) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
}

export default SearchControl;
