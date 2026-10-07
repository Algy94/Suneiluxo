import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { money, useShop } from "@/lib/shop";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/use-is-admin";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    if (!(await checkIsAdmin())) throw redirect({ to: "/" });
  },
  head: () => ({
    meta: [
      { title: "Administração — Suneiluxo" },
      { name: "description", content: "Painel de pedidos e estado do MVP Suneiluxo." },
      { property: "og:title", content: "Administração — Suneiluxo" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:description", content: "Painel de pedidos da loja Suneiluxo." },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { lastOrder, count } = useShop();
  const [users, setUsers] = useState<string>("…");

  useEffect(() => {
    supabase.rpc("get_user_count").then(({ data, error }) => {
      setUsers(error ? "Sem acesso" : String(data ?? 0));
    });
  }, []);

  const stats = [
    { label: "Utilizadores cadastrados", value: users },
    { label: "Último pedido", value: lastOrder ? money(lastOrder.total) : "—" },
    { label: "Itens no carrinho atual", value: String(count) },
    { label: "SMS", value: "Por configurar" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Painel</p>
          <h1 className="mt-2 text-4xl">Administração</h1>
        </div>
        <span className="rounded-full border border-gold px-4 py-1 text-sm text-gold">
          ● MVP ativo
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5 shadow-luxe">
            <small className="text-muted-foreground">{s.label}</small>
            <b className="mt-2 block text-2xl">{s.value}</b>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border bg-card p-6">
        <h2 className="text-2xl">Último pedido</h2>
        {lastOrder ? (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              <b className="text-foreground">{lastOrder.id}</b> •{" "}
              {new Date(lastOrder.createdAt).toLocaleString("pt-MZ")}
            </p>
            {lastOrder.items.map((i) => (
              <div key={i.id} className="flex justify-between border-b pb-2 text-sm">
                <span>
                  {i.name} × {i.qty}
                </span>
                <b>{money(i.price * i.qty)}</b>
              </div>
            ))}
            <div className="flex justify-between pt-2 text-lg">
              <span>Total</span>
              <b>{money(lastOrder.total)}</b>
            </div>
            <p className="rounded-md bg-accent p-4 text-sm text-accent-foreground">
              📱 Este pedido está guardado apenas neste dispositivo. Para pedidos partilhados entre
              vários utilizadores e alerta por SMS, é preciso ativar a base de dados e o envio de
              mensagens.
            </p>
          </div>
        ) : (
          <p className="mt-3 text-muted-foreground">Nenhum pedido criado neste dispositivo.</p>
        )}
      </div>
    </div>
  );
}
