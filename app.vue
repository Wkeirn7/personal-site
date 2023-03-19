<template>
    <index />
</template>

<script setup lang="ts">
import index from './pages/index.vue';
</script>


<!-- global styles -->
<style >
body {
    overflow-x: hidden;
}
.is-app-background {
    background-size: cover;
    background-color: black;
}

.tron-text-blue {
    color: rgb(0, 231, 252);
	-webkit-text-stroke: .1rem rgb(0, 231, 252);
	-webkit-text-fill-color: rgba(255, 255, 255, 0);
    font-family: 'Orbitron', 'Times New Roman', Times, serif;
}

.tron-text-orange {
    color: #f8c457;
	-webkit-text-stroke: .1rem #f8c457;
	-webkit-text-fill-color: rgba(255, 255, 255, 0);
    font-family: 'Orbitron', 'Times New Roman', Times, serif;
}

.tron-nav-text {
    color: #f8c457;
	-webkit-text-stroke: .1rem #f8c457;
	-webkit-text-fill-color: rgba(255, 255, 255, 0);
    font-family: 'Orbitron', 'Times New Roman', Times, serif;
    transition: text-shadow 400ms, -webkit-text-stroke 400ms, width 400ms;
}

.tron-nav-text:hover {
    -webkit-text-stroke: .1rem #ffb005;
}
</style>
