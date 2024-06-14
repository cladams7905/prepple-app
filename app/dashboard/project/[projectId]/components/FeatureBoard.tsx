"use client";

import { useState } from "react";
import Header from "./Header";
import FeatureRequests from "./FeatureRequests";
import { SortType } from "@/lib/enums";
import { Tables } from "@/lib/supabase/types";
import { FilterBuilder } from "@/lib/types";
import ProjectTabList from "./ProjectTabList";

export default function FeatureBoard({
  featureRequests,
  project,
}: {
  featureRequests: Tables<"FeatureRequests">[];
  project: Tables<"Projects">;
}) {
  const [sortType, setSortType] = useState<SortType>(SortType.dateSubmitted);
  const [filterBuilder, setFilterBuilder] = useState<FilterBuilder>({
    importanceFilter: [],
    statusFilter: [],
    typeFilter: [],
  });

  return (
    <div className="flex flex-col flex-wrap h-full bg-base-100 dark:bg-neutral border border-gray-200 rounded-l-none rounded-tr-none dark:border-gray-600 rounded-md p-4 px-8 gap-5">
      <Header
        project={project}
        sortType={sortType}
        setSortType={setSortType}
        filterBuilder={filterBuilder}
        setFilterBuilder={setFilterBuilder}
      />
      <hr className="dark:hidden"></hr>
      <FeatureRequests
        featureRequests={featureRequests}
        sortType={sortType}
        filterBuilder={filterBuilder}
      />
    </div>
  );
}
