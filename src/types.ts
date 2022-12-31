import type { GeoJSON as LGeoJSON } from "leaflet";
import type { GeoJSON } from "geojson";

/**
 * Represents the user facing title for a map
 */
export type MapTitle = string;

/**
 * Represents the field slug assigned to a map
 */
export type MapSlug = string;

/**
 * Represents an object with all the available details for a map
 */
export type MapData = {
  mapSlug: MapSlug;
  mapTitle: MapTitle;
  geoJsonUrl: URL;
  geoJson?: GeoJSON;
};

/**
 * Represents the state of a layer in the map
 */
export type LayerData = {
  layer: LGeoJSON;
  loaded: boolean;
  visible: boolean;
};
