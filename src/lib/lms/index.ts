import { lmsConfig } from "@/data/lmsConfig";
import { MockLmsProvider } from "./mockProvider";
import type { LmsDataProvider, LmsProviderMode } from "./service";
import { SupabaseLmsProvider } from "./supabaseProvider";

const DEFAULT_PROVIDER_MODE =
  (import.meta.env.VITE_LMS_DATA_PROVIDER as LmsProviderMode | undefined) ??
  (lmsConfig.featureFlags.useSupabaseProvider ? "supabase" : "mock");

const providerCache: Partial<Record<LmsProviderMode, LmsDataProvider>> = {};

const createProvider = (mode: LmsProviderMode): LmsDataProvider => {
  if (mode === "supabase") {
    return new SupabaseLmsProvider();
  }

  return new MockLmsProvider();
};

export const getLmsProvider = (
  mode: LmsProviderMode = DEFAULT_PROVIDER_MODE,
): LmsDataProvider => {
  if (!providerCache[mode]) {
    providerCache[mode] = createProvider(mode);
  }

  return providerCache[mode] as LmsDataProvider;
};

export const lmsProvider = getLmsProvider();

export type { LmsDataProvider, LmsProviderMode } from "./service";
