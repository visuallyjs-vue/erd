<script setup>
import { EdgeTypePickerComponent, InspectorComponent, ColorPickerComponent } from "@visuallyjs/browser-ui-vue"
import { Node, Edge } from "@visuallyjs/browser-ui"
import {
    PROPERTY_FILL,
    PROPERTY_LABEL,
    PROPERTY_OUTLINE
} from "./constants";
import {ref} from "vue";

let current = ref(null)

</script>

<template>
    <InspectorComponent class="vjs-erd-inspector" v-model="current">

        <template v-if="current != null">
            <template v-if="current.objectType === Node.objectType">
                <label>Label</label>
                <input type="text" :vjs-att="PROPERTY_LABEL" vjs-focus="true"/>

                <div class="vjs-inspector-type">Type: {{ current.type }}</div>

                <label>Fill Color</label>
                <ColorPickerComponent :propertyName="PROPERTY_FILL"/>

                <label>Outline Color</label>
                <ColorPickerComponent :propertyName="PROPERTY_OUTLINE"/>
            </template>

            <template v-if="current.objectType === Edge.objectType">
                <label>Markers</label>
                <EdgeTypePickerComponent propertyName="type"/>
            </template>
        </template>
    </InspectorComponent>
</template>
