import useSupabase from "src/boot/supabase";
import useAuthUser from "./UseAuthUser";

export default function useApi() {
  const { supabase } = useSupabase();
  const { user } = useAuthUser();

  const list = async (table) => {
    const { data, error } = await supabase.from(table).select("*");

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

  return {
    list,
    getById,
    post,
    update,
    remove,
  };
}
