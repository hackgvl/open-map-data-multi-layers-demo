import { describe, it, expect, beforeEach, expectTypeOf } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useMapStore } from "../../stores/map";
import { sampleMaintainerData } from "../data/maintainers";
import L from "leaflet";
import type { GeoJSON } from "geojson";
import type { MapData, LayerData } from "../../types";
import type { LatLng } from "leaflet";

const fakeMapSlug = "my-cool-slug";

describe("mapStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("sets the location", () => {
    const mapStore = useMapStore();
    expect(mapStore.location.lat).toBe(34.844526);
    expect(mapStore.location.lng).toBe(-82.401078);
    mapStore.setLocation({ lat: 88.888, lng: 99.999 } as LatLng);
    expect(mapStore.location.lat).toBe(88.888);
    expect(mapStore.location.lng).toBe(99.999);
  });

  it("returns location as an array", () => {
    const mapStore = useMapStore();
    expect(mapStore.locationArray).toStrictEqual([34.844526, -82.401078]);
    mapStore.location = { lat: 88.888, lng: 99.999 } as LatLng;
    expect(mapStore.locationArray).toStrictEqual([88.888, 99.999]);
  });

  it("sets the zoom", () => {
    const mapStore = useMapStore();
    expect(mapStore.zoom).toBe(10);
    mapStore.setZoom(5);
    expect(mapStore.zoom).toBe(5);
  });

  it("fetches available maps", async () => {
    const mapStore = useMapStore();
    expect(mapStore.availableMaps).toStrictEqual({});
    const fetchResult = await mapStore.fetchAvailableMaps();
    expect(mapStore.availableMaps).toStrictEqual(fetchResult);
    expect(Object.keys(fetchResult).length).toBeGreaterThan(1);

    // all MapDatas are valid
    for (const key in fetchResult) {
      expectTypeOf(fetchResult[key]).toMatchTypeOf<MapData>();
      expectTypeOf(fetchResult[key].mapSlug).toBeString();
      expectTypeOf(fetchResult[key].mapTitle).toBeString();
      expect(fetchResult[key].mapTitle).toBe(key);
      expectTypeOf(fetchResult[key].geoJsonUrl).toMatchTypeOf<URL>();

      // does not fetch data for map
      expect(fetchResult[key].geoJson).toBeUndefined();
    }

    // fetches a known good map
    expect(fetchResult["Breweries"]).toBeDefined();
    expect(fetchResult["Breweries"].mapTitle).toBe("Breweries");
    expect(fetchResult["Breweries"].mapSlug).toBe("breweries");
    expect(fetchResult["Breweries"].geoJsonUrl.toString()).toBe(
      `${process.env.DATA_API_BASE_URL}/map/geojson/breweries/`,
    );
  });

  it("fetches data for a map", async () => {
    const mapStore = useMapStore();
    expect(mapStore.availableMaps).toStrictEqual({});
    await mapStore.fetchAvailableMaps();
    const mapData = mapStore.availableMaps["Breweries"];

    const fetchResult = await mapStore.fetchGeoJson(mapData);
    expect(mapStore.availableMaps["Breweries"].geoJson).toStrictEqual(
      fetchResult,
    );
    expectTypeOf(fetchResult).toMatchTypeOf<GeoJSON | undefined>();
  });

  it("adds a map layer, but since it's not visible the maintainer provided is ignored", async () => {
    const mapStore = useMapStore();
    expect(mapStore.loadedMaps).toStrictEqual({});
    const layerData: LayerData = {
      layer: L.geoJSON([]),
      loaded: false,
      visible: false,
    };

    mapStore.addMapLayer(fakeMapSlug, layerData, sampleMaintainerData);
    expect(mapStore.loadedMaps[fakeMapSlug]).toStrictEqual(layerData);
    expect(mapStore.maintainersOfActiveLayers).toStrictEqual({});
  });

  it("adds a visible map layer, so the maintainer data is persisted too", async () => {
    const mapStore = useMapStore();
    expect(mapStore.loadedMaps).toStrictEqual({});
    const layerData: LayerData = {
      layer: L.geoJSON([]),
      loaded: true,
      visible: true,
    };

    mapStore.addMapLayer(fakeMapSlug, layerData, sampleMaintainerData);
    expect(mapStore.loadedMaps[fakeMapSlug]).toStrictEqual(layerData);
    expect(Object.keys(mapStore.maintainersOfActiveLayers).length).toBe(1);
    expect(mapStore.maintainersOfActiveLayers[fakeMapSlug]).toStrictEqual(
      sampleMaintainerData,
    );
  });

  it("whenever a layer is made invisible the maintainer is removed from maintainersOfActiveLayers", async () => {
    const mapStore = useMapStore();
    expect(mapStore.loadedMaps).toStrictEqual({});
    const visibleLayerData: LayerData = {
      layer: L.geoJSON([]),
      loaded: true,
      visible: true,
    };

    const invisibleLayerData: LayerData = {
      layer: L.geoJSON([]),
      loaded: false,
      visible: false,
    };

    // Add the layer as VISIBLE - the maintainer will be added to mapStore.maintainersOfActiveLayers
    mapStore.addMapLayer(fakeMapSlug, visibleLayerData, sampleMaintainerData);
    expect(mapStore.maintainersOfActiveLayers[fakeMapSlug]).toStrictEqual(
      sampleMaintainerData,
    );

    // Set the layer to be INVISIBLE, thus removing the maintainer from the active list
    mapStore.addMapLayer(fakeMapSlug, invisibleLayerData, sampleMaintainerData);
    expect(Object.keys(mapStore.maintainersOfActiveLayers).length).toBe(0);
  });

  it("removes a map layer", async () => {
    const mapStore = useMapStore();
    const layerData: LayerData = {
      layer: L.geoJSON([]),
      loaded: false,
      visible: false,
    };
    mapStore.loadedMaps[fakeMapSlug] = layerData;
    mapStore.removeMapLayer(fakeMapSlug);
    expect(mapStore.loadedMaps).toStrictEqual({});
  });

  describe("clearLayerData", () => {
    it("clears feature collection and retains options from previous copy of layer", async () => {
      const featureCollection: GeoJSON.FeatureCollection<any> = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [0, 0],
            },
            properties: {},
          },
        ],
      };

      const mapStore = useMapStore();
      const layerData: LayerData = {
        layer: L.geoJSON(featureCollection, {
          style: () => ({
            fillColor: "test",
            color: "test",
          }),
        }),
        loaded: false,
        visible: false,
      };

      mapStore.addMapLayer(fakeMapSlug, layerData, sampleMaintainerData);

      const beforeKeyCount = Object.keys(
        mapStore.loadedMaps[fakeMapSlug].layer,
      ).length;

      await mapStore.clearLayerData();

      const afterKeyCount = Object.keys(
        mapStore.loadedMaps[fakeMapSlug].layer,
      ).length;

      expect(beforeKeyCount).toBeGreaterThan(afterKeyCount);

      expect(typeof layerData.layer.options.style).toEqual("function");

      if (typeof layerData.layer.options.style == "function") {
        expect(JSON.stringify(layerData.layer.options.style())).toEqual(
          JSON.stringify({
            fillColor: "test",
            color: "test",
          }),
        );
      }
    });
  });
});
