import { useMutation, useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { siteQueryKey } from "@/lib/site";
import { useToast } from "@/hooks/use-toast";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Calls our API (functions/) with the current Supabase access token.
export async function adminFetch<T>(method: string, path: string, body?: unknown): Promise<T> {
  const { data } = (await supabase?.auth.getSession()) ?? { data: { session: null } };
  const token = data.session?.access_token;
  const res = await fetch(path, {
    method,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, err.message ?? "Request failed");
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export function useAdminQuery<T>(path: string) {
  return useQuery<T>({
    queryKey: ["admin", path],
    queryFn: () => adminFetch<T>("GET", path),
    staleTime: 0,
  });
}

// Mutation that refreshes the given admin list and the public site data.
export function useAdminMutation<TVars>(
  fn: (vars: TVars) => Promise<unknown>,
  { invalidate, success }: { invalidate: string; success?: string },
) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", invalidate] as QueryKey });
      qc.invalidateQueries({ queryKey: siteQueryKey });
      if (success) toast({ title: success });
    },
    onError: (err: Error) => {
      toast({ title: "Something went wrong", description: err.message, variant: "destructive" });
    },
  });
}
