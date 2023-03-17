<template>
    <div class="contact-section is-app-background h-screen top-0 left-0 right-0 bottom-0" id="contact-nav">
        <h2 class="tron-text-blue sm:text-7xl text-5xl">CONTACT</h2>
        <form 
            @submit.prevent="event=> handleCustomClick(event.target as HTMLFormElement)" 
            class="email-form flex flex-column p-5 border-round sm:w-11 lg:w-6 w-11 gap-4"
        >
            <div class="tron-text-orange email-label">Name:</div>
            <input type="text" v-model="nameValue" name="from_name" class="text-area text-base sm:text-lg line-height-4"/>
            <div class="tron-text-orange email-label">Your Email:</div>
            <input type="email" v-model="emailValue" name="reply_to" class="text-area text-base sm:text-lg line-height-4"/>
            <div class="tron-text-orange email-label">Message:</div>
            <textarea v-model="contentValue" name="message" class="text-area text-base sm:text-lg text-box w-12 h-30rem"></textarea>
            <CustomButton 
                label="Send Email" 
                :blue="false" submit 
                @submit-clicked="handleCustomClick"
                :disabled="!(nameValue && contentValue && emailValue)"
            />
        </form>
        <Toast position="bottom-left"/>
    </div>
</template>

<script setup lang="ts">
import emailjs from 'emailjs-com';
const toast = useNuxtApp().vueApp.config.globalProperties.$toast;

const nameValue = ref<string>('');
const contentValue = ref<string>('');
const emailValue = ref<string>('');

function handleCustomClick(target: HTMLFormElement): void {
    try {
        emailjs.sendForm('service_73hlwch', 'template_r5u02l4', target, 'Y0NMwdnIYQL9raZRb');
        toast.add({
            detail: 'Email Sent!',
            severity: 'success',
            life: 3000,
        });
      } catch(error) {
          toast.add({
            detail: 'Email Failed to Send. Please try again.', 
            severity: 'error',
            life: 3000,
        })
      }
      nameValue.value = '';
      emailValue.value = '';
      contentValue.value= '';
}
</script>

<style>
.contact-section {
    margin-top: 300vh;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.email-form {
    background-color: rgba(57, 57, 57, 0.763);
    height: 70vh;
    border-width: 2px;
    border-style: solid;
    border-color: rgba(248, 196, 87, 0.866);
    box-shadow: 
                1px 1px 2px rgba(255, 0, 0, 0), 
                0 0 3em rgba(248, 196, 87, 0.866), 
                0 0 0.2em rgba(248, 196, 87, 0.866);
}

.text-area {
    background-color: rgba(51, 51, 51, 0.687) !important;
    border-color: rgba(112, 255, 248, 0.866) !important;
    border-width: 3px !important;
    border-radius: 5px;
    color: white !important;
    color-scheme: dark;
}

.text-area:enabled:hover {
    border-color: rgba(248, 196, 87, 0.866) !important;
}

.email-label {
    letter-spacing: 2px;
}

.p-toast-message {
    width: 20rem;
}
</style>