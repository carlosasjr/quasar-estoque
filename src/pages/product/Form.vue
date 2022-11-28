<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">{{ data.title }}</p>
      </div>
      <q-form
        class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
        @submit.prevent="handleSubmit"
      >
        <q-input
          type="file"
          accept="image/*"
          label="Image"
          stack-label
          v-model="data.image"
        />

        <q-input
          label="Name"
          v-model="data.form.name"
          lazy-rules
          :rules="[(val) => !!val || 'Name is required']"
        />

        <q-editor v-model="data.form.description" min-height="5rem" />

        <q-input
          type="number"
          label="Amount"
          v-model="data.form.amount"
          lazy-rules
          :rules="[(val) => !!val || 'Amount is required']"
        />

        <q-input
          type="number"
          label="Price"
          prefix="R$"
          v-model="data.form.price"
          lazy-rules
          :rules="[(val) => !!val || 'Price is required']"
        />

        <q-select
          v-model="data.form.category_id"
          :options="data.optionsCategory"
          option-value="id"
          option-label="name"
          map-options
          emit-value
          label="Category"
          :rules="[(val) => !!val || 'Category is required']"
        />

        <q-btn
          type="submit"
          :label="isUpdate ? 'Update' : 'Save'"
          color="primary"
          class="full-width"
          rounded
          :loading="data.loading"
        >
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            Saving...
          </template>
        </q-btn>

        <q-btn
          label="Cancel"
          color="primary"
          class="full-width"
          rounded
          flat
          :to="{ name: data.routeName }"
        />
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, reactive, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useApi from "src/composables/UserApi";
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  name: "FormProduct",

  setup() {
    const router = useRouter();
    const route = useRoute();
    const { post, getById, update, listByUser, uploadImg } = useApi();
    const { notifyError, notifySuccess } = useNotify();

    const isUpdate = computed(() => route.params.id);

    onMounted(() => {
      handleListCategories();

      if (isUpdate.value) {
        handleGet(isUpdate.value);
      }
    });

    const data = reactive({
      title: "Form Product",
      loading: false,
      resource: "products",
      routeName: "product",
      optionsCategory: [],
      image: [],
      form: {
        name: "",
        description: "",
        amount: 0,
        price: 0,
        category_id: "",
        img_url: "",
      },
    });

    const handleListCategories = async () => {
      data.optionsCategory = await listByUser("categories");
    };

    const handleGet = async (id) => {
      try {
        data.form = await getById(data.resource, id);
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleSubmit = async () => {
      try {
        data.loading = true;

        if (data.image.length > 0) {
          const imgUrl = await uploadImg(data.image[0], "products");

          data.form.img_url = imgUrl;
        }

        if (isUpdate.value) {
          await update(data.resource, data.form);
          notifySuccess("Updated successfully");
        } else {
          await post(data.resource, data.form);
          notifySuccess("Saved successfully");
        }

        router.push({ name: data.routeName });
      } catch (error) {
        notifyError(error.message);
      } finally {
        data.loading = false;
      }
    };

    return {
      data,
      handleSubmit,
      isUpdate,
    };
  },
});
</script>

<style></style>
