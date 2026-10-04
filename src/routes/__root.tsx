import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Heart, LogOut, ShoppingBag } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import logo from "../assets/suneiluxo-logo.png.asset.json";
import { ShopProvider, useShop } from "../lib/shop";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/lib/use-is-admin";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo correu mal. Tente novamente ou volte ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Suneiluxo — Cabelos & Joias" },
      {
        name: "description",
        content: "Cabelos humanos, perucas e joias femininas com entrega em Moçambique.",
      },
      { name: "author", content: "Suneiluxo" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Karla:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const allNavLinks = [
  { to: "/", label: "Início", admin: false },
  { to: "/produtos", label: "Produtos", admin: false },
  { to: "/admin", label: "Admin", admin: true },
] as const;

function Header() {
  const { count, favorites, notice } = useShop();
  const isAdmin = useIsAdmin();
  const navLinks = allNavLinks.filter((l) => !l.admin || isAdmin);

  return (
    <>
      <div className="bg-ink py-2 text-center text-[11px] uppercase tracking-[0.25em] text-gold">
        Envio e atendimento em Moçambique
      </div>
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo.url} alt="Suneiluxo" className="h-11 w-11 rounded-full bg-ink p-1" />
            <span className="font-display text-2xl text-gold-gradient">Suneiluxo</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "text-gold" }}
                className="tracking-wide text-muted-foreground transition hover:text-gold"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <SessionButton />
            <span className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
              <Heart className="h-4 w-4" /> {favorites.length}
            </span>
            <Link
              to="/carrinho"
              className="inline-flex items-center gap-2 rounded-md border border-gold px-3 py-2 text-sm transition hover:bg-gold/15"
            >
              <ShoppingBag className="h-4 w-4" /> {count}
            </Link>
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t px-4 py-2 text-sm sm:hidden">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="whitespace-nowrap text-muted-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      {notice && (
        <div className="bg-gold/15 px-4 py-2 text-center text-sm text-foreground">{notice}</div>
      )}
    </>
  );
}

function Footer() {
  return (
    <footer className="mt-20 bg-ink py-12 text-sm text-gold-soft">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl text-gold-gradient">Suneiluxo</p>
          <p className="mt-2 opacity-70">Realce a sua beleza, expresse o seu luxo.</p>
        </div>
        <div className="space-y-1 opacity-80">
          <p className="text-gold">Comprar</p>
          <p>Cabelos</p>
          <p>Joias</p>
          <p>Combos</p>
        </div>
        <div className="space-y-1 opacity-80">
          <p className="text-gold">Atendimento</p>
          <p>WhatsApp</p>
          <p>Entregas</p>
          <p>Políticas</p>
        </div>
      </div>
    </footer>
  );
}

function SessionButton() {
  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => data.subscription.unsubscribe();
  }, []);
  if (!signedIn) return null;
  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        navigate({ to: "/auth", replace: true });
      }}
      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold"
      title="Sair"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
    });
    return () => data.subscription.unsubscribe();
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <ShopProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {/* Required: nested routes render here. */}
            <Outlet />
          </main>
          <Footer />
        </div>
      </ShopProvider>
    </QueryClientProvider>
  );
}
