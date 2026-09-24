import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { products, type Category } from "@/lib/shop";

type Search = { categoria?: "Todos" | Category };

export const Route = createFileRoute("/produtos")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const c = search["categoria"];
    return typeof c === "string" && ["Todos", "Cabelos", "Joias", "Combos"].includes(c)
      ? { categoria: c as "Todos" | Category }
      : {};
  },
  head: () => ({
    meta: [
      { title: "Catálogo — Suneiluxo" },
      {
        name: "description",
        content: "Cabelos humanos, perucas, joias e combos Suneiluxo com preços em meticais.",
      },
      { property: "og:title", content: "Catálogo — Suneiluxo" },
      {
        property: "og:description",
        content: "Explore cabelos, joias e combos exclusivos da Suneiluxo.",
      },
    ],
  }),
  component: Produtos,
});

const tabs = ["Todos", "Cabelos", "Joias", "Combos"] as const;

function Produtos() {
  const { categoria = "Todos" } = Route.useSearch();
  const navigate = useNavigate({ from: "/produtos" });
  const [search, setSearch] = useState("");

  const filtered = products.filter(
    (p) =>
      (categoria === "Todos" || p.category === categoria) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.3em] text-gold">Catálogo</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl">{categoria === "Todos" ? "Todos os produtos" : categoria}</h1>
        <span className="text-sm text-muted-foreground">{filtered.length} produtos</span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => navigate({ search: { categoria: t } })}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              categoria === t
                ? "border-gold bg-gold/15 text-foreground"
                : "text-muted-foreground hover:border-gold"
            }`}
          >
            {t}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar cabelos, joias..."
          className="ml-auto w-full rounded-md border bg-card px-4 py-2 text-sm outline-none focus:border-gold sm:w-64"
        />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
      {!filtered.length && (
        <p className="py-16 text-center text-muted-foreground">Nenhum produto encontrado.</p>
      )}
    </div>
  );
}
