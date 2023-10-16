<script setup lang="ts">
import { useUIStore } from "../stores/ui";

const uiStore = useUIStore();
</script>

<template>
  <div class="sticky top-0 overflow-hidden gap-x-6 bg-gray-800 items-center">
    <div class="flex flex-nowrap">
      <!-- Spacer -->
      <div class="flex flex-1 shrink" aria-hidden="true" />

      <!-- Banner text -->
      <p class="text-sm leading-6 text-gray-50">
        <strong class="font-semibold">We're Open Source!</strong
        ><svg
          viewBox="0 0 2 2"
          class="fill-current mx-2 inline h-0.5 w-0.5"
          aria-hidden="true"
        >
          <circle cx="1" cy="1" r="1" />
        </svg>
        <a
          class="hover:underline cursor-pointer"
          href="https://data.openupstate.org/map-layers"
          target="_blank"
        >
          Click here to contribute
          <span aria-hidden="true">→</span>
        </a>
      </p>

      <!-- Dismiss banner button -->
      <span class="flex flex-1 justify-end mr-1 shrink">
        <button
          type="button"
          class="-m-3 p-3"
          @click="uiStore.setShowContributionBanner(false)"
        >
          <span class="sr-only">Dismiss</span>
          <svg
            class="h-5 w-5 text-gray-50"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
            />
          </svg>
        </button>
      </span>
    </div>
  </div>
</template>
