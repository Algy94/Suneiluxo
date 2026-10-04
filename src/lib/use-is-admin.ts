import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export async function checkIsAdmin(): Promise<boolean> {
  const { data: s } = await supabase.auth.getSession();
  if (!s.session) return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.rpc as any)("is_admin");
  return data === true;
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
