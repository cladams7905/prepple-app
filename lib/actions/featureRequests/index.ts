"use server";

import { createClient } from "@/lib/supabase/server";
import { TablesInsert } from "@/lib/supabase/types";

export async function createFeatureRequest(
  featureRequest: TablesInsert<"FeatureRequests">
) {
  const supabase = createClient();
  const result = await supabase
    .from("FeatureRequests")
    .insert(featureRequest)
    .select("*")
    .single();
  return JSON.stringify(result);
}

export async function getFeatureRequests(projectId: number) {
  const supabase = createClient();
  const result = await supabase
    .from("FeatureRequests")
    .select()
    .eq("project_id", projectId);
  return JSON.parse(JSON.stringify(result));
}