import { formatCurrency } from "src/utils/format";
import { ref } from "vue";

const columns = [
  {
    name: "id",
    align: "left",
    label: "ID",
    field: "id",
    sortable: true,
  },
  {
    name: "img_url",
    align: "left",
    label: "Image",
    field: "img_url",
    sortable: false,
  },

  {
    name: "name",
    align: "left",
    label: "Name",
    field: "name",
    sortable: true,
  },
  {
    name: "amount",
    align: "left",
    label: "Amount",
    field: "amount",
    sortable: true,
  },
  {
    name: "price",
    align: "left",
    label: "Price",
    field: "price",
    sortable: true,
    format: (val) => formatCurrency(val),
  },

  {
    name: "actions",
    align: "left",
    label: "Actions",
    field: "actions",
    sortable: false,
  },
];

const initialPagination = ref({
  page: 1,
  rowsPerPage: 8,
});

export { columns, initialPagination };
