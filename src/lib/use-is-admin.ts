import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export async function checkIsAdmin(): Promise<boolean> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return false;
  const { data } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
  return !!data;
}

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    checkIsAdmin().then(setIsAdmin);
    const { data } = supabase.auth.onAuthStateChange(() => {
      checkIsAdmin().then(setIsAdmin);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return isAdmin;
}
