<template>
  <q-card class="my-card" bordered v-riplle:primary>
    <q-skeleton animation="pulse-x" height="50px" v-if="data.load" />
    <q-card-section horizontal v-else>
      <div class="col flex flex-center text-h5">
        {{ data.count }} - {{ label }}
      </div>

      <q-card-actions vertical class="justify-around">
        <q-btn flat round color="primary" :icon="icon" :to="{ name: route }" />
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
import useApi from "src/composables/UserApi";
import { defineComponent, reactive, onMounted } from "vue";

export default defineComponent({
  name: "CardDashboard",

  props: {
    table: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    route: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      required: false,
      default: "mdi-database-outline",
    },
  },

  setup(props) {
    const data = reactive({
      count: 0,
      load: true,
    });

    const { fetchCount } = useApi();

    onMounted(async () => {
      const response = await fetchCount(props.table);

      data.count = response.count;

      data.load = false;
    });

    return {
      data,
    };
  },
});
</script>
