<template>
  <div class="trans-wrapper">
    <div class="trans-trigger" @click="isPopupVisible = true">
      <slot v-if="$slots.trigger" name="trigger"/>
      <b-button v-else :class="customClass">{{ triggerName }}</b-button>
    </div>
    <CRUDTransactionModal
        :show="isPopupVisible"
        :transaction="meta"
        @dismiss="dismissPopup"
        @primaryAction="onPrimaryAction"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {addTransaction, updateTransaction} from "@/api";
import CRUDTransactionModal from "@/components/transaction/CRUDTransactionModal.vue";
import {Watch} from "vue-property-decorator";
// eslint-disable-next-line no-unused-vars
import {Transaction} from "@/types/types";

@Component({
  name: 'CRUDTransaction',
  components: {CRUDTransactionModal},
  props: {
    triggerName: {
      type: String,
      default: "Add"
    },
    customClass: {
      type: String,
      default: ""
    },
    meta: {
      type: Object,
      required: true
    }
  }
})
export default class CRUDTransaction extends Vue {
  meta!: Transaction;
  isPopupVisible = false;
  isError = false;
  errorMessage = "";
  CRUDType: "ADD" | "EDIT" = "ADD";
  tempMeta: Transaction = this.meta;

  dismissPopup() {
    this.isPopupVisible = false;
    this.resetMeta();
  }

  resetMeta() {
    this.meta.amount = this.tempMeta.amount;
    this.meta.clientId = this.tempMeta.clientId;
    this.meta.companyId = this.tempMeta.companyId;
    this.meta.date = this.tempMeta.date;
    this.meta.narration = this.tempMeta.narration;
    this.meta.id = this.tempMeta.id;
  }

  mounted() {
    this.CRUDType = this.meta.id ? "EDIT" : "ADD";
  }

  @Watch('clientName')
  onTextChange() {
    this.isError = false;
    this.errorMessage = "";
  }

  async onPrimaryAction() {
    if (this.CRUDType === "ADD") {
      await this.addTransaction();
    } else {
      await this.updateTransaction();
    }
  }

  async addTransaction() {
    try {
      await addTransaction(this.meta);
      this.dismissPopup();
      this.$emit('update');
    } catch (e) {
      console.error(e);
    }
  }


  async updateTransaction() {
    try {
      await updateTransaction(this.meta.id, this.meta);
      this.dismissPopup();
      this.$emit('update');
    } catch (e) {
      console.log(e);
    }
  }

}
</script>