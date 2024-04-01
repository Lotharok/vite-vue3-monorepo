<script setup>
import { ref } from "vue";
import { DetailHotel } from "common-ui";
const loading = ref(true);
const respackage = ref();
const reqApi = async () => {
   const api = await fetch("https://mihost.web-travel.com/users");
   const res = await api.json();
   console.log(res);
   setTimeout(() => {
      respackage.value = res;
      loading.value = false;
   }, 5000);
};
reqApi();
</script>

<template>
   <div>
      <h1>{{ $t("review_package.title") }}</h1>
      <div v-if="loading" class="loading">Aqui va mi skeleton...</div>
      <div v-else>
         <DetailHotel :title="respackage.HotelName"></DetailHotel>
      </div>
   </div>
</template>
