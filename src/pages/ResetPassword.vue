<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleResetPassword">
      <p class="col-12 text-h5 text-center">Reset Password</p>

      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input
          type="password"
          label="New Password"
          v-model="data.form.newPassword"
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
            label="Send new password"
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
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import useAuthUser from "src/composables/UseAuthUser";
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  name: "ResetPasswordPage",

  setup() {
    const { resetPassword } = useAuthUser();
    const { notifyError, notifySuccess } = useNotify();
    const router = useRouter();
    const route = useRoute();
    const token = route.query.token;

    const data = reactive({
      loading: false,
      form: {
        newPassword: "",
      },
    });

    const handleResetPassword = async () => {
      try {
        data.loading = true;
        await resetPassword(token, data.form.newPassword);
        notifySuccess("New password create successfully");

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
      handleResetPassword,
    };
  },
});
</script>
