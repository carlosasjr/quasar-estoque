<template>
  <q-page padding>
    <div class="row">
      <q-table
        title="Category"
        :rows="categories"
        :columns="columns"
        row-key="id"
        class="col-12"
      >
        <template v-slot:top>
          <span class="text-h6">Category</span>
          <q-space />
          <q-btn label="Add New" color="primary" />
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn flat dense size="sm" color="info" icon="edit">
              <q-tooltip>Edit</q-tooltip>
            </q-btn>
            <q-btn flat dense size="sm" color="negative" icon="delete">
              <q-tooltip>Delete</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script>
const columns = [
  {
    name: "id",
    align: "left",
    label: "ID",
    field: "id",
    sortable: true,
  },
  {
    name: "name",
    align: "left",
    label: "Name",
    field: "name",
    sortable: true,
  },
  {
    name: "actions",
    align: "rigth",
    label: "Actions",
    field: "actions",
    sortable: false,
  },
];

import { defineComponent, ref, onMounted } from "vue";
import useApi from "src/composables/UserApi";
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  name: "PageCategory",
  setup() {
    onMounted(() => {
      handleListCategories();
    });

    const { notifyError } = useNotify();
    const categories = ref([]);
    const { list } = useApi();

    const handleListCategories = async () => {
      try {
        categories.value = await list("categories");
      } catch (error) {
        notifyError(error.message);
      }
    };

    return {
      columns,
      categories,
    };
  },
});
</script>
