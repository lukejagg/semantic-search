import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { Search } from "../components/SearchResult";

export const useSearch = (search: string): UseQueryResult<Search[]> => {
  return useQuery(
    ["search", search],
    async () => {
      const response = await fetch(`localhost:8001/search/${search}`);
      const data = await response.json();
      return data as Search[];
    },
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );
};
