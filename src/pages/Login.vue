<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleLogin">
      <p class="col-12 text-h5 text-center">Login</p>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
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
          :rules="[(val) => (val && val.length > 0) || 'Password is required']"
        />
        <div class="full-width q-pt-md">
          <q-btn
            label="Login"
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
        </div>

        <div class="full-width q-gutter-y-sm">
          <q-btn
            label="Register"
            color="primary"
            class="full-width"
            flat
            rounded
            size="sm"
            to="/register"
          />

          <q-btn
            label="Forgot Password"
            color="primary"
            class="full-width"
            flat
            rounded
            size="sm"
            to="/forgot-password"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, reactive, onMounted } from "vue";
import useAuthUser from "src/composables/UseAuthUser";
import useNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "PageLogin",

  setup() {
    onMounted(() => {
      if (isLoggedIn()) {
        router.push({ name: "me" });
      }
    });

    const router = useRouter();
    const { login, isLoggedIn } = useAuthUser();
    const { notifyError, notifySuccess } = useNotify();

    const data = reactive({
      loading: false,
      form: {
        email: "",
        password: "",
      },
    });

    const handleLogin = async () => {
      try {
        data.loading = true;
        await login(data.form);
        notifySuccess("Login successfully!");
        router.push({ name: "me" });
      } catch (error) {
        notifyError(error.message);
      } finally {
        data.loading = false;
      }
    };

    return {
      data,
      handleLogin,
    };
  },
});
</script>
