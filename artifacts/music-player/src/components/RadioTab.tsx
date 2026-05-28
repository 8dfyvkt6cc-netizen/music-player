import { useMemo } from "react";
import { STATIONS } from "@/lib/stations";
import { Station, PlayableItem } from "@/lib/types";
import { Heart, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  currentItem: PlayableItem | null;
  isPlaying: boolean;
  onPlayStation: (id: string) => void;
  isStationFavorited: (id: string) => boolean;
  onToggleFavorite: (station: Station) => void;
};

export function RadioTab({ currentItem, isPlaying, onPlayStation, isStationFavorited, onToggleFavorite }: Props) {
  const stationsByGenre = useMemo(() => {
    const groups: Record<string, typeof STATIONS> = {};
    STATIONS.forEach((s) => {
      if (!groups[s.genre]) groups[s.genre] = [];
      groups[s.genre].push(s);
    });
    return groups;
  }, []);

  return (
    <ScrollArea className="flex-1">
      <div className="p-3 space-y-5">
        {Object.entries(stationsByGenre).map(([genre, stations]) => (
          <div key={genre}>
            <h2 className="text-xs font-mono tracking-wider text-muted-foreground uppercase px-2 mb-2">
              {genre}
            </h2>
            <div className="space-y-0.5">
              {stations.map((station) => {
                const isActive =
                  currentItem?.type === "station" && currentItem.data.id === station.id;
                const favorited = isStationFavorited(station.id);
                return (
                  <div
                    key={station.id}
                    className={cn(
                      "flex items-center gap-2 px-2 py-2.5 rounded-md cursor-pointer group transition-colors",
                      isActive
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-accent border border-transparent"
                    )}
                    onClick={() => onPlayStation(station.id)}
                    data-testid={`btn-station-${station.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-medium text-sm truncate",
                            isActive ? "text-primary" : "text-foreground"
                          )}
                        >
                          {station.name}
                        </span>
                        {isActive && isPlaying && (
                          <BarChart2 className="w-3.5 h-3.5 text-primary animate-pulse shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {station.description}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(station);
                      }}
                      className={cn(
                        "shrink-0 transition-opacity p-1",
                        favorited ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}
                      data-testid={`btn-fav-station-${station.id}`}
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4",
                          favorited ? "fill-primary text-primary" : "text-muted-foreground"
                        )}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
