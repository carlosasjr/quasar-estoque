<template>
  <q-page padding>
    <div class="row">
      <q-table
        grid
        hide-pagination
        :rows="data.list"
        :columns="columns"
        :filter="data.filter"
        row-key="id"
        class="col-12"
        :loading="data.loading"
      >
        <template v-slot:top>
          <span class="text-h6">{{ data.title }}</span>
          <q-space />
          <q-input
            outlined
            dense
            debounce="300"
            v-model="data.filter"
            placeholder="Search"
            class="q-mr-sm"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:item="props">
          <transition-group
            appear
            enter-active-class="animated fadeInLeft"
            leave-active-class="animated fadeOutRight"
          >
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3" key="card">
              <q-card
                class="cursor-pointer"
                v-ripple:primary
                @click="handleShowDetails(props.row)"
              >
                <q-img :src="props.row.img_url" :ratio="4 / 3" />
                <q-card-section class="text-center">
                  <div class="text-h6">{{ props.row.name }}</div>
                  <div class="text-subtitle2">
                    {{ formatCurrency(props.row.price) }}
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div
              class="col-12"
              v-if="props.rowIndex === 3 && brand.paralax_url"
              key="paralax"
            >
              <q-parallax :height="200" :speed="0.5">
                <template v-slot:media>
                  <img :src="brand.paralax_url" />
                </template>

                <h3 class="text-white">{{ brand.name }}</h3>
              </q-parallax>
            </div>
          </transition-group>
        </template>
      </q-table>

      <dialog-product-details
        :show="data.showDialogDetails"
        :product="data.productDetails"
        @hideDialog="data.showDialogDetails = false"
      />
    </div>
  </q-page>
</template>
<script>
import { defineComponent, reactive, onMounted } from "vue";
import useApi from "src/composables/UserApi";
import useNotify from "src/composables/UseNotify";
import { columns } from "./ColumnsTable";
import { useRoute } from "vue-router";
import { formatCurrency } from "src/utils/format";
import DialogProductDetails from "components/DialogProductDetails.vue";

export default defineComponent({
  name: "PageProductPublic",

  components: {
    DialogProductDetails,
  },

  setup() {
    onMounted(() => {
      if (route.params.id) {
        handleList(route.params.id);
      }
    });

    const { notifyError } = useNotify();
    const { listByUser } = useApi();
    const route = useRoute();

    const data = reactive({
      title: "Products",
      loading: true,
      resource: "products",
      routeName: "form-product",
      list: [],
      filter: "",
      showDialogDetails: false,
      productDetails: {},
    });

    const handleList = async (userId) => {
      try {
        data.loading = true;
        data.list = await listByUser(data.resource, userId);
      } catch (error) {
        notifyError(error.message);
      } finally {
        data.loading = false;
      }
    };

    const handleShowDetails = (product) => {
      data.productDetails = product;
      data.showDialogDetails = true;
    };

    return {
      columns,
      data,
      formatCurrency,
      handleShowDetails,
    };
  },
});
</script>
