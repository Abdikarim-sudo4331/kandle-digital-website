import { useQuery } from "@tanstack/react-query";
import { defaultSiteData, type SiteData } from "@shared/content";
import { api } from "@shared/routes";

type Boot = {
  site?: SiteData;
  config?: { supabaseUrl: string | null; supabaseAnonKey: string | null };
};

// Injected by the server into index.html (see server/site-data.ts).
export const boot: Boot = (window as unknown as { __BOOT__?: Boot }).__BOOT__ ?? {};

export const siteQueryKey = [api.site.get.path];

export function useSiteData(): SiteData {
  const { data } = useQuery<SiteData>({
    queryKey: siteQueryKey,
    initialData: boot.site,
    // If the page was served without injected data, fetch it once.
    enabled: !boot.site,
  });
  return data ?? defaultSiteData;
}

export function useContent() {
  return useSiteData().content;
}

export function whatsappLink(number: string) {
  return `https://wa.me/${number}`;
}
