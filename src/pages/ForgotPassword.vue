<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleForgot">
      <p class="col-12 text-h5 text-center">Reset Password</p>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          type="email"
          label="Email"
          v-model="form.email"
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
          />

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
import { ref } from "vue";
import { useRouter } from "vue-router";
import useAuthUser from "src/composables/UseAuthUser";
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  name: "ForgotPasswordPage",

  setup() {
    const { notifyError, notifySuccess } = useNotify();
    const { sendPasswordRestEmail } = useAuthUser();
    const router = useRouter();

    const form = ref({
      email: "",
    });

    const handleForgot = async () => {
      try {
        await sendPasswordRestEmail(form.value.email);
        notifySuccess(`Send email to ${form.value.email}`);
        router.replace({
          name: "login",
        });
      } catch (error) {
        notifyError(error.message);
      }
    };

    return {
      form,
      handleForgot,
    };
  },
});
</script>
