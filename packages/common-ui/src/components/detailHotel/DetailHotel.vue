<script>
export default {
   props: {
      title: { type: String, default: "" },
   },
};
</script>

<template>
   <div className="style-new" :style="{ 'font-size': '20px' }">
      Mi hotel {{ title }}!!
   </div>
</template>
