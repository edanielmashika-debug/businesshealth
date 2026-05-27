import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const authHeader =
      req.headers.get(
        "Authorization"
      );

    if (!authHeader) {
      return new Response(
        "Unauthorized",
        {
          status: 401,
        }
      );
    }

    const supabase =
      createClient(
        Deno.env.get(
          "SUPABASE_URL"
        )!,
        Deno.env.get(
          "SUPABASE_SERVICE_ROLE_KEY"
        )!,
        {
          global: {
            headers: {
              Authorization:
                authHeader,
            },
          },
        }
      );

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      return new Response(
        "User not found",
        {
          status: 404,
        }
      );
    }

    await supabase
      .from("debts")
      .delete()
      .eq("user_id", user.id);

    await supabase
      .from("transactions")
      .delete()
      .eq("user_id", user.id);

    const { error } =
      await supabase.auth.admin.deleteUser(
        user.id
      );

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify(error),
      {
        status: 500,
      }
    );
  }
});