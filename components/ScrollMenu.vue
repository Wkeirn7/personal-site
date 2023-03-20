<template>
    <div>
        <div class="flex sm:flex-row flex-column gap-5">
                <button 
                    type="button"
                    class="tron-nav-text sm:text-4xl text-2xl cursor-pointer nav-button w-8"
                    @click="emitClick('about-nav')"
                >
                    About Me
                </button>
                <button 
                    type="button"
                    class="tron-nav-text sm:text-4xl text-2xl cursor-pointer nav-button w-8"
                    @click="emitClick('projects-nav')"
                >
                    Projects
                </button>
                <button
                    type="button"
                    class="tron-nav-text sm:text-4xl text-2xl cursor-pointer nav-button w-8"
                    @click="emitClick('contact-nav')"
                >
                    Contact
                </button>
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
    .nav-button {
        background-color: black;
        border-width: 0px;
        text-align: left;
    }
</style>