<template>
<div class="open-data--map-data">
    <div class="open-data--map-data--map-container">
        <div id="the_map" class="open-data--map-data--map">
        </div>
    </div>
    <div class="open-data--utility-control-container">
        <div class="open-data--utility-control-panel" id="utility_control_panel">
            <div class="open-data--utility-control open-data--utility-control__add" v-on:click="initializeMap()">Refresh</div>
            <div class="open-data--utility-control open-data--utility-control__add" v-on:click="updateMapLocations()">Update locations</div>
            <div class="open-data--utility-control open-data--utility-control__remove" v-on:click="removeAllMapLayers()">Remove locations</div>
            <div class="clearfix"></div>
            <div class="open-data--utility-control-toggle" id="utility_control_panel_toggle"><div class="open-data--utility-control-toggle-arrow" v-on:click="toggleUtilityControls()">Toggle Controls</div></div>
        </div>
        <!--<div class="open-data--utility-control-toggle"><div class="open-data--utility-control-toggle-arrow" v-on:click="toggleUtilityControls()">V</div></div>-->
    </div>
    <div class="open-data--map-data--category-container" v-if="!map_only">
        <div class="open-data--selected-items">
            <div class="open-data--selected-item"
                v-bind:style="selected_map_category.item_styles || {}"
                v-on:click="toggleMapLayer(selected_map_category)"
                v-bind:key="selected_map_category.id"
                v-for="(selected_map_category, index) in selectedGeoJsonData"
            >
                {{selected_map_category.name}}
            </div>
        </div>
        <input type="textbox" class="open-data--map-data--filter-input" v-model="filterTerm" v-on:keyup="filterMapCategories()" placeholder="Filter options here..." id="map_data_filter_input"/>
        <div class="open-data--list-container">
            <ul class="open-data--map-data--list">
                <li class="open-data--map-data--item"
                    v-on:mouseout="highlightMapCategory(map_category,false)"
                    v-on:mouseover="highlightMapCategory(map_category,true)"
                    v-on:click="handleCategoryClick(map_category)"
                    v-bind:style="map_category.item_styles"
                    v-bind:key="map_category.name"
                    v-for="(map_category, index) in filteredGeoJsonData"
                >
                    <span class="open-data--name">{{map_category.name}}</span>
                    <div class="open-data--controls">
                        <input id="remove_map_layer" type="checkbox" v-if="hasMapLayer(map_category)">
                    </div>
                </li>
            </ul>
        </div>
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

    //TODO: stop using globals globals.
    window.map_json = map_json;

    function generateRandomHexColor() {
        return '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
    }

    let mapCategoryCounter = 0;
    const CATEGORY_MARKER_CLASS_SUFFIX = "_marker";
    const DEFAULT_MARKER_OUTLINE = 1;
    const HIGHLIGHTED_MARKER_OUTLINE = 4;
    const DOUBLE_CLICK_TIME = 400;

    export default {
        props: {
            preselected_maps: {
                type: Array,
                default: null,
            },
            map_only: {
                type: Boolean,
                default: false,
            }
        },
        data(){
            return {
                geoJsonData: map_json,
                filteredGeoJsonData: map_json,
                selectedGeoJsonData: {},
                filterTerm: "",
                hoveredMapCategory: null,
            }
        },
        methods: {
            highlightMapCategory: function (map_category, highlight) {
                let markers = document.querySelectorAll("." + map_category.marker_class)
                let stroke_width = DEFAULT_MARKER_OUTLINE;
                if (highlight) {
                    stroke_width = HIGHLIGHTED_MARKER_OUTLINE;
                }
                markers.forEach(m => {m.setAttribute("stroke-width", stroke_width)});
            },
            updateMapLocations: function () {
                let L = window.L;
                let map = window.my_map;
                let features;
                let map_data = this;

                if (map && L) {
                    this.geoJsonData.forEach(function(map_category, index) {
                        if (map_category.geojson_data.type !== "FeatureCollection") {
                            //console.log("diff type", map_category)
                        }
                        map_data.addMapLayer(map_category);
                    });
                }
            },
            filterMapCategories: function () {
                let filter_term = this.filterTerm.toLowerCase();
                this.filteredGeoJsonData = this.geoJsonData;
                if (filter_term) {
                    this.filteredGeoJsonData = this.geoJsonData.filter(function (map_category) {
                        return map_category.name.toLowerCase().includes(filter_term);
                    });
                }
            },
            fetchMapData: function () {
                /*
                TODO: If we want to use opendata site, resolve COORS issues. If data is stored in a database, we can just hit our own
                API here.

                var xmlhttp = new XMLHttpRequest();

                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
                    if (xmlhttp.status == 200) {
                        console.log("fetch res", xmlhttp.responseText);
                    }
                    else if (xmlhttp.status == 400) {
                        alert('There was an error 400');
                    }
                    else {
                        //alert('something else other than 200 was returned');
                    }
                    }
                };
    
                xmlhttp.open("GET", "https://data.openupstate.org/rest/maps?_format=json", true);
                xmlhttp.send();

                let map_data_promise = fetch("https://data.openupstate.org/rest/maps?_format=json").then(function(data){
                    console.log("fetch data", data);
                });
                */
            },
            removeAllMapLayers: function () {
                let L = window.L;
                let map = window.my_map;
                let map_data = this;
                if (map && L) {
                    this.geoJsonData.forEach(function(map_category, index) {
                        map_data.removeMapLayer(map_category);
                    });
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
            // allow double clicks to change category color when category is already selected
            handleCategoryClick(map_category) {
                let map = window.my_map;
                map_category.click_data = map_category.click_data || {};
                let click_data = map_category.click_data;

                if(!click_data.clicked) {
                    if (!map_category.layer || !map.hasLayer(map_category.layer)) {
                        this.addMapLayer(map_category);
                    }
                    else {
                        click_data.clicked = true;
                        // set a click timer so we can see if the user clicks again in a brief amount of time
                        click_data.click_timer = setTimeout(() => {
                                if (click_data.clicked) {
                                    this.removeMapLayer(map_category);
                                    click_data.clicked = false;
                                    click_data.click_timer = null;
                                }
                        }, DOUBLE_CLICK_TIME);
                    }
                }
                else {
                    this.setMapCategoryColor(map_category);
                    clearTimeout(click_data.click_timer);
                    click_data.click_timer = null;
                    click_data.clicked = false;
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
                    this.selectedGeoJsonData[map_category.id] = map_category;
                }
                else if (map_category.layer == undefined) {
                    let map_layer;
                    let map_category_id = "map_category_" + mapCategoryCounter;
                    map_category.id = map_category_id;
                    this.selectedGeoJsonData[map_category_id] = map_category;
                    //Re-use same color if set
                    let marker_color = this.setMapCategoryColor(map_category, map_category.marker_color);
                    map_category.marker_class = map_category.id + CATEGORY_MARKER_CLASS_SUFFIX;

                    map_layer = L.geoJSON(geo_json, {
                        pointToLayer: function(feature, coords) {
                            return L.circleMarker(coords, {
                                className: "open-data--map-marker " + map_category.marker_class,
                                fillColor:      marker_color,
                                color:          marker_color,
                                weight:         HIGHLIGHTED_MARKER_OUTLINE,
                                fillOpacity:    0.7,
                            });
                        }
                    }).bindPopup(function(layer){
                        let popup_html = document.createElement("span").innerHTML = layer.feature.properties.title || "meh";
                        return popup_html;
                    }).addTo(map);

                    map_category.layer = map_layer;
                    mapCategoryCounter++;
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
                    map_category.color_sample_styles = {
                        backgroundColor:    color
                    };
                    map_category.item_styles = {
                        backgroundColor:    color,
                    };
                    map_category.marker_color = color;
                    this.updateMarkerColor(map_category, color);
                }

                return color;
            },
            updateMarkerColor: function (map_category, color) {
                if(!map_category.marker_class) {
                    return;
                }
                let markers = document.querySelectorAll("." + map_category.marker_class);
                markers.forEach(m => {
                    m.setAttribute("stroke", color);
                    m.setAttribute("fill", color);
                });
                let sub_layers = {};
                if (map_category.layer && map_category.layer._layers) {
                    sub_layers = map_category.layer._layers;
                }
                for(let layer_id in sub_layers) {
                    sub_layers[layer_id].options.fillColor = color;
                    sub_layers[layer_id].options.color = color;
                }
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
                    delete this.selectedGeoJsonData[map_category.id];
                }
            },
            initializeMap: function() {
                let initialize_map_fn = window.initializeMap;
                this.fetchMapData();
                if (typeof initialize_map_fn === "function") {
                    initialize_map_fn();
                }
                else {
                    console.warn("Initialize Map function undefined.")
                }
            },
            addPreSelectedMaps: function(map_selections) {
                let map_data = this;
                this.geoJsonData.forEach(function(map_category, index) {
                    if (map_selections.includes(map_category.category)) {
                        map_data.addMapLayer(map_category);
                    }
                });
            },
            toggleUtilityControls: function () {
                let control_panel = document.getElementById("utility_control_panel");
                if (control_panel.className.includes("open-data--utility-control-panel__open")) {
                    control_panel.classList.remove("open-data--utility-control-panel__open");
                    let control_panel_toggle = document.getElementById("utility_control_panel_toggle");
                }
                else {
                    control_panel.classList.add("open-data--utility-control-panel__open");
                }
                
            }
        },
        created() {
            this.$nextTick(function () {
                this.initializeMap();
                //console.log("route innards",this.$route.query);
                //console.log(this.preselected_maps);
                if (this.preselected_maps) {
                    this.addPreSelectedMaps(this.preselected_maps);
                }
            });
        },
        name: "mapData",
    };
</script>

<style lang="scss">
    $list-y: 50px;
    $list-max-height: 500px;
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
            box-shadow:0 5px 6px;
            transform: scale(1.1);
            transition: all 0.7s ease 0s;
        }
    }

    .open-data--selected-item {
        border-radius: 5px;
        color: black;
        cursor: pointer;
        display: inline-block;
        font-size: 12px;
        font-weight: bold;
        margin: 0 5px 5px 0;
        width: auto;
        padding: 5px;
    }

    .open-data--selected-items {
        margin-top: 5px;
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
        max-height: $list-max-height;
        margin: 0 0 -16px 0;
        min-height: $list-max-height;
        overflow: scroll;
        padding-top: 20px;
        position: relative;
        transition: max-height 0.5s ease 0s;
        width: 100%;
        z-index: $list-z;
    }

    .open-data--list-container {
        border-bottom: 3px solid black;
        border-top: #C3C3C3 1px solid;
        height: 100%;
        margin-bottom: -50px;
        margin-top: 30px;
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
        height: 500px;
        border-bottom: 3px solid #525252;
    }

    .open-data--utility-control {
        border: 1px solid black;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-block;
        margin: 10px 10px 10px 0;
        padding: 10px;
        position: relative;

        &.open-data--utility-control__add {
            background-color: green;
        }

        &.open-data--utility-control__remove {
            background-color: red;
        }
    }

    .open-data--map-data--filter-input {
        border: none;
        border-bottom: #C3C3C3 1px solid;
        float: left;
        font-size: 18px;
        height: 25px;
        //margin-top: 5px;
        padding: 5px;
        width: 100%;

        &::placeholder {
            color: #C3C3C3;
        }

        &:focus {
            outline: none;
        }

        &:hover {
            //box-shadow: -5px 8px 6px -4px #6D9EED;
        }
    }

    .open-data--utility-control-container {
        display: block;
    }
    .open-data--utility-control-panel {
        display: block;
        height: 0;
        overflow: hidden;
        position: relative;
        text-align: center;
        transition: all 1s ease 0s;
    }

    .open-data--utility-control-panel__open {
        height: 50px;
    }

    .open-data--utility-control-toggle {
        text-align: center;
    }

    .open-data--utility-control-toggle-arrow {
        box-sizing: border-box;
        display: inline-block;
        font-size: 12px;
        text-align: center;
        width: 80px;
    }

    .open-data--map-marker {
        transition: stroke-width  .5s ease-out;
    }

#more-arrows {
	width: 75px;
    height: 65px;
  
  &:hover {
    
    polygon {
      fill: black;
      transition: all .2s ease-out;

      &.arrow-bottom {
        transform: translateY(-18px);
      }

      &.arrow-top {
        transform: translateY(18px);
      }
      
    }
  
  }
  
}

polygon {
    fill: black;
    transition: all .2s ease-out;
    
    &.arrow-middle {
        opacity: 0.75;
    }

    &.arrow-top {
    opacity: 0.5
    }
}

    body {
        margin: 0;
    }

    .clearfix {
        clear: both;
    }
</style>