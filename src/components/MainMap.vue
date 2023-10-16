<script lang="ts">
import "leaflet/dist/leaflet.css";
import L, { LatLng } from "leaflet";
import type { Map, GeoJSON, LayersControlEvent } from "leaflet";
</script>

<script setup lang="ts">
import { ref } from "vue";
import {
  LMap,
  LTileLayer,
  LControlAttribution,
} from "@vue-leaflet/vue-leaflet";
import { useMapStore } from "../stores/map";
import { useRoute, useRouter } from "vue-router";
import type { Feature } from "geojson";
import type { MapData, MapSlug, LayerData, MaintainerData } from "../types";
import MaintainersViewerControl from "./MaintainersViewerControl.vue";

const mapStore = useMapStore();
const router = useRouter();
const route = useRoute();

// Used to delay certain actions until after the map has been initialized
const mapInitialized = ref(false);

// get map information from query params
if (typeof route.query.lat == "string" && typeof route.query.lng == "string") {
  mapStore.setLocation(
    new L.LatLng(Number(route.query.lat), Number(route.query.lng)),
  );
}

if (typeof route.query.zoom == "string") {
  mapStore.setZoom(parseInt(route.query.zoom) || mapStore.zoom);
}

let mapsToEnable = new Set<MapSlug>();
if (typeof route.query.maps == "string") {
  mapsToEnable = new Set<MapSlug>(route.query.maps.split(","));
}

async function initializeMap(map: Map) {
  const layersControl = L.control.layers(undefined, undefined, {
    hideSingleBase: true,
    sortLayers: true,
  });

  for (const mapTitle in await mapStore.fetchAvailableMaps()) {
    const mapData = mapStore.availableMaps[mapTitle];

    await addMapLayer(
      map,
      layersControl,
      mapData,
      // Enable a map layer right away if it is listed in the query params
      mapsToEnable.has(mapData.mapSlug),
    );
  }

  layersControl.addTo(map);

  // set callbacks
  map.on("moveend zoomend", function () {
    mapStore.setLocation(map.getCenter());
    mapStore.setZoom(map.getZoom());
    setUrl();
  });

  map.on("overlayadd", async function (e: LayersControlEvent) {
    const mapName = e.name.toString().replace(/ \(.+\)$/, "");
    addMapLayer(map, layersControl, mapStore.availableMaps[mapName], true);
  });

  map.on("overlayremove", async function (e: LayersControlEvent) {
    const mapName = e.name.toString().replace(/ \(.+\)$/, "");
    addMapLayer(map, layersControl, mapStore.availableMaps[mapName], false);
  });

  mapInitialized.value = true;
}

/*
 * This method will either add a temporary empty layer that will be lazy-loaded
 * later, or go ahead with loading depending on the `visible` argument
 */
async function addMapLayer(
  map: Map,
  control: L.Control.Layers,
  mapData: MapData,
  visible: boolean,
) {
  // if layer is already fully loaded, just update the visibility in the store
  const layerData = mapStore.loadedMaps[mapData.mapSlug];
  const maintainerData: MaintainerData = {
    contributionInfo: mapData.contributionInfo,
    maintainedMapTitle: mapData.mapTitle,
    maintainers: mapData.maintainers,
  };

  if (layerData?.loaded) {
    layerData.visible = visible;
    mapStore.addMapLayer(mapData.mapSlug, layerData, maintainerData);
    setUrl();
    return;
  }

  // else, we need to create a new layer
  let layer: GeoJSON;
  if (layerData) {
    layer = layerData.layer;
  } else {
    const options = {
      style: function () {
        return {
          fillColor: mapData.color,
          color: mapData.color,
        };
      },
      pointToLayer: function (_feature: Feature, latlng: LatLng) {
        const markerHtmlStyles = `
          background-color: ${mapData.color};
          width: 2rem;
          height: 2rem;
          display: block;
          left: -1rem;
          top: -1rem;
          position: relative;
          border-radius: 2rem 2rem 0;
          transform: rotate(45deg);
          border: 1px solid #FFFFFFAA`;

        const markerIcon = L.divIcon({
          className: "",
          iconAnchor: [0, 24],
          popupAnchor: [0, -36],
          html: `<span style="${markerHtmlStyles}" />`,
        });

        return L.marker(latlng, { icon: markerIcon });
      },
      onEachFeature: function (feature: Feature, layer: GeoJSON) {
        if (feature && feature.properties) {
          const properties = feature.properties;

          const tooltipString =
            `<div>Map: ${mapData.mapTitle}</div>` +
            Object.keys(properties)
              .filter((key) => key != "OBJECTID" && properties[key])
              .map((key) => {
                const propertyName = toTitleCase(key.toString()).replace(
                  /_/g,
                  " ",
                );
                let propertyValue;
                if (
                  properties[key]?.toString().startsWith("http") ||
                  properties[key]?.toString().startsWith("tel")
                ) {
                  propertyValue = `<a href="${properties[key]}" target="_blank" rel="noreferrer">${properties[key]}</a>`;
                } else {
                  propertyValue = properties[key];
                }

                return `<div>${propertyName}: ${propertyValue}</div>`;
              })
              .join("");

          layer.bindPopup(tooltipString, {});
        }
      },
    };

    layer = L.geoJSON([], options);
    control.addOverlay(layer, `${mapData.mapTitle} (${mapData.color})`);
  }

  const newLayerData: LayerData = { layer, loaded: visible, visible };
  mapStore.addMapLayer(mapData.mapSlug, newLayerData, maintainerData);

  if (visible) {
    mapStore.fetchGeoJson(mapData).then((response) => {
      if (response) {
        layer.addData(response);
      }
    });
    layer.addTo(map);
  }

  setUrl();
}

function setUrl() {
  const slugsList =
    Object.keys(mapStore.loadedMaps)
      .filter((key) => mapStore.loadedMaps[key].visible)
      .join(",") || undefined;

  router.push({
    name: "map",
    query: {
      lat: mapStore.location.lat,
      lng: mapStore.location.lng,
      zoom: mapStore.zoom,
      maps: slugsList,
    },
  });
}

function toTitleCase(string: string) {
  return string.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
</script>

<template>
  <div class="w-full h-full inline-block">
    <l-map
      ref="map"
      :zoom="mapStore.zoom"
      :minZoom="7"
      :maxZoom="20"
      :center="mapStore.locationArray"
      :options="{
        attributionControl: false,
      }"
      @ready="initializeMap"
    >
      <l-control-attribution
        position="bottomright"
        prefix="Brought to you by <a href='https://hackgreenville.com/'>HackGreenville Labs</a>. <a href='https://data.openupstate.org/contribute'>Click here to contribute</a>!"
      />
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
        attribution="© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />
      <MaintainersViewerControl
        v-if="
          mapInitialized &&
          Object.keys(mapStore.maintainersOfActiveLayers).length > 0
        "
      />
    </l-map>
  </div>
</template>
