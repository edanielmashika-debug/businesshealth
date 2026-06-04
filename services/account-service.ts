import { supabase } from "../lib/supabase";

export async function deleteAccountData() {
    const{
        data: { user},

    } = 
      await supabase.auth.getUser();

      if(!user) {
        return;
      }

      const { error } = 
       await supabase
        .from("transactions")
        .delete()
        .eq("user_id", user.id);
      
      if(error){
        console.error(error);
      }

      await supabase.auth.signOut();
}