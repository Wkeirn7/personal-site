<template>
    <div class="flex flex-column align-items-center gap-3 justify-content-center w-full project-flex">
        <img class="w-4 sm:w-8" :src="project.icon" :alt="project.title" />
        <h5 class="tron-text-orange text-center text-2xl mt-0 mb-0 project-title">
            {{ project.title }}
        </h5>
        <CustomButton 
            label="About" 
            class="project-button" 
            blue
            :project-name="project.title"
            @custom-clicked="handleCustomClick"
        />
        <Dialog 
            v-model:visible="visible" 
            modal 
            class="sm:w-8 w-10"
            :contentStyle="{
                background: 'rgb(40, 40, 40)',
                outline: '8px solid rgb(217, 217, 217)',
                borderRadius: '10px',
                color: 'white',
                paddingBottom: '0.5rem',
                boxShadow: '1px 1px 2px rgba(255, 0, 0, 0), 0 0 3em rgba(112, 255, 248, 0.866), 0 0 0.2em rgba(112, 255, 248, 0.866)'
            }"
            :show-header="false"
            :draggable="false"
            :dismissable-mask="true"
        >
            <div class="sm:h-30rem h-20rem">
                <h1 class="tron-text-orange">{{ project.title }}</h1>
                <p class="tron-text-blue modal-text sm:text-base text-xs">
                    {{ project.description }}
                </p>
                <h3 class="tron-text-orange modal-text">
                    Tech Used:
                </h3>
                    <div class="flex flex-row align-items-end justify-content-center flex-wrap gap-5">
                        <Tech v-for="item in project.tech" class="sm:w-3 w-4" :icon-name="item.name" text-class=" tron-text-blue text-sm" icon-class=" sm:w-3 w-8" :icon-path="item.icon" />

                    </div>
                <h3 class="tron-text-orange modal-text">
                    Links:
                </h3>
                <div class="flex sm:flex-row flex-column align-items-center justify-content-start gap-4 w-full">
                        <CustomButton label="Frontend Code" blue :link="project.githubUrls.frontend"/>
                        <CustomButton v-if="project.githubUrls.backend" label="Backend Code" blue :link="project.githubUrls.backend"/>
                        <CustomButton label="View Project" blue :link="project.projectUrl"/>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
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

interface Props {
    project: Project;
}

const props = defineProps<Props>();

const visible = ref<boolean>(false);

function handleCustomClick(): void{
    visible.value = true;
}
</script>

<style>
.project-title {
    letter-spacing: 2px;
}

.project-flex {
    box-sizing:border-box;
}

.modal-text {
    letter-spacing: 3px;
}
</style>