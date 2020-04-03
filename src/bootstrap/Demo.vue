<style>
.component-demo {
  padding: 20px;
  background: #fff;
  border: 1px solid #ccc;
  margin-bottom: 20px;
}
</style>

<template>
  <div class="component-demo">
    <component v-if="comp" :is="comp"></component>
  </div>
</template>
<script>
export default {
  props: {
    comp: {}
  }
};
</script>