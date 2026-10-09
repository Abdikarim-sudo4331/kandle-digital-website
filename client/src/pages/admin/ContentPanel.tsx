import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  contentFields, contentKeys, contentSchemas,
  type ContentKey, type FieldDef, type PageContent,
} from "@shared/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch, useAdminMutation, useAdminQuery } from "./api";

const PATH = "/api/admin/content";
type Values = Record<string, unknown>;

function FieldEditor({ field, value, onChange }: { field: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  const id = `f-${field.name}`;

  if (field.type === "text") {
    return <Input id={id} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
  }
  if (field.type === "textarea") {
    return <Textarea id={id} rows={3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
  }
  if (field.type === "list") {
    const items = (value as string[]) ?? [];
    return (
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Textarea
              rows={2}
              value={item}
              onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
            />
            <Button type="button" size="icon" variant="ghost" aria-label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" size="sm" variant="outline" onClick={() => onChange([...items, ""])}>
          <Plus className="h-4 w-4 mr-1" />Add
        </Button>
      </div>
    );
  }

  const rows = (value as Record<string, string>[]) ?? [];
  const blank = Object.fromEntries(field.fields.map((f) => [f.name, ""]));
  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="grid sm:grid-cols-2 gap-2 flex-1">
            {field.fields.map((sub) => (
              <Input
                key={sub.name}
                placeholder={sub.label}
                aria-label={sub.label}
                value={row[sub.name] ?? ""}
                onChange={(e) => onChange(rows.map((r, j) => (j === i ? { ...r, [sub.name]: e.target.value } : r)))}
              />
            ))}
          </div>
          <Button type="button" size="icon" variant="ghost" aria-label="Remove" onClick={() => onChange(rows.filter((_, j) => j !== i))}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" size="sm" variant="outline" onClick={() => onChange([...rows, blank])}>
        <Plus className="h-4 w-4 mr-1" />Add
      </Button>
    </div>
  );
}

function BlockForm({ blockKey, initial }: { blockKey: ContentKey; initial: Values }) {
  const [values, setValues] = useState<Values>(initial);
  const [error, setError] = useState<string | null>(null);
  const { fields } = contentFields[blockKey];
  const dirty = JSON.stringify(values) !== JSON.stringify(initial);

  const save = useAdminMutation(
    (body: unknown) => adminFetch("PUT", `${PATH}/${blockKey}`, body),
    { invalidate: PATH, success: "Saved — changes are live" },
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contentSchemas[blockKey].safeParse(values);
    if (!parsed.success) {
      const issue = parsed.error.errors[0];
      const label = fields.find((f) => f.name === issue.path[0])?.label ?? issue.path.join(".");
      setError(`${label}: ${issue.message}`);
      return;
    }
    setError(null);
    save.mutate(parsed.data);
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-border rounded-lg p-6 space-y-5">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={`f-${field.name}`}>{field.label}</Label>
          <FieldEditor
            field={field}
            value={values[field.name]}
            onChange={(v) => setValues((prev) => ({ ...prev, [field.name]: v }))}
          />
          {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
        </div>
      ))}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2 sticky bottom-0 -mx-6 -mb-6 px-6 py-4 bg-white/95 backdrop-blur border-t border-border rounded-b-lg">
        <Button type="submit" disabled={!dirty || save.isPending}>
          {save.isPending ? "Saving..." : "Save changes"}
        </Button>
        {dirty && (
          <Button type="button" variant="outline" onClick={() => { setValues(initial); setError(null); }}>
            Discard
          </Button>
        )}
      </div>
    </form>
  );
}

export function ContentPanel() {
  const { data, isLoading, error, dataUpdatedAt } = useAdminQuery<PageContent>(PATH);
  const [active, setActive] = useState<ContentKey>("home");

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (error || !data) return <p className="text-destructive">{(error as Error)?.message}</p>;

  return (
    <div className="grid md:grid-cols-[200px_1fr] gap-6">
      <nav className="flex md:flex-col gap-1 overflow-x-auto">
        {contentKeys.map((key) => (
          <Button
            key={key}
            variant={active === key ? "secondary" : "ghost"}
            className="justify-start shrink-0"
            onClick={() => setActive(key)}
          >
            {contentFields[key].label}
          </Button>
        ))}
      </nav>
      {/* Remount when switching sections or after a save so the form resets to server data */}
      <BlockForm key={`${active}-${dataUpdatedAt}`} blockKey={active} initial={data[active] as Values} />
    </div>
  );
}
