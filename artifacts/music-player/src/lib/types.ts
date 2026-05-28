export type Station = {
  id: string;
  name: string;
  genre: string;
  description: string;
  streamUrl: string;
};

export type Track = {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  previewUrl: string;
  primaryGenreName: string;
  trackTimeMillis: number;
};

export type PlayableItem =
  | { type: "station"; data: Station }
  | { type: "track"; data: Track };

export type ActiveTab = "radio" | "search" | "favorites";
