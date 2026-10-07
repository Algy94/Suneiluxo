import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Heart, ShoppingBag, Star } from "lucide-react";
import { ProductGallery } from "@/components/ProductGallery";
import { Button } from "@/components/ui/button";
import { money, products, useShop } from "@/lib/shop";

export const Route = createFileRoute("/_authenticated/produto/$produtoId")({
  loader: ({ params }) => {
    const product = products.find((p) => String(p.id) === params.produtoId);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.name} — Suneiluxo` : "Produto não encontrado — Suneiluxo";
    const description = loaderData ? `${loaderData.name} por ${money(loaderData.price)}. Veja as fotos e compre na Suneiluxo.` : "Este produto não está disponível na Suneiluxo.";
    return { meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(loaderData?.image.startsWith("https://") ? [
        { property: "og:image", content: loaderData.image },
        { name: "twitter:image", content: loaderData.image },
      ] : []),
    ] };
  },
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-6xl px-4 py-20 text-center">
      <h1 className="text-3xl">Produto não encontrado</h1>
      <Button asChild variant="outline" className="mt-6"><Link to="/produtos">Voltar ao catálogo</Link></Button>
    </div>
  ),
});

function ProductDetail() {
  const product = Route.useLoaderData();
  const { add, favorites, toggleFavorite } = useShop();
  const images = [...new Set([product.image, ...(product.images ?? [])])];
  const favorite = favorites.includes(product.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <Button asChild variant="ghost" className="mb-6 px-0"><Link to="/produtos"><ArrowLeft /> Voltar ao catálogo</Link></Button>
      <div className="grid items-start gap-8 md:grid-cols-2 lg:gap-14">
        <ProductGallery key={product.id} images={images} name={product.name} />
        <section className="min-w-0 md:py-4">
          <Link to="/produtos" search={{ categoria: product.category }} className="text-sm uppercase tracking-widest text-muted-foreground">{product.category}</Link>
          <h1 className="mt-3 text-4xl leading-tight break-words sm:text-5xl">{product.name}</h1>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><Star className="h-4 w-4 fill-gold text-gold" />{product.rating.toFixed(1)}</p>
          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <strong className="text-3xl">{money(product.price)}</strong>
            {product.oldPrice && <del className="text-lg text-muted-foreground">{money(product.oldPrice)}</del>}
          </div>
          {product.tag && <p className="mt-3 text-sm text-muted-foreground">{product.tag}</p>}
          <div className="mt-8 flex gap-3 border-t pt-6">
            <Button size="lg" className="h-auto min-h-12 flex-1 whitespace-normal px-4 py-3" onClick={() => add(product)} disabled={product.stock <= 0}><ShoppingBag />{product.stock > 0 ? "Adicionar ao carrinho" : "Esgotado"}</Button>
            <Button variant="outline" size="icon" className="h-12 w-12 shrink-0" onClick={() => toggleFavorite(product.id)} aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"} title="Favoritos" aria-pressed={favorite}><Heart fill={favorite ? "currentColor" : "none"} /></Button>
          </div>
          <Button asChild variant="link" className="mt-3 px-0"><Link to="/carrinho">Ver carrinho</Link></Button>
        </section>
      </div>
    </div>
  );
}