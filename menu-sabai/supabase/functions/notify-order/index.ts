// Menu Sabai — sends a LINE message to the merchant when a new order comes in.
// Deploy: supabase functions deploy notify-order
// Then wire it up in Supabase → Database → Webhooks: on INSERT into `orders`, call this function.
// Secret needed (Project Settings → Edge Functions → Secrets): LINE_CHANNEL_ACCESS_TOKEN

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const LINE_CHANNEL_ACCESS_TOKEN = Deno.env.get("LINE_CHANNEL_ACCESS_TOKEN")!;

Deno.serve(async (req) => {
  const payload = await req.json();
  const order = payload.record;

  const { data: merchant, error } = await supabase
    .from("merchants")
    .select("restaurant_name, line_user_id")
    .eq("id", order.merchant_id)
    .single();

  if (error || !merchant?.line_user_id) {
    return new Response("no line_user_id for this merchant, skipped", { status: 200 });
  }

  const itemLines = order.items
    .map((item: { name: string; qty: number }) => `• ${item.qty}x ${item.name}`)
    .join("\n");

  const message =
    `Nouvelle commande — ${merchant.restaurant_name}\n` +
    (order.table_label ? `Table : ${order.table_label}\n` : "") +
    `${itemLines}\n` +
    `Total : ${order.total} ฿`;

  const response = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      to: merchant.line_user_id,
      messages: [{ type: "text", text: message }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    return new Response(`LINE push failed: ${detail}`, { status: 502 });
  }

  return new Response("notified", { status: 200 });
});
