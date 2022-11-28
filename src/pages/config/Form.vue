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
          label="Paralax"
          stack-label
          v-model="data.image"
        />

        <q-input
          label="Store Name"
          v-model="data.form.name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Name is required']"
        />

        <q-input
          label="Phone"
          v-model="data.form.phone"
          mask="(##)#####-####"
          unmasked-value
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Phone is required']"
        />

        <div class="row justify-center q-gutter-md q-pa-md">
          <q-color
            v-model="data.form.primary"
            class="col-md-4 col-sm-12 col-xs-12"
          ></q-color>

          <q-color
            v-model="data.form.secondary"
            class="col-md-4 col-sm-12 col-xs-12"
          ></q-color>
        </div>

        <q-btn
          type="submit"
          label="Save"
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
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import useApi from "src/composables/UserApi";
import useNotify from "src/composables/UseNotify";
import useBrand from "src/composables/useBrand";

export default defineComponent({
  name: "FormConfig",

  setup() {
    const { post, getBrand, update, uploadImg } = useApi();
    const { notifyError, notifySuccess } = useNotify();
    const router = useRouter();
    const { setBrand } = useBrand();

    onMounted(() => {
      handleGet();
    });

    const data = reactive({
      title: "Form Config",
      loading: false,
      resource: "config",
      routeName: "me",
      image: [],
      form: {
        id: "",
        name: "",
        primary: "",
        secondary: "",
        phone: "",
        paralax_url: "",
      },
    });

    const handleGet = async () => {
      try {
        data.form = await getBrand();
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleSubmit = async () => {
      try {
        data.loading = true;

        if (data.image.length > 0) {
          const imgUrl = await uploadImg(data.image[0], "paralax");

          data.form.paralax_url = imgUrl;
        }

        if (data.form.id !== "") {
          await update(data.resource, data.form);
          notifySuccess("Updated successfully");
        } else {
          await post(data.resource, data.form);
          notifySuccess("Saved successfully");
        }

        setBrand(data.form.primary, data.form.secondary);
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
    };
  },
});
</script>

<style></style>
