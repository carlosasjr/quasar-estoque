<template>
  <q-page padding>
    <div class="row">
      <q-table
        :rows="data.list"
        :columns="columns"
        row-key="id"
        class="col-12"
        :loading="data.loading"
      >
        <template v-slot:top>
          <span class="text-h6">{{ data.title }}</span>
          <q-space />
          <q-btn
            :to="{ name: data.routeForm }"
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
            <q-btn
              flat
              dense
              size="sm"
              color="negative"
              icon="delete"
              @click="handleRemove(props.row)"
            >
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
    align: "left",
    label: "Actions",
    field: "actions",
    sortable: false,
  },
];

import { defineComponent, reactive, onMounted } from "vue";
import useApi from "src/composables/UserApi";
import useNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "PageCategory",
  setup() {
    onMounted(() => {
      handleList();
    });

    const { notifyError, notifySuccess } = useNotify();
    const { list, remove } = useApi();
    const router = useRouter();
    const $q = useQuasar();

    const data = reactive({
      title: "Categories",
      loading: true,
      resource: "categories",
      routeForm: "form-category",
      list: [],
    });

    const handleList = async () => {
      try {
        data.loading = true;
        data.list = await list(data.resource);
      } catch (error) {
        notifyError(error.message);
      } finally {
        data.loading = false;
      }
    };

    const handleEdit = (row) => {
      router.push({ name: data.routeForm, params: { id: row.id } });
    };

    const handleRemove = async (row) => {
      try {
        $q.dialog({
          title: "Confirm",
          message: "Do you really delete?",
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          await remove(data.resource, row.id);
          notifySuccess("Successfully deleted");
          handleList();
        });
      } catch (error) {
        notifyError(error.message);
      }
    };

    return {
      columns,
      data,
      handleEdit,
      handleRemove,
    };
  },
});
</script>
