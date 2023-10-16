<script setup lang="ts">
import { useRouter, RouterLink, RouterView } from "vue-router";
import { useMapStore } from "./stores/map";
import { useUIStore } from "./stores/ui";
import ContributionBanner from "./components/ContributionBanner.vue";

const mapStore = useMapStore();
const uiStore = useUIStore();
const router = useRouter();

function mapLink() {
  const slugsList =
    Object.keys(mapStore.loadedMaps)
      .filter((key) => mapStore.loadedMaps[key].visible)
      .join(",") || undefined;

  return router.resolve({
    name: "map",
    query: {
      lat: mapStore.location.lat,
      lng: mapStore.location.lng,
      zoom: mapStore.zoom,
      maps: slugsList,
    },
  });
}
</script>

<template>
  <div class="h-full w-full pb-12">
    <Transition name="fade">
      <ContributionBanner v-if="uiStore.showContributionBanner" />
    </Transition>
    <RouterView />
  </div>

  <header
    class="fixed bg-gray-800 bottom-0 left-0 right-0 h-12 px-4 py-2 items-stretch"
  >
    <nav
      class="flex justify-between items-center text-xl space-x-4 mx-4 md:mx-8 lg:mx-16"
    >
      <RouterLink class="link" :to="mapLink()">Map</RouterLink>
      <RouterLink class="link" to="/about">About</RouterLink>
    </nav>
  </header>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
