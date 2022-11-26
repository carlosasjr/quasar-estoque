import useSupabase from "src/boot/supabase";
import useAuthUser from "./UseAuthUser";
import { uid } from "quasar";

export default function useApi() {
  const { supabase } = useSupabase();
  const { user } = useAuthUser();

  const list = async (table) => {
    const { data, error } = await supabase.from(table).select("*");

    if (error) throw error;

    return data;
  };

  const listByUser = async (table, user_id) => {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("user_id", user_id);

    if (error) throw error;

    return data;
  };

  const getById = async (table, id) => {
    let { data, error } = await supabase.from(table).select("*").eq("id", id);

    if (error) throw error;

    return data[0];
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
    list,
    listByUser,
    getById,
    post,
    update,
    remove,
    uploadImg,
  };
}
