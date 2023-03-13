<template>
    <div class="projects-section is-app-background h-screen" id="projects-nav">
        <div class="flex flex-column align-items-center justify-content-center up-intersection">
            <h2 class="tron-text-orange sm:text-7xl text-5xl">PROJECTS</h2>
            <div class="projects-container flex flex-column sm:flex-row border-round w-11 h-27rem align-items-center p-5 justify-content-around">
                <li v-for="project in projects" class="list-none">
                    <Project :project="project" />
                </li>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import projectsList from '~/json/projects.json';
const { observedElement, elementClass, interOptions, interCallback, observer } = useIntersect();

interface Project {
    title: string;
    icon: string;
    description: string;
    tech: Tech[];
    githubUrls: {
        frontend: string;
        backend?: string;
    };
    projectUrl: string;
}

interface Tech {
    name: string;
    icon: string;
}

const projects = ref<Project[]>(projectsList);

onMounted(() => {
    observedElement.value = document.querySelector(".up-intersection");
    elementClass.value = "movein-up";
    interOptions(null, 0);
    interCallback();
    observer.observe(observedElement.value as Element);
});
</script>

<style>
.projects-section {
    margin-top: 200vh;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.projects-container {
    background-color: rgba(200, 200, 200, 0.238);
    border-width: 2px;
    border-style: solid;
    border-color: rgba(112, 255, 248, 0.866);
    box-shadow: 
                1px 1px 2px rgba(255, 0, 0, 0), 
                0 0 3em rgba(112, 255, 248, 0.866), 
                0 0 0.2em rgba(112, 255, 248, 0.866); 
                
}

.movein-up {
    animation: moveinUp 1s ease-in;
}
    /* Animations */
@keyframes moveinUp {
    0% {
    opacity: 0;
    transform: translateY(100px);
    }
    100% {
    opacity: 1;
    transform: translate(0);
    }
}
</style>