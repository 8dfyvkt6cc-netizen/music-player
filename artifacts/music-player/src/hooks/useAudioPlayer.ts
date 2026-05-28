import { useState, useEffect, useRef, useCallback } from "react";
import { Station, Track, PlayableItem } from "@/lib/types";
import { STATIONS } from "@/lib/stations";

export function useAudioPlayer() {
  const [currentItem, setCurrentItem] = useState<PlayableItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem("audio-player-volume");
    return saved ? parseFloat(saved) : 0.8;
  });
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    const onPlaying = () => { setIsPlaying(true); setIsLoading(false); };
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onError = () => { setIsLoading(false); setIsPlaying(false); };
    const onTimeUpdate = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setProgress(audio.currentTime / audio.duration);
      }
    };
    const onDurationChange = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const onEnded = () => { setIsPlaying(false); setProgress(0); };

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("error", onError);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    localStorage.setItem("audio-player-volume", volume.toString());
  }, [volume]);

  useEffect(() => {
    if (!currentItem || !("mediaSession" in navigator)) return;

    const title =
      currentItem.type === "station"
        ? currentItem.data.name
        : currentItem.data.trackName;
    const artist =
      currentItem.type === "station"
        ? currentItem.data.genre
        : currentItem.data.artistName;
    const artwork =
      currentItem.type === "track"
        ? [{ src: currentItem.data.artworkUrl100.replace("100x100", "512x512"), sizes: "512x512", type: "image/jpeg" }]
        : [];

    navigator.mediaSession.metadata = new MediaMetadata({ title, artist, artwork });
    navigator.mediaSession.setActionHandler("play", () => audioRef.current?.play().catch(() => {}));
    navigator.mediaSession.setActionHandler("pause", () => audioRef.current?.pause());
  }, [currentItem]);

  const playItem = useCallback(async (item: PlayableItem) => {
    const audio = audioRef.current;
    if (!audio) return;

    const url = item.type === "station" ? item.data.streamUrl : item.data.previewUrl;

    setCurrentItem(item);
    setProgress(0);
    setDuration(0);
    setIsLoading(true);
    audio.src = url;

    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, []);

  const playStation = useCallback(
    (stationId: string) => {
      const station = STATIONS.find((s) => s.id === stationId);
      if (!station) return;
      playItem({ type: "station", data: station });
    },
    [playItem]
  );

  const playTrack = useCallback(
    (track: Track) => {
      playItem({ type: "track", data: track });
    },
    [playItem]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else if (currentItem) {
      audio.play().catch(() => setIsPlaying(false));
    } else if (STATIONS.length > 0) {
      playStation(STATIONS[0].id);
    }
  }, [isPlaying, currentItem, playStation]);

  const seek = useCallback((pct: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = audio.duration * pct;
  }, []);

  const setVolume = useCallback((v: number) => setVolumeState(v), []);

  return {
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
  };
}
