import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { money, useShop } from "@/lib/shop";

export const Route = createFileRoute("/_authenticated/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho — Suneiluxo" },
      { name: "description", content: "Reveja os seus produtos e finalize a compra na Suneiluxo." },
      { property: "og:title", content: "Carrinho — Suneiluxo" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:description", content: "Finalize a sua compra de cabelos e joias." },
    ],
  }),
  component: Carrinho,
});

function Carrinho() {
  const { cart, total, setQty, remove, add, checkout } = useShop();
  const navigate = useNavigate();

  if (!cart.length) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h1 className="text-3xl">O seu carrinho está vazio.</h1>
        <Link
          to="/produtos"
          className="mt-6 inline-flex rounded-md bg-gold px-6 py-3 text-sm uppercase tracking-widest text-primary-foreground"
        >
          Explorar produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl">O seu carrinho</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {cart.map((i) => (
            <div key={i.id} className="flex gap-4 rounded-xl border bg-card p-4">
              <img
                src={i.image}
                alt={i.name}
                className="h-28 w-24 rounded-md object-cover"
                loading="lazy"
              />
              <div className="flex-1">
                <h3 className="text-lg">{i.name}</h3>
                <p className="text-sm text-muted-foreground">{money(i.price)}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Menos"
                    onClick={() => setQty(i.id, i.qty - 1)}
                    className="grid h-8 w-8 place-items-center rounded-md border"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <b className="w-6 text-center">{i.qty}</b>
                  <button
                    type="button"
                    aria-label="Mais"
                    onClick={() => add(i)}
                    className="grid h-8 w-8 place-items-center rounded-md border"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i.id)}
                    className="ml-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remover
                  </button>
                </div>
              </div>
              <b className="whitespace-nowrap">{money(i.price * i.qty)}</b>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-xl border bg-card p-6 shadow-luxe">
          <h2 className="text-2xl">Resumo</h2>
          <div className="mt-4 flex justify-between text-sm">
            <span>Subtotal</span>
            <b>{money(total)}</b>
          </div>
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>Entrega</span>
            <span>A calcular</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between text-lg">
            <span>Total</span>
            <b>{money(total)}</b>
          </div>
          <button
            type="button"
            onClick={() => {
              const order = checkout();
              if (order) navigate({ to: "/" });
            }}
            className="mt-6 w-full rounded-md bg-gold px-6 py-3 text-sm uppercase tracking-widest text-primary-foreground transition hover:opacity-90"
          >
            Finalizar compra
          </button>
        </aside>
      </div>
    </div>
  );
}
