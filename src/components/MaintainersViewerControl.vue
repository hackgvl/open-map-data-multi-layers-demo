<script setup lang="ts">
import { ref } from "vue";
import { useMapStore } from "../stores/map";
import { LControl } from "@vue-leaflet/vue-leaflet";
import ContributionButton from "./ContributionButton.vue";

const mapStore = useMapStore();

const showMaintainers = ref(false);
</script>

<template>
  <l-control
    class="leaflet-control-maintainers leaflet-control"
    position="topright"
    aria-haspopup="true"
    @mouseover="showMaintainers = true"
    @mouseleave="showMaintainers = false"
  >
    <a
      :class="{ 'leaflet-control-maintainers-toggle': !showMaintainers }"
      href="#"
      title="Maintainers"
      role="button"
    ></a>
    <section
      class="w-64 md:w-[256px] lg:w-[512px] px-2 max-h-[75vh] md:max-w-max overflow-y-auto"
      v-if="showMaintainers"
    >
      <h1 class="text-slate-950 text-lg sm:text-xl font-bold py-2">
        Maintainers of Active Layers
      </h1>
      <div class="mb-2">
        <ContributionButton />
      </div>
      <div
        class="mb-2"
        v-for="(maintainerInfo, name) in mapStore.maintainersOfActiveLayers"
        :key="name"
      >
        <h2 class="text-slate-800 text-sm sm:text-base font-bold">
          {{ maintainerInfo.maintainedMapTitle }}
          <span v-if="maintainerInfo.contributionInfo">
            -
            <a :href="maintainerInfo.contributionInfo.uri" target="_blank">
              Data Source
            </a>
          </span>
        </h2>

        <ul class="list-disc list-inside">
          <li
            class="text-sm"
            v-for="maintainer in maintainerInfo.maintainers"
            :key="maintainer.title"
          >
            <a
              v-if="maintainer.uri.length > 0"
              :href="maintainer.uri"
              target="_blank"
            >
              {{ maintainer.title }}
            </a>
            <span class="text-zinc-900" v-else>{{ maintainer.title }}</span>
          </li>
        </ul>
      </div>
    </section>
  </l-control>
</template>

<style>
.leaflet-control-maintainers {
  border: 2px solid rgba(0, 0, 0, 0.2);
  background-clip: padding-box;
  background-color: #fff;
  border-radius: 5px;
}

.leaflet-control-maintainers-toggle {
  background-image: url("@/assets/attribution.png");
  background-repeat: no-repeat;
  background-position: center;
  width: 44px;
  height: 44px;
  display: block;
}
</style>
