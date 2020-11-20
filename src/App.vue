<template>
  <div id="app">
    <CRUDClient triggerName="Add Client" @update="updateClients"/>
    <ClientList
        :clients="clients"
        @delete="deleteClient"
        @update="updateClients"
    />
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import CRUDClient from "@/components/CRUDClient.vue";
import ClientList from "@/components/ClientList.vue";
// eslint-disable-next-line no-unused-vars
import {Client} from "@/types/types";
import {deleteClient, fetchClients} from "@/api";

@Component({
  components: {ClientList, CRUDClient},
})
export default class App extends Vue {
  clients: Client[] = [];
  loaded = false

  async mounted() {
    await this.updateClients();
  }

  async deleteClient(_id: string) {
    try {
      const index = this.clients.findIndex(client => client._id === _id);
      await deleteClient(_id);
      this.clients.splice(index, 1);
    } catch (e) {
      console.log(e);
    }
  }

  async updateClients() {
    const resp = await fetchClients();
    this.clients = resp.data.clients.data;
  }
}
</script>

