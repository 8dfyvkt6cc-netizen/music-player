import { PlayableItem } from "@/lib/types";
import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  currentItem: PlayableItem | null;
  isPlaying: boolean;
  isLoading: boolean;
};

export function NowPlaying({ currentItem, isPlaying, isLoading }: Props) {
  if (!currentItem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
        <Radio className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg">Select a station to begin</p>
        <p className="text-sm mt-1 opacity-60">Or search for a song</p>
      </div>
    );
  }

  const isTrack = currentItem.type === "track";
  const title = isTrack ? currentItem.data.trackName : currentItem.data.name;
  const subtitle = isTrack ? currentItem.data.artistName : currentItem.data.genre;
  const description = isTrack
    ? currentItem.data.collectionName
    : currentItem.data.description;
  const artwork = isTrack
    ? currentItem.data.artworkUrl100.replace("100x100bb", "600x600bb").replace("100x100", "600x600")
    : null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative p-8">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
        {artwork ? (
          <div className="mb-8 relative">
            <img
              src={artwork}
              alt={title}
              className={cn(
                "w-44 h-44 md:w-56 md:h-56 rounded-2xl shadow-2xl object-cover transition-all duration-500",
                isPlaying ? "shadow-primary/20 scale-100" : "scale-95 opacity-80"
              )}
            />
            {isPlaying && (
              <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/20" />
            )}
          </div>
        ) : (
          <div className="h-20 mb-10 flex items-end justify-center gap-1.5">
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 bg-primary rounded-t-sm animate-visualizer",
                  !isPlaying && "animation-paused",
                  `animation-delay-${(i % 7) + 1}`
                )}
                style={{ height: `${25 + ((i * 17 + 33) % 75)}%` }}
              />
            ))}
          </div>
        )}

        <div
          className={cn(
            "inline-flex items-center border px-3 py-0.5 rounded-full text-xs font-mono mb-5 transition-colors",
            isLoading
              ? "text-muted-foreground border-border"
              : isPlaying
              ? "text-primary border-primary/30 bg-primary/5"
              : "text-muted-foreground border-border"
          )}
        >
          {isLoading ? "CONNECTING..." : isPlaying ? (isTrack ? "PLAYING" : "LIVE") : "PAUSED"}
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-2 leading-tight">
          {title}
        </h2>
        <p className="text-base md:text-lg text-primary mb-2 font-medium">{subtitle}</p>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">{description}</p>

        {isTrack && (
          <p className="text-xs text-muted-foreground/50 mt-4">30-second preview via iTunes</p>
        )}
      </div>
    </div>
  );
}
