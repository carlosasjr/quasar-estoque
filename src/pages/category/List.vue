<template>
  <q-page padding>
    <div class="row">
      <q-table
        title="Category"
        :rows="data.categories"
        :columns="columns"
        row-key="id"
        class="col-12"
        :loading="data.loading"
      >
        <template v-slot:top>
          <span class="text-h6">Category</span>
          <q-space />
          <q-btn
            :to="{ name: 'form-category' }"
            dense
            label="Add New"
            color="primary"
            icon="add"
          />
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              flat
              dense
              size="sm"
              color="info"
              icon="edit"
              @click="handleEdit(props.row)"
            >
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

import { defineComponent, reactive, onMounted } from "vue";
import useApi from "src/composables/UserApi";
import useNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "PageCategory",
  setup() {
    onMounted(() => {
      handleListCategories();
    });

    const { notifyError } = useNotify();
    const { list } = useApi();
    const router = useRouter();

    const data = reactive({
      loading: true,
      resource: "categories",
      categories: [],
    });

    const handleListCategories = async () => {
      try {
        data.loading = true;
        data.categories = await list(data.resource);
      } catch (error) {
        notifyError(error.message);
      } finally {
        data.loading = false;
      }
    };

    const handleEdit = (category) => {
      router.push({ name: "form-category", params: { id: category.id } });
    };

    return {
      columns,
      data,
      handleEdit,
    };
  },
});
</script>
