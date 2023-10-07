import { defineStore } from "pinia";
import type { GeoJSON } from "geojson";
import type { MapSlug, MapTitle, MapData, LayerData } from "../types";
import type { LatLng } from "leaflet";

export const useMapStore = defineStore("map", {
  state: () => ({
    zoom: 10,
    location: { lat: 34.844526, lng: -82.401078 } as LatLng,
    loadedMaps: {} as { [mapSlug: MapSlug]: LayerData },
    availableMaps: {} as { [mapTitle: MapTitle]: MapData },
  }),
  getters: {
    locationArray({ location: { lat, lng } }) {
      return [lat, lng];
    },
  },
  actions: {
    setLocation(coords: LatLng) {
      this.location = coords;
    },
    setZoom(zoom: number) {
      this.zoom = zoom;
    },
    addMapLayer(mapSlug: MapSlug, layerData: LayerData) {
      this.loadedMaps[mapSlug] = layerData;
    },
    removeMapLayer(mapSlug: MapSlug) {
      delete this.loadedMaps[mapSlug];
    },
    async fetchGeoJson({ mapTitle }: MapData) {
      const mapData = this.availableMaps[mapTitle];
      if (!mapData.geoJson) {
        await fetch(mapData.geoJsonUrl)
          .then((response) => response.json() as unknown as GeoJSON)
          .then((response) => {
            this.availableMaps[mapData.mapTitle].geoJson = response;
          })
          .catch((error) => {
            console.error(
              `error while fetching ${mapData.mapSlug} geoJson from ${mapData.geoJsonUrl}`,
              error
            );
            Promise.reject();
          });
      }

      return this.availableMaps[mapTitle].geoJson;
    },
    async fetchAvailableMaps() {
      if (Object.keys(this.availableMaps).length == 0) {
        await fetch(`${process.env.DATA_API_BASE_URL}/rest/maps?_format=json`)
          .then((response) => response.json())
          .then((data) => {
            data
              .filter(
                (mapData: any) =>
                  mapData?.field_slug?.[0]?.value &&
                  mapData?.field_geojson_link?.[0]?.uri &&
                  mapData?.title?.[0]?.value
              )
              .map(async (mapDataJson: any) => {
                const geoJsonUrl = new URL(
                  mapDataJson.field_geojson_link[0].uri
                    .toString()
                    .replace("internal:", process.env.DATA_API_BASE_URL)
                );

                const mapData = {
                  mapSlug: mapDataJson.field_slug[0].value,
                  mapTitle: mapDataJson.title[0].value,
                  geoJsonUrl: geoJsonUrl,
                  color: getRandomColor(mapDataJson.field_slug[0].value),
                };

                this.availableMaps[mapData.mapTitle] = mapData;
              });
          })
          .catch((error) => {
            console.error("error fetching list of available maps", error);
            Promise.reject();
          });
      }

      return this.availableMaps;
    },
  },
});

// Uses the title for a hash, so it'll return the same color for the same title
// every time
function getRandomColor(title: String) {
  const colors = [
    "aqua",
    "black",
    "blue",
    "fuchsia",
    "green",
    "lime",
    "maroon",
    "navy",
    "olive",
    "purple",
    "red",
    "teal",
    "yellow",
  ];

  return colors[
    Math.floor(Math.abs(Math.sin(simpleHash(title))) * colors.length)
  ];
}

function simpleHash(s: String) {
  let h = 0;
  for (let i = 0; i < s.length; h &= h) h = 31 * h + s.charCodeAt(i++);
  return h;
}
