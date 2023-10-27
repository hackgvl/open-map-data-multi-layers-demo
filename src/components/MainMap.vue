<script lang="ts">
import "leaflet/dist/leaflet.css";
import L, { LatLng } from "leaflet";
import type { Map, GeoJSON, LayersControlEvent } from "leaflet";
import { createMarker, setTooltips } from "@/utils/map";
</script>

<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
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
    const layerData = mapStore.loadedMaps[mapData.mapSlug];

    // If the layerData is already present, then it is leftover from a previous
    // visit to this page.
    if (layerData) {
      addLayerToOverlay(
        layersControl,
        layerData.layer,
        mapData.mapTitle,
        mapData.color,
      );
    }

    await addMapLayer(
      map,
      layersControl,
      mapData,
      // Enable a map layer right away if it is listed in the query params
      mapsToEnable.has(mapData.mapSlug),
      true,
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
    addMapLayer(
      map,
      layersControl,
      mapStore.availableMaps[mapName],
      true,
      false,
    );
  });

  map.on("overlayremove", async function (e: LayersControlEvent) {
    const mapName = e.name.toString().replace(/ \(.+\)$/, "");
    addMapLayer(
      map,
      layersControl,
      mapStore.availableMaps[mapName],
      false,
      false,
    );
  });

  mapInitialized.value = true;
}

async function addLayerToOverlay(
  layersControl: L.Control.Layers,
  layer: L.GeoJSON,
  mapTitle: string,
  color: string,
) {
  layersControl.addOverlay(layer, `${mapTitle} (${color})`);
}

/*
 * Ensures layers are populated with GeoJSON data and added to the map
 */
function initializeLayerData(map: Map, mapData: MapData, layerData: LayerData) {
  const featureCollection = mapStore.availableMaps[mapData.mapTitle]?.geoJson;

  // If the data isn't already available then perform an external request to
  // obtain it.
  if (featureCollection) {
    layerData.layer.addData(featureCollection);
  } else {
    mapStore.fetchGeoJson(mapData).then((response) => {
      if (response) {
        layerData.layer.addData(response);
      }
    });
  }

  layerData.layer.addTo(map);
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
  initializingMap: boolean,
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

    // If the map is being reloaded, but the store hasn't been cleared
    // (ex: user went to the About page and then came back)
    // then we need to reinitialize the layer by adding back in the
    // GeoJSON feature collection to it and then adding the layer to the map.
    if (initializingMap) {
      initializeLayerData(map, mapData, layerData);
    }

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
      pointToLayer: (_feature: Feature, latlng: LatLng) =>
        createMarker(mapData.color, latlng),
      onEachFeature: (feature: Feature, layer: GeoJSON) =>
        setTooltips(mapData.mapTitle, feature, layer),
    };

    layer = L.geoJSON([], options);
    control.addOverlay(layer, `${mapData.mapTitle} (${mapData.color})`);
  }

  const newLayerData: LayerData = { layer, loaded: visible, visible };
  mapStore.addMapLayer(mapData.mapSlug, newLayerData, maintainerData);

  if (visible) {
    initializeLayerData(map, mapData, newLayerData);
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

onBeforeUnmount(() => mapStore.clearLayerData());
</script>

<template>
  <div class="w-full h-full inline-block">
    <l-map
      ref="map"
      :zoom="mapStore.zoom"
      :minZoom="7"
      :maxZoom="18"
      :center="mapStore.locationArray"
      :options="{
        attributionControl: false,
      }"
      @ready="initializeMap"
    >
      <l-control-attribution
        position="bottomright"
        prefix="Brought to you by <a href='https://hackgreenville.com/' target='_blank'>HackGreenville Labs</a>"
      />
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
        attribution="© <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a> contributors"
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
