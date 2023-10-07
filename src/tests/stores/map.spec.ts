import { describe, it, expect, beforeEach, expectTypeOf } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useMapStore } from "../../stores/map";
import L from "leaflet";
import type { GeoJSON } from "geojson";
import type { MapData, LayerData } from "../../types";
import type { LatLng } from "leaflet";

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
      `${process.env.DATA_API_BASE_URL}/map/geojson/breweries/`
    );
  });

  it("fetches data for a map", async () => {
    const mapStore = useMapStore();
    expect(mapStore.availableMaps).toStrictEqual({});
    await mapStore.fetchAvailableMaps();
    const mapData = mapStore.availableMaps["Breweries"];

    const fetchResult = await mapStore.fetchGeoJson(mapData);
    expect(mapStore.availableMaps["Breweries"].geoJson).toStrictEqual(
      fetchResult
    );
    expectTypeOf(fetchResult).toMatchTypeOf<GeoJSON | undefined>();
  });

  it("adds a map layer", async () => {
    const mapStore = useMapStore();
    expect(mapStore.loadedMaps).toStrictEqual({});
    const layerData: LayerData = {
      layer: L.geoJSON([]),
      loaded: false,
      visible: false,
    };
    mapStore.addMapLayer("my-cool-slug", layerData);
    expect(mapStore.loadedMaps["my-cool-slug"]).toStrictEqual(layerData);
  });

  it("removes a map layer", async () => {
    const mapStore = useMapStore();
    const layerData: LayerData = {
      layer: L.geoJSON([]),
      loaded: false,
      visible: false,
    };
    mapStore.loadedMaps["my-cool-slug"] = layerData;
    mapStore.removeMapLayer("my-cool-slug");
    expect(mapStore.loadedMaps).toStrictEqual({});
  });
});
