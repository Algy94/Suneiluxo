import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { products, type Category } from "@/lib/shop";
import logo from "@/assets/suneiluxo-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Suneiluxo — Cabelos humanos e joias femininas" },
      {
        name: "description",
        content:
          "Loja Suneiluxo: cabelos humanos, perucas premium e joias douradas com entrega em Moçambique.",
      },
      { property: "og:title", content: "Suneiluxo — Cabelos humanos e joias femininas" },
      {
        property: "og:description",
        content: "Peças selecionadas para transformar o seu estilo. Entrega em Moçambique.",
      },
    ],
  }),
  component: Index,
});

const categories: Category[] = ["Cabelos", "Joias", "Combos"];

function Index() {
  return (
    <div>
      <section className="bg-luxe px-4 py-20 text-center">
        <img src={logo.url} alt="Suneiluxo" className="mx-auto h-40 w-40 object-contain" />
        <p className="mt-6 text-xs uppercase tracking-[0.35em] text-gold">Cabelos & Joias</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-4xl leading-tight text-gold-soft sm:text-6xl">
          Realce a sua beleza,
          <br />
          <em className="text-gold-gradient">expresse o seu luxo.</em>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-gold-soft/70">
          Peças selecionadas para transformar o seu estilo.
        </p>
        <Link
          to="/produtos"
          className="mt-8 inline-flex rounded-md bg-gold px-8 py-3 text-sm font-medium uppercase tracking-widest text-primary-foreground transition hover:opacity-90"
        >
          Comprar agora
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl">Categorias</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c}
              to="/produtos"
              search={{ categoria: c }}
              className="flex items-center justify-between rounded-xl border bg-card px-6 py-8 shadow-luxe transition hover:border-gold"
            >
              <span className="font-display text-2xl">{c}</span>
              <span className="text-sm text-gold">Explorar →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl">Mais vendidos</h2>
          <Link to="/produtos" className="text-sm text-gold">
            Ver todos
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-center gap-4 rounded-2xl bg-luxe px-6 py-12 text-center sm:mx-auto sm:my-6">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Ofertas relâmpago</p>
        <h2 className="text-3xl text-gold-soft">Até 20% de desconto</h2>
        <p className="text-sm text-gold-soft/70">Seleção limitada enquanto houver stock.</p>
        <Link
          to="/produtos"
          className="rounded-md bg-gold px-6 py-3 text-sm uppercase tracking-widest text-primary-foreground"
        >
          Ver ofertas
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl">Novidades</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(4).map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
