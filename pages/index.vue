<template>
    <div class="main-page h-screen w-screen is-app-background top-0 left-0 right-0 bottom-0">
        <Dock :model="items" position="left" class="nav-dock">
            <template #icon="{ item }">
                <img 
                    :alt="(item.label as string)" 
                    :src="(item.icon as string)" 
                    style="width: 100%"
                    >
            </template>
        </Dock>
        <InfoSection @scroll-click="scrollToElement"/>
        <ScrollTop />
        <About />
        <Projects />
        <Contact />
    </div>
</template>

<script setup lang="ts">
const items = ref([
    {
        label: 'LinkedIn',
        icon: 'linkedin.svg',
        url: 'https://www.linkedin.com/in/william-keirn/',
        target: '_blank'
    },
    {
        label: 'Github',
        icon: 'github.svg',
        url: 'https://github.com/Wkeirn7',
        target: '_blank'
    },
    {
        label: 'Resume',
        icon: 'resume-link.svg',
        url: 'https://docs.google.com/document/d/1x2_lC28Kx39jewMeZuqgvfDJdgQbCO3o2WFXqm7my7U/edit?usp=sharing',
        target: '_blank'
    },
]);

function scrollToElement(id: string): void {
    const element = document.getElementById(id) as Element;
    element.scrollIntoView({ behavior: 'smooth'});
}
</script>


<style scoped lang="scss">
.main-page {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>