<script setup lang="ts">
import { useRouter, RouterLink, RouterView } from "vue-router";
import { useMapStore } from "./stores/map";
import { useUIStore } from "./stores/ui";
import ContributionBanner from "./components/ContributionBanner.vue";
import ContributionButton from "./components/ContributionButton.vue";

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
  <div class="h-[calc(100%-3.5rem)] w-full">
    <Transition name="fade">
      <ContributionBanner
        class="h-[24px]"
        v-if="uiStore.showContributionBanner"
      />
    </Transition>
    <div
      :class="uiStore.showContributionBanner ? 'h-[calc(100%-24px)]' : 'h-full'"
    >
      <RouterView />
    </div>
  </div>

  <header
    class="fixed bg-gray-800 bottom-0 left-0 right-0 h-14 px-4 py-2 items-stretch"
  >
    <nav
      class="flex justify-between items-center text-xl space-x-4 mx-4 md:mx-8 lg:mx-16"
    >
      <RouterLink class="link" :to="mapLink()">Map</RouterLink>
      <ContributionButton />
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
