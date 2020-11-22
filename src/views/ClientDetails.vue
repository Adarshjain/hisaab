<template>
  <div>
    <div class="is-flex p-2 is-align-items-center mb-0">
      <router-link class="is-flex" to="/">
        <img alt="MLI" height="50" src="/assets/mli.png" width="50">
      </router-link>
      <p v-if="client" class="is-size-5 ml-3 mb-0">{{ client.name }}</p>
      <CRUDTransaction :meta="newMeta" custom-class="is-primary" style="margin-left: auto;"
                       triggerName="Add transaction"
                       @update="resetAndReload"/>
    </div>
    <template v-if="isLoaded">
      <b-table
          :data="transactionData"
          :loading="!isTableLoaded"
          striped
      >
        <!--          :mobile-cards="false"-->
        <b-table-column v-slot="props" field="date" label="Date">
          {{ props.row.date }}
        </b-table-column>
        <b-table-column v-slot="props" field="narration" label="Narration" searchable>
          {{ props.row.narration }}
        </b-table-column>
        <b-table-column v-slot="props" cell-class="currency-field" field="credit" label="Credit" numeric>
          {{ props.row.credit === 0 ? "" : props.row.credit }}
        </b-table-column>
        <b-table-column v-slot="props" cell-class="currency-field" field="debit" label="Debit" numeric>
          {{ props.row.debit === 0 ? "" : props.row.debit }}
        </b-table-column>
        <b-table-column v-slot="props" cell-class="table-actions" label="Actions" width="100">
          <CRUDTransaction
              :meta="transformTransaction(props.row)"
              custom-class="is-primary"
              triggerName="Add transaction"
              @update="resetAndReload"
          >
            <span slot="trigger" class="icon is-clickable table-action-icons">
              <i class="mdi mdi-pencil mdi-24px"></i>
            </span>
          </CRUDTransaction>
          <span class="icon is-clickable table-action-icons" @click="deleteTransaction(props.row)">
            <i class="mdi mdi-delete mdi-24px"></i>
          </span>
        </b-table-column>
      </b-table>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {deleteTransaction, fetchClient, getTransactionOfClient} from "@/api";
// eslint-disable-next-line no-unused-vars
import {Client, FlatTransaction, Transaction, TransactionInput} from '@/types/types';
import CRUDTransaction from "@/components/transaction/CRUDTransaction.vue";
import {formatCurrency, formatDate} from "@/helper";

@Component({
  name: 'ClientDetails',
  components: {CRUDTransaction}
})
export default class ClientDetails extends Vue {
  client!: Client;
  //@ts-ignore
  newMeta: TransactionInput = {};
  isLoaded = false;
  isTableLoaded = false;
  transactionData: FlatTransaction[] = [];
  clientId: string = "";

  data() {
    return {
      client: undefined
    }
  }

  resetAndReload() {
    this.resetMeta();
    this.fetchTableData();
  }

  async fetchTableData() {
    this.isTableLoaded = false;
    const resp = await getTransactionOfClient(this.$route.params.clientId);

    this.transactionData = resp.docs
        .map(d => {
          const data = d.data() as Transaction;
          console.log(data.date);
          return {
            ...data,
            id: d.id,
          }
        })
        .sort((dataA, dataB) => dataB.date - dataA.date)
        .map((data: Transaction) => {
          console.log(data.date);
          return {
            companyId: data.companyId,
            narration: data.narration || "",
            clientId: data.clientId,
            type: data.type,
            date: formatDate(new Date(data.date)),
            internalDate: data.date,
            id: data.id,
            amount: data.amount,
            debit: formatCurrency(data.type === "debit" ? data.amount : 0),
            credit: formatCurrency(data.type === "debit" ? 0 : data.amount),
          }
        })
    this.isTableLoaded = true;
  }

  async deleteTransaction(transaction: FlatTransaction) {
    try {
      this.isTableLoaded = false;
      await deleteTransaction(transaction.id);
      await this.fetchTableData();
    } catch (e) {
      console.log(e);
    }
  }

  async mounted() {
    this.clientId = this.$route.params.clientId;
    try {
      const data = (await fetchClient(this.clientId)).data();
      if (data === undefined) {
        await this.$router.push('/');
        return;
      }
      this.client = {
        name: data.name,
        balance: data.balance,
        id: this.clientId
      };
      this.isLoaded = true;
      this.resetMeta();
      this.$nextTick(this.fetchTableData)
    } catch (e) {
      console.error(e);
    }
  }

  resetMeta() {
    this.newMeta = {
      narration: "",
      amount: 0,
      type: "credit",
      clientId: this.clientId,
      companyId: "1Wvrw3lk2ZvM63kVfE57",
      date: +new Date
    }
  }

  transformTransaction(transaction: FlatTransaction): Transaction {
    return {
      id: transaction.id,
      narration: transaction.narration,
      amount: transaction.amount,
      type: transaction.type,
      clientId: transaction.clientId,
      companyId: transaction.companyId,
      date: transaction.internalDate
    }
  }
}
</script>
<style>
.table-action-icons {
  width: 30px;
  height: 30px;
  margin-left: 6px;
  margin-right: 6px;
  border-radius: 6px;
  border: 1px solid #dedede;
}

[data-label="Actions"] {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.currency-field {
  font-variant-numeric: tabular-nums;
}

.table-actions .trans-wrapper {
  display: inline-block;
}

.table-actions .label {
  text-align: left;
}
</style>