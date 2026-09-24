import { Heart, Star } from "lucide-react";
import { money, useShop, type Product } from "@/lib/shop";

export function ProductCard({ p }: { p: Product }) {
  const { add, favorites, toggleFavorite } = useShop();
  const fav = favorites.includes(p.id);

  return (
    <article className="group overflow-hidden rounded-xl border bg-card shadow-luxe transition hover:-translate-y-1">
      <div className="relative aspect-4/5 overflow-hidden bg-secondary">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        {p.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-[11px] uppercase tracking-widest text-gold">
            {p.tag}
          </span>
        )}
        <button
          type="button"
          aria-label="Favorito"
          onClick={() => toggleFavorite(p.id)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 text-foreground transition hover:text-gold"
        >
          <Heart className="h-4 w-4" fill={fav ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="space-y-2 p-4">
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-gold text-gold" />
          {p.rating.toFixed(1)}
        </p>
        <h3 className="text-lg leading-snug">{p.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-semibold">{money(p.price)}</span>
          {p.oldPrice && (
            <del className="text-sm text-muted-foreground">{money(p.oldPrice)}</del>
          )}
        </div>
        <button
          type="button"
          onClick={() => add(p)}
          className="mt-2 w-full rounded-md border border-gold bg-gold/10 px-4 py-2 text-sm font-medium tracking-wide text-foreground transition hover:bg-gold hover:text-primary-foreground"
        >
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  );
}
