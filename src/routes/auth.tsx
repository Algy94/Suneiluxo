import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/suneiluxo-logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Criar conta — Suneiluxo" },
      { name: "description", content: "Cadastre-se na Suneiluxo para comprar cabelos e joias." },
      { property: "og:title", content: "Criar conta — Suneiluxo" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:description", content: "Cadastre-se ou entre na sua conta Suneiluxo." },
    ],
  }),
  component: AuthPage,
});

const input =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-gold";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/", replace: true });
    });
  }, [navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: name, phone },
        },
      });
      setLoading(false);
      if (error) return setMsg(error.message);
      if (data.session) navigate({ to: "/", replace: true });
      else setMsg("Conta criada! Confirme o seu email para entrar.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setMsg("Email ou senha incorretos.");
      navigate({ to: "/", replace: true });
    }
  }

  return (
    <div className="bg-luxe flex min-h-[80vh] items-center justify-center px-4 py-12">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border bg-card p-8 shadow-luxe">
        <img src={logo.url} alt="Suneiluxo" className="mx-auto h-20 w-20 object-contain" />
        <h1 className="text-center text-3xl">{mode === "signup" ? "Criar conta" : "Entrar"}</h1>
        {mode === "signup" && (
          <>
            <input className={input} placeholder="Nome completo" required value={name} onChange={(e) => setName(e.target.value)} />
            <input className={input} placeholder="Telefone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
          </>
        )}
        <input className={input} placeholder="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={input} placeholder="Senha (mín. 6 caracteres)" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="w-full rounded-md bg-gold py-3 text-sm uppercase tracking-widest text-primary-foreground disabled:opacity-60">
          {loading ? "Aguarde..." : mode === "signup" ? "Cadastrar" : "Entrar"}
        </button>
        {msg && <p className="text-center text-sm text-muted-foreground">{msg}</p>}
        <button type="button" onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setMsg(""); }} className="w-full text-center text-sm text-gold">
          {mode === "signup" ? "Já tem conta? Entrar" : "Não tem conta? Cadastre-se"}
        </button>
      </form>
    </div>
  );
}
