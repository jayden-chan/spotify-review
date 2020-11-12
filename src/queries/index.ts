import { topSongs, TopSongs } from "./topSongs";
import { topArtists, TopArtists } from "./topArtists";
import { topAlbums, TopAlbums } from "./topAlbums";
import { platforms, Platforms } from "./platforms";
import { monthlyTopArtists, MonthlyTopArtists } from "./monthlyTopArtists";
import { minutesListened, MinutesListened } from "./minutesListened";
import { heatmap, Heatmap } from "./heatmap";

import PromiseDB from "../db";

export default class Queries {
  db: PromiseDB;

  constructor(path: string) {
    this.db = new PromiseDB(path, true);
  }

  async topSongs(
    sort: string,
    limit: number,
    year?: number
  ): Promise<TopSongs> {
    return topSongs(this.db, sort, limit, year);
  }

  async topArtists(
    sort: string,
    limit: number,
    year?: number
  ): Promise<TopArtists> {
    return topArtists(this.db, sort, limit, year);
  }

  async topAlbums(
    sort: string,
    limit: number,
    year?: number
  ): Promise<TopAlbums> {
    return topAlbums(this.db, sort, limit, year);
  }

  async platforms(limit: number): Promise<Platforms> {
    return platforms(this.db, limit);
  }

  async monthlyTopArtists(
    year: number,
    limit: number
  ): Promise<MonthlyTopArtists> {
    return monthlyTopArtists(this.db, year, limit);
  }

  async minutesListened(): Promise<MinutesListened> {
    return minutesListened(this.db);
  }

  async heatmap(year: number): Promise<Heatmap> {
    return heatmap(this.db, year);
  }
}
