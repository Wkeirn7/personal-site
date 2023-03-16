<template>
    <div class="about-section is-app-background h-screen top-0 left-0 right-0 bottom-0" id="about-nav">
        <div class="flex flex-column align-items-center gap-4 left-intersection">
            <div class="about-logos flex flex-row gap-8 align-items-center justify-content-between">
                <img alt='United States Marine Corps Insignia' src="/usmc.svg" class="sm:w-10rem w-5rem"/>
                <img alt='Code Platoon Logo' src="/codeplatoon.svg" class="sm:w-10rem w-5rem"/>
            </div>
            <p class="tron-text-blue text-center about-content px-5 text-sm sm:text-sm md:text-2xl lg:text-4xl">
                Hello! I am a Software Engineer currently residing in Pennsylvania.
                I was an Aviation Radar Technician in the military for 5 years, and after my enlistment ended 
                I attended Code Platoon's software engineering course. I have since gained professional
                experience with multiple backend, and frontend technologies. I have had a passion for coding
                since high school, and love taking on new and challenging projects at work as well as in my free time.
                Please see my favorite development tools below, and feel free to contact me if you would like to collaborate!
            </p>
            <CustomButton
                label="Favorite Tech" 
                class="project-button"
                :blue="false" 
                project-name="My Favorite Tech"
                @custom-clicked="visible=true"
                id="intersect-el"
            />
            <Dialog
                v-model:visible="visible" 
                modal 
                class="sm:w-8 w-10"
                :contentStyle="{
                    background: 'rgb(40, 40, 40)',
                    height: '60vh',
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
                <div class="sm:h-30rem h-20rem modal-body">
                    <h1 class="tron-text-orange">Tech I Use</h1>
                    <div class="about-logos flex flex-wrap flex-row gap-4 align-items-end justify-content-around align-content-center">
                        <Tech icon-name="React Js" text-class="tron-text-blue text-sm" icon-class="sm:w-10rem w-4rem" icon-path="/react.svg" />
                        <Tech icon-name="Django" text-class="tron-text-blue text-sm" icon-class="sm:w-10rem w-4rem" icon-path="/django.svg" />
                        <Tech icon-name="Postgresql" text-class="tron-text-blue text-sm" icon-class="sm:w-10rem w-4rem" icon-path="/postgresql.svg" />
                        <Tech icon-name="Serverless" text-class="tron-text-blue text-sm" icon-class="sm:w-10rem w-4rem" icon-path="/serverless.svg" />
                        <Tech icon-name="MySQL" text-class="tron-text-blue text-sm" icon-class="sm:w-15rem w-6rem" icon-path="/mysql.svg" />
                        <Tech icon-name="Vue.Js" text-class="tron-text-blue text-sm" icon-class="sm:w-10rem w-4rem" icon-path="/vue.svg" />
                        <Tech icon-name="Nuxt.js" text-class="tron-text-blue text-sm" icon-class="sm:w-10rem w-4rem" icon-path="/nuxt.svg" />
                        <Tech icon-name="Typescript" text-class="tron-text-blue text-sm" icon-class="sm:w-10rem w-4rem" icon-path="/typescript.svg" />
                        <Tech icon-name="Javascript" text-class="tron-text-blue text-sm" icon-class="sm:w-10rem w-4rem" icon-path="/javascript.svg" />
                        <Tech icon-name="Python" text-class="tron-text-blue text-sm" icon-class="sm:w-10rem w-4rem" icon-path="/python.svg" />
                        <Tech icon-name="Bootstrap" text-class="tron-text-blue text-sm" icon-class="sm:w-10rem w-4rem" icon-path="/bootstrap.svg" />
                        <Tech icon-name="Material UI" text-class="tron-text-blue text-sm" icon-class="sm:w-10rem w-4rem" icon-path="/materialUI.svg" />
                        <Tech icon-name="PrimeVue" text-class="tron-text-blue text-sm" icon-class="sm:w-10rem w-4rem" icon-path="/primevue.svg" />
                    </div>
                </div>
            </Dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
const { observedElement, elementClass, interOptions, interCallback, observer } = useIntersect();

onMounted(() => {
    observedElement.value = document.querySelector(".left-intersection");
    elementClass.value = "movein-right";
    interOptions(null, 0);
    interCallback();
    observer.observe(observedElement.value as Element);
});

const visible = ref<boolean>(false);

</script>
<style>
.about-section {
    margin-top: 100vh;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-content: center;
}

.about-content {
    letter-spacing: 2px;
}

.movein-right {
    animation: moveinRight 1s ease-in;
}
    /* Animations */
@keyframes moveinRight {
    0% {
    opacity: 0;
    transform: translateX(-100px);
    }
    100% {
    opacity: 1;
    transform: translate(0);
    }
}
</style>