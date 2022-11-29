<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleRegister">
      <p class="col-12 text-h5 text-center">Register</p>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          label="Name"
          v-model="data.form.name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Name is required']"
        />
        <q-input
          type="email"
          label="Email"
          v-model="data.form.email"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Email is required']"
        />
        <q-input
          type="password"
          label="Senha"
          v-model="data.form.password"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Password is required',
            (val) =>
              (val && val.length >= 6) ||
              'Password should be at least 6 characters',
          ]"
        />
        <div class="full-width q-pt-md q-gutter-y-sm">
          <q-btn
            label="Registrar"
            color="primary"
            class="full-width"
            outline
            rounded
            size="lg"
            type="submit"
            :loading="data.loading"
            :disable="data.loading"
          >
            <template v-slot:loading>
              <q-spinner-hourglass class="on-left" />
              Loading...
            </template>
          </q-btn>

          <q-btn
            label="Back"
            color="dark"
            class="full-width"
            rounded
            flat
            size="lg"
            to="/login"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { reactive } from "vue";
import { useRouter } from "vue-router";
import useAuthUser from "src/composables/UseAuthUser";
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  name: "RegisterPage",

  setup() {
    const { register } = useAuthUser();
    const router = useRouter();
    const { notifyError, notifySuccess } = useNotify();

    const data = reactive({
      loading: false,
      form: {
        name: "",
        email: "",
        password: "",
      },
    });

    const handleRegister = async () => {
      try {
        data.loading = true;
        await register(data.form);
        notifySuccess("Registered successfully");
        router.push({
          name: "email-confirmation",
          query: { email: data.email },
        });
      } catch (error) {
        notifyError(error.message);
      } finally {
        data.loading = false;
      }
    };

    return {
      data,
      handleRegister,
    };
  },
});
</script>
