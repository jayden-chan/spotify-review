import { topSongs, TopSongs } from "./topSongs";
import { topArtists, TopArtists } from "./topArtists";
import { topAlbums, TopAlbums } from "./topAlbums";
import { platforms, Platforms } from "./platforms";
import { monthlyTopArtists, MonthlyTopArtists } from "./monthlyTopArtists";
import { minutesListened, MinutesListened } from "./minutesListened";

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
    return await topSongs(this.db, sort, limit, year);
  }

  async topArtists(
    sort: string,
    limit: number,
    year?: number
  ): Promise<TopArtists> {
    return await topArtists(this.db, sort, limit, year);
  }

  async topAlbums(
    sort: string,
    limit: number,
    year?: number
  ): Promise<TopAlbums> {
    return await topAlbums(this.db, sort, limit, year);
  }

  async platforms(limit: number): Promise<Platforms> {
    return await platforms(this.db, limit);
  }

  async monthlyTopArtists(
    year: number,
    limit: number
  ): Promise<MonthlyTopArtists> {
    return await monthlyTopArtists(this.db, year, limit);
  }

  async minutesListened(): Promise<MinutesListened> {
    return await minutesListened(this.db);
  }
}
