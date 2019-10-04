import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import MapData from './components/MapData.vue'
import About from './views/About.vue'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Home,
      props: {
        //geo_json_data: Maps.retrieveGeoJsonData(),
      },
    },
    {
      path: '/',
      name: 'about',
      component: MapData,
      props: (route) => ({ 
        preselected_maps: route.query.preselected_maps ? route.query.preselected_maps.split(',') : [],
        map_only: !!route.query.map_only
      })
    },
  ]
})
