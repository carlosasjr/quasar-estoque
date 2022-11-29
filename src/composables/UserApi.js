import useSupabase from "src/boot/supabase";
import useAuthUser from "./UseAuthUser";
import useBrand from "./useBrand";
import { uid } from "quasar";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { useQuasar } from "quasar";

const brand = ref({
  name: "",
  primary: "",
  secondary: "",
  phone: "",
  paralax_url: "",
});

export default function useApi() {
  const { supabase } = useSupabase();
  const { user } = useAuthUser();
  const { setBrand } = useBrand();
  const route = useRoute();
  const $q = useQuasar();

  const list = async (table) => {
    const { data, error } = await supabase.from(table).select("*");

    if (error) throw error;

    return data;
  };

  const listByUser = async (table, columnFilter = "", filter = "") => {
    const id = route.params.id || user?.value?.id;

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", id)
      .eq(columnFilter, filter);

    if (error) throw error;

    return data;
  };

  const fetchCount = async (table) => {
    const id = route.params.id || user?.value?.id;

    const { data, error, count } = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .eq("user_id", id);

    if (error) throw error;

    return { data, count };
  };

  const getById = async (table, id) => {
    let { data, error } = await supabase.from(table).select("*").eq("id", id);

    if (error) throw error;

    return data[0];
  };

  const getBrand = async () => {
    const id = route.params.id || user?.value?.id;

    if (id) {
      $q.loading.show();
      let { data, error } = await supabase
        .from("config")
        .select("*")
        .eq("user_id", id);

      if (error) throw error;

      if (data.length > 0) {
        brand.value = data[0];

        setBrand(brand.value.primary, brand.value.secondary);
      }

      $q.loading.hide();

      return data[0];
    }
  };

  const post = async (table, formData) => {
    let { data, error } = await supabase
      .from(table)
      .insert([{ ...formData, user_id: user.value.id }]);

    if (error) throw error;

    return data;
  };

  const update = async (table, formData) => {
    let { data, error } = await supabase
      .from(table)
      .update({ ...formData })
      .match({ id: formData.id });

    if (error) throw error;

    return data;
  };

  const remove = async (table, id) => {
    let { data, error } = await supabase.from(table).delete().match({ id });

    if (error) throw error;

    return data;
  };

  const uploadImg = async (file, storage) => {
    const fileName = uid();

    const { error } = supabase.storage.from(storage).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

    const publicUrl = await getUrlPublic(fileName, storage);

    if (error) throw error;

    return publicUrl;
  };

  const getUrlPublic = async (fileName, storage) => {
    const { publicURL, error } = supabase.storage
      .from(storage)
      .getPublicUrl(fileName);
    if (error) throw error;

    return publicURL;
  };

  return {
    brand,
    list,
    listByUser,
    fetchCount,
    getById,
    getBrand,
    post,
    update,
    remove,
    uploadImg,
  };
}
