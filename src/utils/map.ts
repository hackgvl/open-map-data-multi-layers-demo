import L, { LatLng } from "leaflet";
import type { Feature } from "geojson";
import type { GeoJSON } from "leaflet";

export function createMarker(color: string, latlng: LatLng) {
  const markerHtmlStyles = `
    background-color: ${color};
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
}

export function setTooltips(
  mapTitle: string,
  feature: Feature,
  layer: GeoJSON,
) {
  if (feature && feature.properties) {
    const properties = feature.properties;

    const tooltipString =
      `<div>Map: ${mapTitle}</div>` +
      Object.keys(properties)
        .filter((key) => key != "OBJECTID" && properties[key])
        .map((key) => {
          const propertyName = toTitleCase(key.toString()).replace(/_/g, " ");
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
}

function toTitleCase(string: string) {
  return string.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
