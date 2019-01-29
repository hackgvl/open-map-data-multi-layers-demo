<template>
    <div class="open-data--map-data">
        <div>{{ geo_json_data || "Data goes here" }}</div><button @click="retrieveGeoJsonData">Get Data</button>
    </div>
</template>

<script>
    export default {
        /*
        methods: {
            retrieveGeoJsonData() {
                store.dispatch('retrieveGeoJsonData').then(() => {
                    console.log("Done retrieving data");
                });
            }
        },
        */
        name: "mapData",
        props: {
            geoJsonData: {
                type: Object
            }
        }
    };
</script>