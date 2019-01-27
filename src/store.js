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
            //response = await Vue.http.get('/public/geojson_data.json');
            console.log("Here we would get the data");
            response = {body:"meh"};
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

export {store};