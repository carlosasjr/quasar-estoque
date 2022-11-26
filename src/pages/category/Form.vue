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
          label="Name"
          v-model="data.form.name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Name is required']"
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
          :to="{ name: 'category' }"
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
  name: "FormCategory",

  setup() {
    const router = useRouter();
    const route = useRoute();
    const { post, getById, update } = useApi();
    const { notifyError, notifySuccess } = useNotify();

    const isUpdate = computed(() => route.params.id);

    onMounted(() => {
      if (isUpdate.value) {
        handleGet(isUpdate.value);
      }
    });

    const data = reactive({
      title: "Form Category",
      loading: false,
      resource: "categories",
      routeName: "category",
      form: {
        name: "",
      },
    });

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
