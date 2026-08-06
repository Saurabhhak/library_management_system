import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";

/**
 * useTableFilters — reusable filter/search/sort state for ANY table or chart,
 * stored in the URL query string instead of Context + localStorage.
 *
 * Why URL params over Context+localStorage (as discussed):
 *   - Shareable: copy the URL, send to a colleague, same filtered view opens
 *   - Bookmarkable: browser remembers filtered views
 *   - Back/forward buttons work naturally
 *   - Survives refresh with zero extra code (Context+localStorage needs sync logic)
 *   - No provider wrapping needed — just call the hook in any page
 *
 * Usage:
 *   const { filters, setFilter, resetFilters } = useTableFilters({
 *     status: "all",
 *     search: "",
 *     sort: "name_asc",
 *   });
 *
 *   <input value={filters.search} onChange={e => setFilter("search", e.target.value)} />
 *   <select value={filters.status} onChange={e => setFilter("status", e.target.value)}>
 *
 *   // Apply to your data:
 *   const filtered = members.filter(m =>
 *     (filters.status === "all" || m.status === filters.status) &&
 *     m.name.toLowerCase().includes(filters.search.toLowerCase())
 *   );
 */
export function useTableFilters(defaults = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  /* Merge URL params over defaults — URL always wins if present */
  const filters = useMemo(() => {
    const result = { ...defaults };
    for (const key of Object.keys(defaults)) {
      if (searchParams.has(key)) result[key] = searchParams.get(key);
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /* Update a single filter — removes the param entirely if it equals the default
     (keeps the URL clean, e.g. ?status=all doesn't linger in the address bar) */
  const setFilter = useCallback(
    (key, value) => {
      const next = new URLSearchParams(searchParams);
      if (value === defaults[key] || value === "" || value == null) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      setSearchParams(next, { replace: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, setSearchParams],
  );

  /* Update multiple filters at once (e.g. a "reset all except search" action) */
  const setFilters = useCallback(
    (patch) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([key, value]) => {
        if (value === defaults[key] || value === "" || value == null) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      });
      setSearchParams(next, { replace: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return { filters, setFilter, setFilters, resetFilters };
}
