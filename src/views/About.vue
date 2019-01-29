<template>
  <div class="about">
    <h1>This is an about page</h1>
    <MapData v-bind:geo-json-data="geoJsonData" {></MapData>
  </div>
</template>


<script>
// @ is an alias to /src
import MapData from '@/components/MapData.vue'

export default {
  name: 'about',
  props: {
    geoJsonData: {
      type: Object
    },
  },
  components: {
    MapData
  }
}

</script>
