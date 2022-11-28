<template>
  <q-dialog
    :full-width="$q.platform.is.mobile"
    :model-value="show"
    @before-hide="handleClose"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">Details</div>
      </q-card-section>

      <q-card-section>
        <q-img :src="product.img_url" :ratio="4 / 3" style="min-width: 300px" />
      </q-card-section>

      <q-card-section>
        <div class="text-h6">{{ product.name }}</div>
        <div class="text-subtitle">{{ formatCurrency(product.price) }}</div>
        <div class="text-body2" v-html="product.description"></div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn outline label="Cancel" color="primary" v-close-popup />
        <q-btn
          v-if="brand.phone"
          label="Buy on whatsapp"
          icon="mdi-whatsapp"
          color="green-7"
          @click="handleSendWpp"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { formatCurrency } from "src/utils/format";
import { openURL } from "quasar";
import useApi from "src/composables/UserApi";

export default defineComponent({
  name: "DialogProductDetails",

  props: {
    show: {
      tyṕe: Boolean,
      required: true,
    },

    product: {
      type: Object,
    },
  },

  setup(props, { emit }) {
    const message = "Olá, fiquei interessado no produto: ";
    const { brand } = useApi();

    const handleClose = () => {
      emit("hideDialog");
    };

    const handleSendWpp = () => {
      const link = encodeURI(
        `https://api.whatsapp.com/send?phone=55${
          brand.value.phone
        }&text=${message} - ${props.product.name} - ${formatCurrency(
          props.product.price
        )}`
      );

      openURL(link);
    };

    return {
      formatCurrency,
      handleSendWpp,
      handleClose,
      brand,
    };
  },
});
</script>
