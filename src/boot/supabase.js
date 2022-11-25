import { createClient } from "@supabase/supabase-js";
import useAuthUser from "src/composables/UseAuthUser";

const supabaseUrl = "https://clyvwektjldrmrsoxbkb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNseXZ3ZWt0amxkcm1yc294YmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjkyOTI5MTAsImV4cCI6MTk4NDg2ODkxMH0.Iqq9TulbTVVvhBvMEbr1Vj0Mhq5N33zYqpK7RJKW8EY";
const supabase = createClient(supabaseUrl, supabaseKey);

supabase.auth.onAuthStateChange((event, session) => {
  const { user } = useAuthUser();

  user.value = session?.user || null;
});

export default function useSupabase() {
  return { supabase };
}
