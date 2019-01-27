import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//export default new Vuex.Store({
const store = new Vuex.Store({
  state: {
    geo_json_data: {}
  },
  mutations: {
    updateGeoJsonData(state, payload) {
        state.geo_json_data = payload;
    }
  },
  actions: {
    async retrieveGeoJsonData(context) {
        let response, data;
        try {
            response = await Vue.http.get('/public/geojson_data.json');
        } catch (ex) {
            console.err("Failed to retrieve GeoJson Data", ex);
            return;
        }

        if (response) {
          data = response.body;
        }
        context.commit('updateGeoJsonData', data);
    }
  }
});

Vue.component('MapDataComponent', {
  template: '<div>{{ geo_json_data || "Data goes here" }}</div><button @click="retrieveGeoJsonData">Get Data</button',
  methods: {
      retrieveGeoJsonData() {
        this.$store.dispatch('retrieveGeoJsonData').then(() => {
            console.log("Done retrieving data");
        });
      }
  },
  computed: {
    geo_json_data() { return this.$store.state.geo_json_data }
  }
});
