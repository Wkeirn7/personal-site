<template>
    <div class="flex flex-column align-items-center gap-4">
        <img v-tooltip.top="iconName" :alt="iconName" :src="iconPath" :class="iconClass"/>
        <span :class="textClass + ' tech-icon-text'">{{ iconName }}</span>
    </div>
</template>

<script setup lang="ts">
    interface Props {
        iconName: string;
        iconPath: string;
        iconClass: string;
        textClass: string;
    }

    const props = defineProps<Props>();
</script>

<style>
.tech-icon-text {
    letter-spacing: 2px;
}
</style>