<template>
    <div>
        <div class="flex sm:flex-row flex-column gap-5">
                <span 
                    class="tron-nav-text sm:text-4xl text-2xl cursor-pointer"
                    @click="emitClick('about-nav')"
                >
                    About Me
                </span>
                <span 
                    class="tron-nav-text sm:text-4xl text-2xl cursor-pointer"
                    @click="emitClick('projects-nav')"
                >
                    Projects
                </span>
                <span 
                    class="tron-nav-text sm:text-4xl text-2xl cursor-pointer"
                    @click="emitClick('contact-nav')"
                >
                    Contact
                </span>
        </div>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
    (e: 'scrollClicked', id: string): void
}>();

function emitClick(id: string): void {
    emit('scrollClicked', id)
}
</script>

<style>

</style>