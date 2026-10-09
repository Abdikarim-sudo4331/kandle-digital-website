import { useState } from "react";
import { format } from "date-fns";
import { Mail, Trash2 } from "lucide-react";
import type { ContactInquiry } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminFetch, useAdminMutation, useAdminQuery } from "./api";

type Status = ContactInquiry["status"];
const PATH = "/api/admin/inquiries";
const filters: { value: Status | "all"; label: string }[] = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "archived", label: "Archived" },
  { value: "all", label: "All" },
];

export function InquiriesPanel() {
  const [filter, setFilter] = useState<Status | "all">("new");
  const { data = [], isLoading, error } = useAdminQuery<ContactInquiry[]>(PATH);

  const setStatus = useAdminMutation(
    ({ id, status }: { id: number; status: Status }) => adminFetch("PATCH", `${PATH}/${id}`, { status }),
    { invalidate: PATH },
  );
  const remove = useAdminMutation(
    (id: number) => adminFetch("DELETE", `${PATH}/${id}`),
    { invalidate: PATH, success: "Inquiry deleted" },
  );

  const counts = Object.fromEntries(filters.map((f) => [
    f.value,
    f.value === "all" ? data.length : data.filter((d) => d.status === f.value).length,
  ]));
  const visible = filter === "all" ? data : data.filter((d) => d.status === filter);

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;
  if (error) return <p className="text-destructive">{(error as Error).message}</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={filter === f.value ? "default" : "outline"}
            onClick={() => setFilter(f.value)}
          >
            {f.label} ({counts[f.value]})
          </Button>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="bg-white border border-border rounded-lg p-10 text-center text-muted-foreground">
          No inquiries here.
        </div>
      )}

      {visible.map((inq) => (
        <div key={inq.id} className="bg-white border border-border rounded-lg p-5">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-[#0F172A]">{inq.name}</p>
                {inq.status === "new" && <Badge>New</Badge>}
              </div>
              <a href={`mailto:${inq.email}`} className="text-sm text-[#1E40AF] hover:underline break-all">
                {inq.email}
              </a>
              {inq.createdAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(inq.createdAt), "d MMM yyyy, HH:mm")}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={inq.status}
                onValueChange={(status) => setStatus.mutate({ id: inq.id, status: status as Status })}
              >
                <SelectTrigger className="w-[120px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Button asChild size="icon" variant="outline" className="h-9 w-9" aria-label="Reply by email">
                <a href={`mailto:${inq.email}?subject=${encodeURIComponent("Re: your inquiry to Kandle Digital")}`}>
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="outline" className="h-9 w-9" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this inquiry?</AlertDialogTitle>
                    <AlertDialogDescription>
                      The message from {inq.name} will be permanently removed. Archive it instead if you may need it later.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => remove.mutate(inq.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <p className="text-[#475569] whitespace-pre-wrap break-words">{inq.message}</p>
        </div>
      ))}
    </div>
  );
}
