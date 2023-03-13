<template>
    <div class="h-4rem">
        <input 
            v-if="submit" 
            type="submit" 
            :value="label" 
            :class="blue ? 'tron-text-blue b-blue ' + buttonClass : 'tron-text-orange b-orange ' + buttonClass"
            :disabled="disabled"
        >
        <span v-else>
            <a v-if="link" :href="link" target="_blank">
                <button 
                :class="blue ? 'tron-text-blue b-blue ' + buttonClass : 'tron-text-orange b-orange ' + buttonClass"
                @click="!link && emit('customClicked')"
                >
                    {{ label }}
                </button>
            </a>
            <button
                v-else
                :class="blue ? 'tron-text-blue b-blue ' + buttonClass : 'tron-text-orange b-orange ' + buttonClass"
                @click="!link && emit('customClicked')"
                >
                    {{ label }}
            </button>
        </span>
    </div>
</template>

<script setup lang="ts">

const buttonClass = ref<string>('custom-button cursor-pointer w-full')
interface Props {
    label: string;
    blue: boolean;
    submit?: boolean;
    link?: string;
    disabled?: boolean;
}

const emit = defineEmits<{
    (e: 'customClicked'): void,
}>();

const props = withDefaults(defineProps<Props>(), {
    blue: true,
    submit: false,
    disabled: false,
});
</script>

<style>
    .custom-button {
        background-color: rgba(0, 0, 0, 0);
        letter-spacing: 2px;
        border-radius: 5px;
        border-width: 3px;
        width: 100px;
        height: 50px;
    }

    .b-orange {
        box-shadow: 
            1px 1px 2px rgba(255, 0, 0, 0), 
            0 0 0em rgba(248, 196, 87, 0.866), 
            0 0 0em rgba(248, 196, 87, 0.866);
        border-color: rgba(248, 196, 87, 0.866);
    }

    .b-blue {
        box-shadow: 
            1px 1px 2px rgba(255, 0, 0, 0), 
            0 0 0em rgba(112, 255, 248, 0.866), 
            0 0 0em rgba(112, 255, 248, 0.866);
        border-color: rgb(0, 231, 252);
    }

    .b-blue[type="submit" i]:disabled {
        box-shadow: none;
        border-color: rgba(0, 231, 252, 0.332);
        -webkit-text-stroke-color: rgba(0, 231, 252, 0.332);
        cursor: not-allowed;
    }

    .b-orange[type="submit" i]:disabled {
        box-shadow: none;
        border-color: rgba(248, 197, 87, 0.332);
        -webkit-text-stroke-color: rgba(248, 197, 87, 0.332);
        cursor: default;
    }
</style>