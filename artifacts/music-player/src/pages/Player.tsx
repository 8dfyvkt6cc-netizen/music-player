import { useState, useEffect, useCallback } from "react";
import { Radio, Search, Heart, X, ChevronUp } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useFavorites } from "@/hooks/useFavorites";
import { Station, Track } from "@/lib/types";
import { RadioTab } from "@/components/RadioTab";
import { SearchTab } from "@/components/SearchTab";
import { FavoritesTab } from "@/components/FavoritesTab";
import { NowPlaying } from "@/components/NowPlaying";
import { PlayerBar } from "@/components/PlayerBar";
import { cn } from "@/lib/utils";

type ActiveTab = "radio" | "search" | "favorites";

const SLEEP_TIMER_MINUTES = [15, 30, 60, 90];

export default function Player() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("radio");
  const [sleepTimerIdx, setSleepTimerIdx] = useState<number | null>(null);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [mobilePlayerOpen, setMobilePlayerOpen] = useState(false);

  const {
    currentItem,
    isPlaying,
    isLoading,
    volume,
    progress,
    duration,
    playStation,
    playTrack,
    togglePlay,
    setVolume,
    seek,
  } = useAudioPlayer();

  const {
    favorites,
    toggleStation,
    toggleTrack,
    isStationFavorited,
    isTrackFavorited,
  } = useFavorites();

  // Sleep timer countdown (per minute)
  useEffect(() => {
    if (sleepTimer === null) return;
    if (sleepTimer <= 0) {
      if (isPlaying) togglePlay();
      setSleepTimer(null);
      setSleepTimerIdx(null);
      return;
    }
    const id = setInterval(() => setSleepTimer((t) => (t !== null ? t - 1 : null)), 60_000);
    return () => clearInterval(id);
  }, [sleepTimer, isPlaying, togglePlay]);

  const handleToggleSleepTimer = useCallback(() => {
    if (sleepTimer !== null) {
      setSleepTimer(null);
      setSleepTimerIdx(null);
      return;
    }
    const idx = 0;
    setSleepTimerIdx(idx);
    setSleepTimer(SLEEP_TIMER_MINUTES[idx]);
  }, [sleepTimer]);

  const tabs = [
    { id: "radio" as ActiveTab, label: "Radio", icon: Radio },
    { id: "search" as ActiveTab, label: "Search", icon: Search },
    { id: "favorites" as ActiveTab, label: "Liked", icon: Heart },
  ];

  const tabContent = (
    <>
      {activeTab === "radio" && (
        <RadioTab
          currentItem={currentItem}
          isPlaying={isPlaying}
          onPlayStation={playStation}
          isStationFavorited={isStationFavorited}
          onToggleFavorite={toggleStation}
        />
      )}
      {activeTab === "search" && (
        <SearchTab
          currentItem={currentItem}
          isPlaying={isPlaying}
          onPlayTrack={playTrack}
          isTrackFavorited={isTrackFavorited}
          onToggleFavorite={toggleTrack}
        />
      )}
      {activeTab === "favorites" && (
        <FavoritesTab
          favorites={favorites}
          currentItem={currentItem}
          isPlaying={isPlaying}
          onPlayStation={playStation}
          onPlayTrack={playTrack}
          onToggleStation={toggleStation}
          onToggleTrack={toggleTrack}
        />
      )}
    </>
  );

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Mobile expanded Now Playing overlay */}
      {mobilePlayerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between px-4 pt-safe-top py-3 border-b border-border shrink-0">
            <button
              onClick={() => setMobilePlayerOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="btn-close-expanded"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Now Playing
            </span>
            <div className="w-5" />
          </div>
          <NowPlaying
            currentItem={currentItem}
            isPlaying={isPlaying}
            isLoading={isLoading}
          />
          <PlayerBar
            currentItem={currentItem}
            isPlaying={isPlaying}
            isLoading={isLoading}
            volume={volume}
            progress={progress}
            duration={duration}
            onTogglePlay={togglePlay}
            onSetVolume={setVolume}
            onSeek={seek}
            sleepTimer={sleepTimer}
            onToggleSleepTimer={handleToggleSleepTimer}
          />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* ── Desktop sidebar ── */}
        <aside className="hidden md:flex w-72 lg:w-80 bg-sidebar border-r border-border flex-col shrink-0">
          {/* Logo */}
          <div className="h-14 flex items-center px-5 border-b border-border shrink-0">
            <Radio className="w-4 h-4 text-primary mr-2.5 shrink-0" />
            <h1 className="font-semibold tracking-widest text-xs text-sidebar-foreground">
              STREAM.AUDIO
            </h1>
          </div>

          {/* Tab nav */}
          <div className="flex border-b border-border shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-testid={`btn-tab-${tab.id}`}
                className={cn(
                  "flex-1 flex flex-col items-center py-2.5 gap-1 text-xs transition-colors",
                  activeTab === tab.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex flex-col flex-1 overflow-hidden">{tabContent}</div>
        </aside>

        {/* ── Mobile: full-width content ── */}
        <div className="md:hidden flex-1 flex flex-col overflow-hidden">
          <div className="h-12 flex items-center px-4 border-b border-border shrink-0">
            <Radio className="w-4 h-4 text-primary mr-2 shrink-0" />
            <h1 className="font-semibold tracking-widest text-xs">STREAM.AUDIO</h1>
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">{tabContent}</div>
        </div>

        {/* ── Desktop: Now Playing center ── */}
        <main className="hidden md:flex flex-1 flex-col bg-gradient-to-b from-background via-background to-card overflow-hidden">
          <NowPlaying
            currentItem={currentItem}
            isPlaying={isPlaying}
            isLoading={isLoading}
          />
        </main>
      </div>

      {/* ── Player bar (always visible) ── */}
      <PlayerBar
        currentItem={currentItem}
        isPlaying={isPlaying}
        isLoading={isLoading}
        volume={volume}
        progress={progress}
        duration={duration}
        onTogglePlay={togglePlay}
        onSetVolume={setVolume}
        onSeek={seek}
        sleepTimer={sleepTimer}
        onToggleSleepTimer={handleToggleSleepTimer}
        onExpandPlayer={currentItem ? () => setMobilePlayerOpen(true) : undefined}
      />

      {/* ── Mobile bottom tab bar ── */}
      <nav className="md:hidden bg-card border-t border-border flex shrink-0 h-14">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setMobilePlayerOpen(false); }}
            data-testid={`btn-mobile-tab-${tab.id}`}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-colors",
              activeTab === tab.id ? "text-primary" : "text-muted-foreground"
            )}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
        {/* Expand button shortcut on mobile */}
        {currentItem && (
          <button
            onClick={() => setMobilePlayerOpen(true)}
            data-testid="btn-expand-mobile"
            className="flex-1 flex flex-col items-center justify-center gap-1 text-xs text-muted-foreground"
          >
            <ChevronUp className="w-5 h-5" />
            <span>Now</span>
          </button>
        )}
      </nav>
    </div>
  );
}
