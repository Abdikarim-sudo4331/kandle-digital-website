import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Service } from "@shared/schema";
import { serviceIcons } from "@shared/content";
import { serviceInputSchema } from "@shared/routes";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { adminFetch, useAdminMutation, useAdminQuery } from "./api";

const PATH = "/api/admin/services";

type Draft = {
  title: string;
  summary: string;
  description: string;
  features: string; // one per line
  icon: string;
  sortOrder: number;
  featured: boolean;
  published: boolean;
};

const emptyDraft = (sortOrder: number): Draft => ({
  title: "", summary: "", description: "", features: "", icon: "Globe",
  sortOrder, featured: false, published: true,
});

function toDraft(s: Service): Draft {
  return { ...s, features: s.features.join("\n") };
}

function ServiceDialog({
  initial, id, open, onOpenChange,
}: { initial: Draft; id: number | null; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const save = useAdminMutation(
    (body: unknown) => (id ? adminFetch("PUT", `${PATH}/${id}`, body) : adminFetch("POST", PATH, body)),
    { invalidate: PATH, success: id ? "Service updated" : "Service added" },
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = serviceInputSchema.safeParse({
      ...draft,
      features: draft.features.split("\n").map((f) => f.trim()).filter(Boolean),
    });
    if (!parsed.success) {
      const issue = parsed.error.errors[0];
      setError(`${issue.path.join(".")}: ${issue.message}`);
      return;
    }
    setError(null);
    save.mutate(parsed.data, { onSuccess: () => onOpenChange(false) });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{id ? "Edit service" : "New service"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="s-title">Title</Label>
            <Input id="s-title" value={draft.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-summary">Short summary</Label>
            <Input id="s-summary" value={draft.summary} onChange={(e) => set("summary", e.target.value)} />
            <p className="text-xs text-muted-foreground">Shown on the home page and in the menu.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-desc">Description</Label>
            <Textarea id="s-desc" rows={4} value={draft.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="s-features">Features</Label>
            <Textarea id="s-features" rows={4} value={draft.features} onChange={(e) => set("features", e.target.value)} />
            <p className="text-xs text-muted-foreground">One per line.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={draft.icon} onValueChange={(v) => set("icon", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {serviceIcons.map((name) => {
                    const Icon = getIcon(name);
                    return (
                      <SelectItem key={name} value={name}>
                        <span className="flex items-center gap-2"><Icon className="h-4 w-4" />{name}</span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-order">Order</Label>
              <Input id="s-order" type="number" value={draft.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value) || 0)} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="s-featured">Show on home page & menu</Label>
            <Switch id="s-featured" checked={draft.featured} onCheckedChange={(v) => set("featured", v)} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="s-published">Published</Label>
            <Switch id="s-published" checked={draft.published} onCheckedChange={(v) => set("published", v)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={save.isPending}>{save.isPending ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ServicesPanel() {
  const { data = [], isLoading, error } = useAdminQuery<Service[]>(PATH);
  const [editing, setEditing] = useState<{ id: number | null; draft: Draft } | null>(null);

  const remove = useAdminMutation(
    (id: number) => adminFetch("DELETE", `${PATH}/${id}`),
    { invalidate: PATH, success: "Service deleted" },
  );

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (error) return <p className="text-destructive">{(error as Error).message}</p>;

  const nextOrder = data.reduce((m, s) => Math.max(m, s.sortOrder + 1), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {data.length === 0 ? "No services yet — the site is showing its built-in defaults. Run the seed script or add one." : "Lower order numbers appear first."}
        </p>
        <Button size="sm" onClick={() => setEditing({ id: null, draft: emptyDraft(nextOrder) })}>
          <Plus className="h-4 w-4 mr-1" />Add service
        </Button>
      </div>

      {data.map((s) => {
        const Icon = getIcon(s.icon);
        return (
          <div key={s.id} className="bg-white border border-border rounded-lg p-4 flex items-start gap-4">
            <div className="p-3 rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] shrink-0"><Icon className="h-5 w-5" /></div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-[#0F172A]">{s.title}</p>
                {s.featured && <Badge variant="secondary">Home</Badge>}
                {!s.published && <Badge variant="outline">Hidden</Badge>}
                <span className="text-xs text-muted-foreground">#{s.sortOrder}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{s.summary}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="icon" variant="outline" className="h-9 w-9" aria-label="Edit" onClick={() => setEditing({ id: s.id, draft: toDraft(s) })}>
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="outline" className="h-9 w-9" aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete “{s.title}”?</AlertDialogTitle>
                    <AlertDialogDescription>To hide it temporarily, turn off “Published” instead.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => remove.mutate(s.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        );
      })}

      {editing && (
        <ServiceDialog
          key={editing.id ?? "new"}
          id={editing.id}
          initial={editing.draft}
          open
          onOpenChange={(o) => !o && setEditing(null)}
        />
      )}
    </div>
  );
}
