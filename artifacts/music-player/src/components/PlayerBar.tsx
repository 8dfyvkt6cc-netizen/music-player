import { Play, Pause, Volume2, VolumeX, Radio, Loader2, BarChart2, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PlayableItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  currentItem: PlayableItem | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  progress: number;
  duration: number;
  onTogglePlay: () => void;
  onSetVolume: (v: number) => void;
  onSeek: (pct: number) => void;
  sleepTimer: number | null;
  onToggleSleepTimer: () => void;
  onExpandPlayer?: () => void;
};

function formatTime(seconds: number) {
  const s = Math.floor(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function PlayerBar({
  currentItem,
  isPlaying,
  isLoading,
  volume,
  progress,
  duration,
  onTogglePlay,
  onSetVolume,
  onSeek,
  sleepTimer,
  onToggleSleepTimer,
  onExpandPlayer,
}: Props) {
  const isTrack = currentItem?.type === "track";
  const title = !currentItem
    ? "No station selected"
    : currentItem.type === "station"
    ? currentItem.data.name
    : currentItem.data.trackName;
  const subtitle = !currentItem
    ? "—"
    : currentItem.type === "station"
    ? currentItem.data.genre
    : currentItem.data.artistName;
  const artwork = currentItem?.type === "track" ? currentItem.data.artworkUrl100 : null;

  return (
    <footer className="bg-card border-t border-border shrink-0 z-20">
      {isTrack && duration > 0 && (
        <div className="px-0">
          <Slider
            value={[progress * 100]}
            max={100}
            step={0.1}
            onValueChange={([v]) => onSeek(v / 100)}
            className="w-full rounded-none h-1"
            data-testid="slider-progress"
          />
        </div>
      )}

      <div className="h-[72px] px-4 md:px-6 flex items-center justify-between gap-2">
        {/* Left: Info */}
        <div
          className={cn(
            "flex items-center gap-3 min-w-0",
            "w-[40%] md:w-1/3",
            onExpandPlayer && "cursor-pointer md:cursor-default"
          )}
          onClick={onExpandPlayer}
        >
          <div className="w-10 h-10 rounded bg-accent flex items-center justify-center shrink-0 border border-border overflow-hidden">
            {artwork ? (
              <img src={artwork} alt={title} className="w-full h-full object-cover" />
            ) : isLoading ? (
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            ) : isPlaying ? (
              <BarChart2 className="w-4 h-4 text-primary" />
            ) : (
              <Radio className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate leading-tight">
              {title}
            </p>
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex items-center gap-3 justify-center w-[20%] md:w-1/3">
          {isTrack && duration > 0 && (
            <span className="text-xs text-muted-foreground hidden md:block tabular-nums w-10 text-right">
              {formatTime(progress * duration)}
            </span>
          )}
          <Button
            size="icon"
            variant="outline"
            className="w-11 h-11 rounded-full border-border bg-background hover:bg-accent hover:text-primary transition-all shrink-0"
            onClick={onTogglePlay}
            data-testid="btn-play-pause"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" fill="currentColor" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
            )}
          </Button>
          {isTrack && duration > 0 && (
            <span className="text-xs text-muted-foreground hidden md:block tabular-nums w-10">
              {formatTime(duration)}
            </span>
          )}
          {!isTrack && (
            <div
              className={cn(
                "text-xs font-mono px-2 py-0.5 rounded border hidden md:block",
                isLoading
                  ? "text-muted-foreground border-border"
                  : isPlaying
                  ? "text-primary border-primary/30 bg-primary/5"
                  : "text-muted-foreground border-border"
              )}
            >
              {isLoading ? "CONNECTING" : isPlaying ? "LIVE" : "PAUSED"}
            </div>
          )}
        </div>

        {/* Right: Volume + Sleep */}
        <div className="flex items-center gap-2 justify-end w-[40%] md:w-1/3">
          <button
            onClick={onToggleSleepTimer}
            className={cn(
              "p-1.5 rounded transition-colors hidden sm:flex items-center gap-1",
              sleepTimer !== null
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            data-testid="btn-sleep-timer"
            title={sleepTimer !== null ? `Sleep in ${sleepTimer}m — click to cancel` : "Sleep timer"}
          >
            <Moon className="w-4 h-4" />
            {sleepTimer !== null && (
              <span className="text-xs font-mono tabular-nums">{sleepTimer}m</span>
            )}
          </button>
          <button
            onClick={() => onSetVolume(volume === 0 ? 0.8 : 0)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            data-testid="btn-mute"
          >
            {volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <div className="w-20 md:w-24 hidden sm:block">
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={([v]) => onSetVolume(v / 100)}
              data-testid="slider-volume"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
