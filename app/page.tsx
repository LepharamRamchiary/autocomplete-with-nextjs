"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { samplePlaces } from "@/lib/data";  // Import your local samplePlaces data

// Debounce function
function debounce(func: (...args: any[]) => void, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default function Home() {
  const [query, setQuery] = useState("");  // Query for the search input
  const [filteredPredictions, setFilteredPredictions] = useState(samplePlaces);  // Filtered list

  // Effect to debounce the search and filter the predictions
  useEffect(() => {
    const debouncedFilter = debounce((searchQuery: string) => {
      if (searchQuery.length >= 3) {
        const filtered = samplePlaces.filter((place) =>
          place.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPredictions(filtered);
      } else {
        setFilteredPredictions([]);
      }
    }, 300);  
    debouncedFilter(query);  
  }, [query]);  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-72 font-[family-name:var(--font-geist-sans)]">
      <Command>
        <CommandInput
          placeholder="Type a command or search..."
          value={query}  
          onValueChange={setQuery}  
        />
        <CommandList>
          {query === "" ? (
            <CommandEmpty>Start typing to get suggestions...</CommandEmpty>
          ) : query.length < 3 ? (
            <CommandEmpty>Enter at least 3 characters.</CommandEmpty>
          ) : filteredPredictions.length === 0 ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <CommandGroup heading="Suggestions">
              {filteredPredictions.map((prediction) => (
                <CommandItem key={prediction.place_id}>
                  {prediction.description}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandSeparator />
        </CommandList>
      </Command>
    </div>
  );
}
