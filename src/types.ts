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
 * Represents raw JSON data
 */
export type MapJson = {
  nid: Array<{ value: number }>;
  uuid: Array<{ value: string }>;
  vid: Array<{ value: number }>;
  langcode: Array<{ value: string }>;
  type: Array<{
    target_id: string;
    target_type: string;
    target_uuid: string;
  }>;
  revision_timestamp: Array<{
    value: string;
    format: string;
  }>;
  revision_uid: Array<{
    target_id: number;
    target_type: string;
    target_uuid: string;
    url: string;
  }>;
  revision_log: Array<object>;
  status: Array<{ value: boolean }>;
  uid: Array<{
    target_id: number;
    target_type: string;
    target_uuid: string;
    url: string;
  }>;
  title: Array<{ value: string }>;
  created: Array<{ value: string; format: string }>;
  changed: Array<{ value: string; format: string }>;
  promote: Array<{ value: boolean }>;
  sticky: Array<{ value: boolean }>;
  default_langcode: Array<{ value: boolean }>;
  revision_translation_affected: Array<{ value: boolean }>;
  metatag: Array<{
    value: {
      title: string;
      description: string;
      referrer: string;
    };
  }>;
  path: Array<{
    alias: string;
    pid: number;
    langcode: string;
  }>;
  body: Array<object>;
  field_center_point_latitude: Array<{ value: number }>;
  field_center_point_longitude: Array<{ value: number }>;
  field_contribute_link: Array<{
    uri: string;
    title: string;
    options: Array<object>;
  }>;
  field_geojson_link: Array<{
    uri: string;
    title: string;
    options: Array<object>;
  }>;
  field_maintainers: Array<{
    uri: string;
    title: string;
    options: Array<object>;
  }>;
  field_map_preview_link: Array<{
    uri: string;
    title: string;
    options: Array<object>;
  }>;
  field_map_tags: Array<object>;
  field_meta_tags: Array<{ value: Array<object> }>;
  field_raw_data_link: Array<{
    uri: string;
    title: string;
    options: Array<object>;
  }>;
  field_slug: Array<{ value: string }>;
  field_zoom_level: Array<{ value: number }>;
};

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
