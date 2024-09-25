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

// Debounce function to delay the search
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

  // Debounced filter to show results based on input
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
    }, 300);  // Debounce delay of 300ms

    debouncedFilter(query);  // Apply the debounced function on query change
  }, [query]);  // Re-run the effect when query changes

  // Handle click on a suggestion item
  const handleSuggestionClick = (description: string) => {
    setQuery(description);  // Set the clicked suggestion as the input value
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-72 font-[family-name:var(--font-geist-sans)]">
      <Command>
        <CommandInput
          placeholder="Type a command or search..."
          value={query}  // Controlled input
          onValueChange={setQuery}  // Update query as user types
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
                <CommandItem
                  key={prediction.place_id}
                  onSelect={() => handleSuggestionClick(prediction.description)}  // Handle click
                >
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

