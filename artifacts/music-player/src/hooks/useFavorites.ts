import { useState, useCallback } from "react";
import { Station, Track } from "@/lib/types";

type Favorites = {
  stations: Station[];
  tracks: Track[];
};

function load(): Favorites {
  try {
    const raw = localStorage.getItem("music-favorites");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { stations: [], tracks: [] };
}

function save(favs: Favorites) {
  localStorage.setItem("music-favorites", JSON.stringify(favs));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorites>(load);

  const toggleStation = useCallback((station: Station) => {
    setFavorites((prev) => {
      const exists = prev.stations.some((s) => s.id === station.id);
      const next = exists
        ? { ...prev, stations: prev.stations.filter((s) => s.id !== station.id) }
        : { ...prev, stations: [...prev.stations, station] };
      save(next);
      return next;
    });
  }, []);

  const toggleTrack = useCallback((track: Track) => {
    setFavorites((prev) => {
      const exists = prev.tracks.some((t) => t.trackId === track.trackId);
      const next = exists
        ? { ...prev, tracks: prev.tracks.filter((t) => t.trackId !== track.trackId) }
        : { ...prev, tracks: [...prev.tracks, track] };
      save(next);
      return next;
    });
  }, []);

  const isStationFavorited = useCallback(
    (id: string) => favorites.stations.some((s) => s.id === id),
    [favorites]
  );

  const isTrackFavorited = useCallback(
    (id: number) => favorites.tracks.some((t) => t.trackId === id),
    [favorites]
  );

  return { favorites, toggleStation, toggleTrack, isStationFavorited, isTrackFavorited };
}
