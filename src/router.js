import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'

const GOOGLE_MAPS_API_KEY = "AIzaSyA-fp34A9dsuWW1FGEg2RKVBrQ7enzv-Qk";

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: About,
      props: {
        //geo_json_data: Maps.retrieveGeoJsonData(),
      },
    }
  ]
})
