<style lang="scss">
    $list-y: 50px;
    $list-max-height: 140px;
    $map-y: $list-y + $list-max-height;
    $map-z: 50;
    $list-z: $map-z + 10;


    .open-data--control-label {
        font-size:10px;
    }
    .open-data--map-data--item {
        background-color: white;
        border: 0.5px solid gray;
        border-radius: 5px;
        box-sizing: border-box;
        cursor: pointer;
        float: left;
        font-weight: 700;
        list-style-type: none;
        margin: 0 20px 15px 0;
        padding: 10px;
        text-align: center;
        width: 200px;

        &:hover {
            border-radius: 10px;
            box-shadow: 5px 5px;
            //font-size: 18px;
            //text-shadow: 0px 0px 6px rgba(255, 255, 255, 1);
            transition: all 0.4s ease 0s;
        }
    }

    .open-data--name {
        text-overflow: ellipsis;
    }
    .open-data--item-color-sample {
        border-radius: 10px;
        display: inline-block;
        height: 15px;
        margin-left: 15px;
        width: 15px;
    }
    .open-data--map-data--list {
        //border-bottom: 3px solid black;
        max-height: $list-max-height;
        overflow: scroll;
        position: relative;
        //position: absolute;
        top: 34px;
        //top: $list-y;
        transition: max-height 0.5s ease 0s;
        width: 100%;
        z-index: $list-z;
    }

    .open-data--list-container {
        border-bottom: 3px solid black;
        height: 100%;
        position: relative;
        overflow: hidden;
        width: 100%;
        z-index: $list-z - 1;

        &:hover .open-data--map-data--list {
            max-height: 500px;
            transition: all 1s ease 0s;
        }
    }

    .open-data--map-data--map {
        //position: absolute;
        //z-index: $map-z;
    }

    .open-data--utility-control {
        border: 1px solid black;
        float: left;
        margin-right: 10px;
        padding: 10px;

        &.open-data--utility-control__add {
            background-color: green;
        }

        &.open-data--utility-control__remove {
            background-color: red;
        }
    }



    .clearfix {
        clear: both;
    }
</style>
<template>
<div class="open-data--map-data">
    <div class="open-data--utility-control .open-data--utility-control__add" v-on:click="updateMapLocations()">Update locations</div>
    <div class="open-data--utility-control .open-data--utility-control__remove" v-on:click="removeAllMapLayers()">Remove locations</div>
    <div class="clearfix"></div>
    <div class="open-data--list-container">
        <ul class="open-data--map-data--list">
            <li class="open-data--map-data--item" v-on:click="toggleMapLayer(map_category)" v-bind:style="map_category.item_styles" v-bind:key="map_category.name" v-for="(map_category, index) in geoJsonData">
                <!--<span class="open-data--name" v-on:click="addMapLayer(map_category)">{{map_category.name}}</span>, -->
                <span class="open-data--name">{{map_category.name}}</span>
                <!--<span class="open-data--href">{{map_category.href}}</span>-->
                <!--<div class="open-data--item-color-sample" v-bind:style="map_category.color_sample_styles"></div>-->
                <div class="open-data--controls">
                    <input id="remove_map_layer" type="checkbox" v-if="hasMapLayer(map_category)">
                    <!--<label for="apply_map_layer" class="open-data--control-label"  v-on:click="removeMapLayer(map_category)">Remove</label>-->
                </div>
            </li>
        </ul>
    </div>
    <div style="height:500px" id="the_map" class="open-data--map-data--map">

    </div>
</div>
</template>

<script>
    import map_json from '../../data/map_data.json'
    //import L from '../../resources/leaflet-src.js'
//TODO: use https://data.openupstate.org/rest/maps?_format=json
//TODO: investigate CMV.  Does it support geo json?
    map_json.forEach(function(map_category){
        map_category.color_sample_styles = {};
        map_category.item_styles = {};
    });

    function generateRandomHexColor() {
        return '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
    }

    export default {
        data(){
            return {
                geoJsonData: map_json,
            }
        },
        methods: {
            updateMapLocations: function () {
                let L = window.L;
                let map = window.my_map;
                //let final_coordinates;
                let features;
                let map_data = this;

                if (map && L) {
                    this.geoJsonData.forEach(function(map_category, index) {
                        if (map_category.geojson_data.type !== "FeatureCollection") {
                            console.log("diff type", map_category)
                        }
                        map_data.addMapLayer(map_category);
                    });
                    //map.setView(final_coordinates);
                }
            },
            removeAllMapLayers: function () {
                let L = window.L;
                let map = window.my_map;
                let map_data = this;
                if (map && L) {
                    this.geoJsonData.forEach(function(map_category, index) {
                        map_data.removeMapLayer(map_category);
                    });
                    //map.setView(final_coordinates);
                }

            },
            toggleMapLayer: function(map_category) {
                let map = window.my_map;
                if (map_category.layer && map.hasLayer(map_category.layer)) {
                    this.removeMapLayer(map_category);
                } else {
                    this.addMapLayer(map_category);
                }
            },
            //Add a GeoJson map layer to the map.  If the layer was already created, will reuse the old layer.
            addMapLayer: function(map_category) {
                let geo_json = map_category.geojson_data;
                let map = window.my_map;
                let L = window.L;
                if (map_category.layer && !map.hasLayer(map_category)) {
                    let marker_color = this.setMapCategoryColor(map_category, map_category.marker_color);
                    map.addLayer(map_category.layer);
                }
                else if (map_category.layer == undefined) {
                    let map_layer;
                    //Re-use same color if set
                    let marker_color = this.setMapCategoryColor(map_category, map_category.marker_color);
                    map_category.marker_color = marker_color;

                    map_layer = L.geoJSON(geo_json, {
                        pointToLayer: function(feature, coords) {
                            return L.circleMarker(coords, {
                                fillColor:      marker_color,
                                stroke:         false,
                                fillOpacity:    0.7,
                            });
                        }
                    }).bindPopup(function(layer){
                        let popup_html = document.createElement("span").innerHTML = layer.feature.properties.title || "meh";
                        return popup_html;
                    }).addTo(map);
                    map_category.layer = map_layer;
                }
            },
            //Set the color of the category, return the color value in case we created a new one
            setMapCategoryColor: function (map_category, color) {
                //Make color optional, generate a new one if unset
                if (!color) {
                    color = generateRandomHexColor();
                }

                if (color==="rm") {
                    map_category.color_sample_styles.backgroundColor = null;
                    map_category.item_styles.backgroundColor = null;
                }
                else {
//                  map_category.color_sample_styles.backgroundColor = color;
//                  map_category.item_styles.backgroundColor = color;

                    map_category.color_sample_styles = {
                        backgroundColor:    color
                    };
                    map_category.item_styles = {
                        backgroundColor:    color,
                    };
                }
                /*
                console.log("setting color", color)
                map_category.color_sample_styles.backgroundColor = color;
                map_category.item_styles.backgroundColor = color;
                console.log("item styles", map_category.item_styles)
                console.log("marker styles", map_category.color_sample_styles)
                */
                return color;
            },
            hasMapLayer: function(map_category) {
                let map = window.my_map;
                return map_category.layer && map.hasLayer(map_category);
            },
            removeMapLayer: function(map_category) {
                let map = window.my_map;
                if (map_category.layer && map.hasLayer(map_category.layer)) {
                    map.removeLayer(map_category.layer);
                    this.setMapCategoryColor(map_category, "rm");
                }
            }
        },
        updated: function () {

        },
        name: "mapData",
    };
</script>