<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleForgot">
      <p class="col-12 text-h5 text-center">Reset Password</p>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          type="email"
          label="Email"
          v-model="data.form.email"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Email is required']"
        />
        <div class="full-width q-pt-md q-gutter-y-sm">
          <q-btn
            label="Send Reset Email"
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
  name: "ForgotPasswordPage",

  setup() {
    const { notifyError, notifySuccess } = useNotify();
    const { sendPasswordRestEmail } = useAuthUser();
    const router = useRouter();

    const data = reactive({
      loading: false,
      form: {
        email: "",
      },
    });

    const handleForgot = async () => {
      try {
        data.loading = true;
        await sendPasswordRestEmail(data.form.email);
        notifySuccess(`Send email to ${data.form.email}`);
        router.replace({
          name: "login",
        });
      } catch (error) {
        notifyError(error.message);
      } finally {
        data.loading = false;
      }
    };

    return {
      data,
      handleForgot,
    };
  },
});
</script>
