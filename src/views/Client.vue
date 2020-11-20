<template>
  <div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  name: 'Client'
})
export default class Client extends Vue {
  mounted() {
    console.log(this.$route);
  }
}
</script>
<style lang="scss" scoped>

</style>