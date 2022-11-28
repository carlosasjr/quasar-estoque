<template>
  <q-page padding>
    <div class="row">
      <q-select
        dense
        class="col-12"
        outlined
        label="Category"
        v-model="data.categoryId"
        :options="data.optionsCategories"
        option-value="id"
        option-label="name"
        map-options
        emit-value
        clearable
        @update:model-value="handleList"
      >
      </q-select>

      <q-table
        grid
        v-model:pagination="initialPagination"
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

    <div class="row justify-center">
      <q-pagination
        v-model="initialPagination.page"
        :max="pagesNumber"
        direction-links
        @update:model-value="handleScroolToTop"
      />
    </div>
  </q-page>
</template>
<script>
import { defineComponent, reactive, onMounted, computed } from "vue";
import useApi from "src/composables/UserApi";
import useNotify from "src/composables/UseNotify";
import { columns, initialPagination } from "./ColumnsTable";
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
      handleListCagegories();
      handleList();
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
      categoryId: "",
      optionsCategories: [],
      filter: "",
      showDialogDetails: false,
      productDetails: {},
    });

    const handleList = async () => {
      try {
        data.loading = true;
        if (data.categoryId) {
          data.list = await listByUser(
            data.resource,
            "category_id",
            data.categoryId
          );
        } else data.list = await listByUser(data.resource);
      } catch (error) {
        notifyError(error.message);
      } finally {
        data.loading = false;
      }
    };

    const handleListCagegories = async () => {
      try {
        data.optionsCategories = await listByUser("categories");
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleShowDetails = (product) => {
      data.productDetails = product;
      data.showDialogDetails = true;
    };

    const handleScroolToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return {
      columns,
      initialPagination,
      data,
      formatCurrency,
      handleShowDetails,
      handleList,
      handleScroolToTop,
      pagesNumber: computed(() =>
        Math.ceil(data.list.length / initialPagination.value.rowsPerPage)
      ),
    };
  },
});
</script>
