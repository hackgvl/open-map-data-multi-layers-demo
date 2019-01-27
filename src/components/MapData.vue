<template>
  <div class="open-data--map-data">
    <div>{{ geo_json_data || "Data goes here" }}</div><button @click="retrieveGeoJsonData">Get Data</button
</template>

<script>
    export default {
        methods: {
            retrieveGeoJsonData() {
                store.dispatch('retrieveGeoJsonData').then(() => {
                    console.log("Done retrieving data");
                });
            }
        },
        computed: {
            geo_json_data() { return store.state.geo_json_data }
      }
    });
</script>