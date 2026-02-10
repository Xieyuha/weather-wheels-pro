<template>
    <svg :class="['svg-icon', className]" aria-hidden="true">
        <use :xlink:href="symbolId" />
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    name: string;
    className?: string;
}

const props = defineProps<Props>();

const symbolId = computed(() => `#icon-${props.name}`);
</script>

<style scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
    vertical-align: middle;
}
</style>