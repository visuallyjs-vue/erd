<script setup lang="ts">
import {
    ControlsComponent,
    DiagramProvider, DiagramComponent, DiagramPaletteComponent
} from "@visuallyjs/browser-ui-vue"

import renderOptions from './render-options'
import { onMounted, ref } from "vue";
import ERDInspector from "./Inspector.vue";
import {erdShapes} from "./erd-shapes.js";

const props = defineProps(['url', 'hidePalette', 'hideInspector'])

const diagram = ref(null)

onMounted(() => {
    // window.d = diagram.value
})

</script>

<template>
  <div class="vjs-erd">
      <DiagramProvider>
          <div class="vjs-erd-canvas">
              <DiagramComponent :options="renderOptions" url="/dataset.json" ref="diagram">
                  <ControlsComponent orientation="column"/>
              </DiagramComponent>
              <ERDInspector v-if="hideInspector !== true"/>
          </div>
          <div v-if="hidePalette !== true" class="vjs-erd-palette">
              <DiagramPaletteComponent :preparedShapes="erdShapes" :showLabels="true"/>
          </div>
      </DiagramProvider>
  </div>
</template>
