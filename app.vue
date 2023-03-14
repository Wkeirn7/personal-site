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
    background-color: rgb(0, 0, 0);
}

.tron-text-blue {
    text-shadow: 1px 1px 2px rgba(255, 0, 0, 0), 0 0 1em rgb(0, 231, 252), 0 0 0.5em rgb(0, 231, 252);
    -webkit-text-shadow: 1px 1px 2px rgba(255, 0, 0, 0), 0 0 1em rgb(0, 231, 252), 0 0 0.5em rgb(0, 231, 252);
    color: rgb(0, 231, 252);
	-webkit-text-stroke: .1rem rgb(0, 231, 252);
	-webkit-text-fill-color: rgba(255, 255, 255, 0);
    font-family: 'Orbitron', 'Times New Roman', Times, serif;
}

.tron-text-orange {
    text-shadow: 1px 1px 2px rgba(255, 0, 0, 0), 0 0 1em #f8c457, 0 0 0.2em #f8c457;
    -webkit-text-shadow: 1px 1px 2px rgba(255, 0, 0, 0), 0 0 1em #f8c457, 0 0 0.2em #f8c457;
    color: #f8c457;
	-webkit-text-stroke: .1rem #f8c457;
	-webkit-text-fill-color: rgba(255, 255, 255, 0);
    font-family: 'Orbitron', 'Times New Roman', Times, serif;
}

.tron-nav-text {
    text-shadow: 1px 1px 2px rgba(255, 0, 0, 0), 0 0 1em #f8c457, 0 0 0.2em #f8c457;
    -webkit-text-shadow: 1px 1px 2px rgba(255, 0, 0, 0), 0 0 1em #f8c457, 0 0 0.2em #f8c457;
    color: #f8c457;
	-webkit-text-stroke: .1rem #f8c457;
	-webkit-text-fill-color: rgba(255, 255, 255, 0);
    font-family: 'Orbitron', 'Times New Roman', Times, serif;
    transition: text-shadow 400ms, -webkit-text-stroke 400ms, width 400ms;
}

.tron-nav-text:hover {
    text-shadow: 1px 1px 2px rgba(255, 0, 0, 0), 0 0 2em #fec852, 0 0 0.5em #ffe2a3;
    -webkit-text-shadow: 1px 1px 2px rgba(255, 0, 0, 0), 0 0 2em #fec852, 0 0 0.5em #ffe2a3;
    -webkit-text-stroke: .1rem #ffb005;
}
</style>
