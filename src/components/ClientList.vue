<template>
  <div class="h-client-list-container">
    <div v-for="client in clients" :key="client._id" class="box">
        <p class="title">{{ client.name }}</p>
        <p class="content">Balance: {{ client.balance || 0 }}</p>
        <div class="is-flex">
          <b-button class="is-flex-grow-1" @click="addEntry">Add entry</b-button>
          <CRUDClient
              :meta="client"
              class="is-flex-grow-1 is-flex"
              custom-class="is-flex-grow-1 h-client-edit-button"
              trigger-name="Edit"
              @update="$emit('update')"
          />
          <b-button class="is-flex-grow-1" @click="deleteClientPrompt(client._id)">Delete</b-button>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
// eslint-disable-next-line no-unused-vars
import {Client} from "@/types/types";
import CRUDClientModal from "@/components/CRUDClientModal.vue";
import CRUDClient from "@/components/CRUDClient.vue";

@Component({
  name: 'ClientList',
  components: {CRUDClient, CRUDClientModal},
  props: ['clients']
})
export default class ClientList extends Vue {
  clients!: Client[];
  clientName = "";

  deleteClientPrompt(_id: string) {
    this.$buefy.dialog.confirm({
      type: "is-danger",
      message: 'Delete client and its transactions?',
      onConfirm: () => this.$emit('delete', _id)
    })
  }

  addEntry() {
  }
}
</script>
<style lang="css">
.h-client-list-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1rem;
  padding: 1rem;
  max-width: 100vw;
}

.h-client-edit-button {
  margin: 0 6px;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .h-client-list-container {
    grid-template-columns: 1fr;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .h-client-list-container{
    grid-template-columns: 1fr 1fr;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .h-client-list-container{
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.box:last-child{
  margin-bottom: 1.5rem;
}
</style>