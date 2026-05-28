import { Track, PlayableItem } from "@/lib/types";
import { useMusicSearch } from "@/hooks/useMusicSearch";
import { Search, Play, Heart, Loader2, Music } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Props = {
  currentItem: PlayableItem | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  isTrackFavorited: (id: number) => boolean;
  onToggleFavorite: (track: Track) => void;
};

function formatDuration(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function SearchTab({
  currentItem,
  isPlaying,
  onPlayTrack,
  isTrackFavorited,
  onToggleFavorite,
}: Props) {
  const { query, setQuery, results, isSearching, error } = useMusicSearch();

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="p-3 pb-2 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists..."
            className="pl-9 bg-accent border-border h-9"
            data-testid="input-search"
          />
        </div>
      </div>

      {isSearching && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      )}

      {error && !isSearching && (
        <p className="text-center text-sm text-destructive py-8 px-4">{error}</p>
      )}

      {!query.trim() && !isSearching && (
        <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground py-12 px-4 text-center">
          <Music className="w-12 h-12 mb-3 opacity-20" />
          <p className="text-sm">Search any song or artist</p>
          <p className="text-xs mt-1 opacity-60">30-second previews via iTunes</p>
        </div>
      )}

      {results.length > 0 && !isSearching && (
        <ScrollArea className="flex-1">
          <div className="p-3 pt-1 space-y-0.5">
            {results.map((track) => {
              const isActive =
                currentItem?.type === "track" &&
                currentItem.data.trackId === track.trackId;
              const favorited = isTrackFavorited(track.trackId);
              return (
                <div
                  key={track.trackId}
                  className={cn(
                    "flex items-center gap-3 px-2 py-2 rounded-md cursor-pointer group transition-colors",
                    isActive
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-accent border border-transparent"
                  )}
                  onClick={() => onPlayTrack(track)}
                  data-testid={`btn-track-${track.trackId}`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={track.artworkUrl100}
                      alt={track.collectionName}
                      className="w-10 h-10 rounded object-cover"
                    />
                    {isActive && isPlaying && (
                      <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                        <Play className="w-4 h-4 text-primary fill-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        isActive ? "text-primary" : "text-foreground"
                      )}
                    >
                      {track.trackName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.artistName}
                      {track.collectionName ? ` — ${track.collectionName}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground hidden sm:block tabular-nums">
                      {track.trackTimeMillis ? formatDuration(track.trackTimeMillis) : "0:30"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(track);
                      }}
                      className={cn(
                        "p-1 transition-opacity",
                        favorited ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                      data-testid={`btn-fav-track-${track.trackId}`}
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4",
                          favorited ? "fill-primary text-primary" : "text-muted-foreground"
                        )}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
