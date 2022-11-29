<template>
  <q-page padding>
    <div class="row q-gutter-md">
      <div class="col-md-4 col-xs-12 col-sm-6">
        <card-dashboard
          table="categories"
          label="Categories"
          icon="category"
          route="category"
        />
      </div>

      <div class="col-md-4 col-xs-12 col-sm-6">
        <card-dashboard
          table="products"
          label="Products"
          icon="store"
          route="product"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import useAuthUser from "src/composables/UseAuthUser";

export default defineComponent({
  name: "MePage",

  components: {
    CardDashboard: defineAsyncComponent(() =>
      import("components/CardDashboard.vue")
    ),
  },

  setup() {
    const { user } = useAuthUser();

    return {
      user,
    };
  },
});
</script>
