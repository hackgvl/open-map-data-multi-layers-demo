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
 * Represents a html color name
 */
export type Color = string;

/*
 * A person or organization responsible for contributing data to our
 * platform in some fashion.
 */
export type AttributedEntity = {
  title: string;
  uri: string;
  options: Array<string>;
};

/**
 * A person who has provided features for one of the map layer's data sets.
 */
export type Maintainer = AttributedEntity;

/**
 * Information on where one could access a data set and perhaps edit it.
 */
export type ContributionInformation = AttributedEntity;

/**
 * Represents an object with all the available details for a map
 */
export type MapData = {
  mapSlug: MapSlug;
  mapTitle: MapTitle;
  geoJsonUrl: URL;
  color: Color;
  geoJson?: GeoJSON;
  maintainers: Array<Maintainer>;
  contributionInfo: ContributionInformation;
};

/**
 * Represents the state of a layer in the map
 */
export type LayerData = {
  layer: LGeoJSON;
  loaded: boolean;
  visible: boolean;
};

/**
 * Represents information around who maintains a map and where their data is stored.
 */
export type MaintainerData = {
  maintainedMapTitle: string;
  contributionInfo: ContributionInformation;
  maintainers: Array<Maintainer>;
};
