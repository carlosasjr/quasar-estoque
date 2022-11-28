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
          <q-btn
            label="My Store"
            dense
            size="sm"
            outline
            class="q-ml-sm"
            @click="handleGoToMyStore"
            icon="store"
          />

          <q-btn
            label="Copy Link"
            dense
            size="sm"
            outline
            class="q-ml-sm"
            @click="handleCopyPublicUrl"
            icon="content_copy"
          />
          <q-space />
          <q-btn
            v-if="$q.platform.is.desktop"
            :to="{ name: data.routeName }"
            dense
            label="Add New"
            color="primary"
            icon="add"
          />
        </template>

        <template v-slot:body-cell-img_url="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-avatar v-if="props.row.img_url">
              <img :src="props.row.img_url" :alt="props.row.name" />
            </q-avatar>
            <q-avatar v-else color="grey" text-color="white" icon="image" />
          </q-td>
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
    <q-page-sticky
      v-if="$q.platform.is.mobile"
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn fab icon="add" color="primary" :to="{ name: data.routeName }" />
    </q-page-sticky>
  </q-page>
</template>
<script>
import { defineComponent, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar, openURL, copyToClipboard } from "quasar";
import useApi from "src/composables/UserApi";
import useNotify from "src/composables/UseNotify";
import { columns } from "./ColumnsTable";
import useAuthUser from "src/composables/UseAuthUser";

export default defineComponent({
  name: "PageProduct",
  setup() {
    onMounted(() => {
      handleList();
    });

    const { notifyError, notifySuccess } = useNotify();
    const { listByUser, remove } = useApi();
    const router = useRouter();
    const $q = useQuasar();
    const { user } = useAuthUser();

    const data = reactive({
      title: "Products",
      loading: true,
      resource: "products",
      routeName: "form-product",
      list: [],
    });

    const handleList = async () => {
      try {
        data.loading = true;
        data.list = await listByUser(data.resource, user.value.id);
      } catch (error) {
        notifyError(error.message);
      } finally {
        data.loading = false;
      }
    };

    const handleEdit = (row) => {
      router.push({ name: data.routeName, params: { id: row.id } });
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

    const handleGoToMyStore = () => {
      // router.push({ name: "product-public", params: { id: user.value.id } });

      const link = router.resolve({
        name: "product-public",
        params: { id: user.value.id },
      });

      openURL(window.origin + link.href);
    };

    const handleCopyPublicUrl = () => {
      const link = router.resolve({
        name: "product-public",
        params: { id: user.value.id },
      });

      const externalLink = window.origin + link.href;

      copyToClipboard(externalLink)
        .then(() => {
          notifySuccess("Successfully copied");
        })
        .catch(() => {
          notifyError("Error copied link");
        });
    };

    return {
      columns,
      data,
      handleEdit,
      handleRemove,
      handleGoToMyStore,
      handleCopyPublicUrl,
    };
  },
});
</script>
