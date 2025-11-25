"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedValue } from "@/hooks/debounce";

interface ActionSearchBarProps {
  onSearch?: (query: string) => void;
}

export function ActionSearchBar({ onSearch }: ActionSearchBarProps) {
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  React.useEffect(() => {
    onSearch?.(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search groups..."
          value={query}
          onChange={handleChange}
          className="pl-9 pr-4 w-full"
        />
      </div>
    </form>
  );
}
