import { Track, Station, PlayableItem } from "@/lib/types";
import { Heart, Radio } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Favorites = {
  stations: Station[];
  tracks: Track[];
};

type Props = {
  favorites: Favorites;
  currentItem: PlayableItem | null;
  isPlaying: boolean;
  onPlayStation: (id: string) => void;
  onPlayTrack: (track: Track) => void;
  onToggleStation: (station: Station) => void;
  onToggleTrack: (track: Track) => void;
};

export function FavoritesTab({
  favorites,
  currentItem,
  onPlayStation,
  onPlayTrack,
  onToggleStation,
  onToggleTrack,
}: Props) {
  const isEmpty = favorites.stations.length === 0 && favorites.tracks.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground py-12 px-4 text-center">
        <Heart className="w-12 h-12 mb-3 opacity-20" />
        <p className="text-sm">No favorites yet</p>
        <p className="text-xs mt-1 opacity-60">Heart stations or songs to save them here</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-3 space-y-5">
        {favorites.stations.length > 0 && (
          <div>
            <h2 className="text-xs font-mono tracking-wider text-muted-foreground uppercase px-2 mb-2">
              Radio Stations
            </h2>
            <div className="space-y-0.5">
              {favorites.stations.map((station) => {
                const isActive =
                  currentItem?.type === "station" && currentItem.data.id === station.id;
                return (
                  <div
                    key={station.id}
                    className={cn(
                      "flex items-center gap-3 px-2 py-2.5 rounded-md cursor-pointer group transition-colors",
                      isActive
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-accent border border-transparent"
                    )}
                    onClick={() => onPlayStation(station.id)}
                    data-testid={`btn-fav-station-${station.id}`}
                  >
                    <Radio
                      className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          isActive ? "text-primary" : "text-foreground"
                        )}
                      >
                        {station.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{station.genre}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStation(station);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <Heart className="w-4 h-4 fill-primary text-primary" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {favorites.tracks.length > 0 && (
          <div>
            <h2 className="text-xs font-mono tracking-wider text-muted-foreground uppercase px-2 mb-2">
              Songs
            </h2>
            <div className="space-y-0.5">
              {favorites.tracks.map((track) => {
                const isActive =
                  currentItem?.type === "track" &&
                  currentItem.data.trackId === track.trackId;
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
                    data-testid={`btn-fav-track-${track.trackId}`}
                  >
                    <img
                      src={track.artworkUrl100}
                      alt={track.trackName}
                      className="w-9 h-9 rounded object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          isActive ? "text-primary" : "text-foreground"
                        )}
                      >
                        {track.trackName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{track.artistName}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTrack(track);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    >
                      <Heart className="w-4 h-4 fill-primary text-primary" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
