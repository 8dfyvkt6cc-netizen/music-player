import { useState, useEffect } from "react";
import { Track } from "@/lib/types";

export function useMusicSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setError(null);
      try {
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=25&media=music`
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults((data.results as Track[]).filter((t) => t.previewUrl));
      } catch {
        setError("Search failed. Check your connection and try again.");
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return { query, setQuery, results, isSearching, error };
}
