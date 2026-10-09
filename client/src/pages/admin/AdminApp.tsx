import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { Link } from "wouter";
import { ExternalLink, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminQuery, type ApiError } from "./api";
import { InquiriesPanel } from "./InquiriesPanel";
import { ServicesPanel } from "./ServicesPanel";
import { ContentPanel } from "./ContentPanel";
import logoImage from "@assets/Logo_1767358730163.jpeg";

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="w-full max-w-sm bg-white border border-border rounded-xl p-8 shadow-sm">
        <img src={logoImage} alt="Kandle Digital" className="h-12 w-auto mb-6" />
        {children}
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setPending(false);
  }

  return (
    <Centered>
      <h1 className="text-xl font-bold text-[#0F172A] mb-1">Site admin</h1>
      <p className="text-sm text-muted-foreground mb-6">Sign in to manage content and inquiries.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Centered>
  );
}

function Dashboard({ session }: { session: Session }) {
  // Confirms the signed-in user is on the server's ADMIN_EMAILS allowlist.
  const me = useAdminQuery<{ email: string }>("/api/admin/me");
  const signOut = () => supabase!.auth.signOut();

  if (me.isLoading) return <Centered><p className="text-sm text-muted-foreground">Checking access...</p></Centered>;
  if (me.error) {
    return (
      <Centered>
        <p className="text-sm text-destructive mb-4">{(me.error as ApiError).message}</p>
        <p className="text-sm text-muted-foreground mb-6">Signed in as {session.user.email}</p>
        <Button variant="outline" className="w-full" onClick={signOut}>Sign out</Button>
      </Centered>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src={logoImage} alt="Kandle Digital" className="h-9 w-auto" />
            <span className="font-semibold text-[#0F172A] hidden sm:inline">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden md:inline truncate">{me.data?.email}</span>
            <Button asChild variant="ghost" size="sm">
              <Link href="/"><ExternalLink className="h-4 w-4 mr-1" />View site</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-1" />Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Tabs defaultValue="inquiries">
          <TabsList className="mb-6">
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="content">Page content</TabsTrigger>
          </TabsList>
          <TabsContent value="inquiries"><InquiriesPanel /></TabsContent>
          <TabsContent value="services"><ServicesPanel /></TabsContent>
          <TabsContent value="content"><ContentPanel /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function AdminApp() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const qc = useQueryClient();

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      // Drop cached admin data whenever the signed-in user changes.
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") qc.removeQueries({ queryKey: ["admin"] });
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [qc]);

  if (!supabase) {
    return (
      <Centered>
        <p className="text-sm text-muted-foreground">
          Admin isn't configured. Set <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code> on the server.
        </p>
      </Centered>
    );
  }
  if (session === undefined) return null;
  return session ? <Dashboard key={session.user.id} session={session} /> : <Login />;
}
