import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";
import useDebounce from "../hooks/useDebounce";
import { SEARCH_DEBOUNCED_DELAY } from "../constants/delay";

interface SearchContextType {
  search: string;
  setSearch: (value: string) => void;
  debouncedSearch: string;
}

const SearchContext = createContext<SearchContextType | null>(null);

export const SearchProvider = ({ children }: PropsWithChildren) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCED_DELAY);

  return (
    <SearchContext.Provider value={{ search, setSearch, debouncedSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearch는 SearchProvider 안에서만 써라.");
  }
  return ctx;
};
