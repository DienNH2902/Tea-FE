"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { PageHeader } from "@/components/shared/page-header";
import { TeaFilters, TeaFiltersValue } from "@/components/teas/tea-filters";
import { TeaGrid } from "@/components/teas/tea-grid";
import { Pagination } from "@/components/shared/pagination";
import {
  useTeas,
  useSearchTeas,
  useTeasByType,
  useTeasAvailable,
} from "@/hooks/use-teas";
import { useDebounce } from "@/hooks/use-debounce";
import { TeaAvailabilityFilter, TeaType } from "@/types";

const PAGE_SIZE = 12;

const MAP_AVAILABILITY_FILTER: Record<
  TeaFiltersValue["availability"],
  TeaAvailabilityFilter | undefined
> = {
  all: undefined,
  "in-stock": TeaAvailabilityFilter.AVAILABLE,
  "out-of-stock": TeaAvailabilityFilter.OUT_OF_STOCK,
};

export default function TeasPage() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") as TeaType | null;

  const [pageNumber, setPageNumber] = useState(1);
  // Khởi tạo state type từ query param trên URL
  const [filters, setFilters] = useState<TeaFiltersValue>({
    search: "",
    type:
      initialType && Object.values(TeaType).includes(initialType)
        ? initialType
        : "all",
    availability: "all",
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const isFiltering =
    debouncedSearch.trim().length > 0 ||
    filters.type !== "all" ||
    filters.availability !== "all";

  const serverPaged = useTeas(pageNumber, PAGE_SIZE);
  const searchResult = useSearchTeas(debouncedSearch);
  const typeResult = useTeasByType(
    filters.type !== "all" ? filters.type : undefined,
  );
  const availabilityStatus = MAP_AVAILABILITY_FILTER[filters.availability];
  const availabilityResult = useTeasAvailable(availabilityStatus);

  const rawList = useMemo(() => {
    if (debouncedSearch.trim().length > 0) return searchResult.data ?? [];
    if (filters.type !== "all") return typeResult.data ?? [];
    if (filters.availability !== "all") return availabilityResult.data ?? [];
    return serverPaged.data?.data ?? [];
  }, [
    debouncedSearch,
    filters.type,
    filters.availability,
    searchResult.data,
    typeResult.data,
    availabilityResult.data,
    serverPaged.data,
  ]);

  const clientPaged = useMemo(() => {
    if (!isFiltering) return rawList;
    const start = (pageNumber - 1) * PAGE_SIZE;
    return rawList.slice(start, start + PAGE_SIZE);
  }, [rawList, isFiltering, pageNumber]);

  const isLoading = isFiltering
    ? debouncedSearch.trim().length > 0
      ? searchResult.isLoading
      : filters.type !== "all"
        ? typeResult.isLoading
        : availabilityResult.isLoading
    : serverPaged.isLoading;

  const totalPages = isFiltering
    ? Math.max(1, Math.ceil(rawList.length / PAGE_SIZE))
    : (serverPaged.data?.totalPages ?? 1);

  const totalItems = isFiltering
    ? rawList.length
    : (serverPaged.data?.totalItems ?? 0);

  function handleFiltersChange(next: TeaFiltersValue) {
    setFilters(next);
    setPageNumber(1);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <PageHeader
        title="Cửa hàng"
        description="Khám phá đầy đủ các loại trà đang được Tea Shop tuyển chọn"
      />

      <TeaFilters value={filters} onChange={handleFiltersChange} />

      <TeaGrid
        teas={isFiltering ? clientPaged : serverPaged.data?.data}
        isLoading={isLoading}
      />

      <Pagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPageNumber}
      />
    </div>
  );
}
