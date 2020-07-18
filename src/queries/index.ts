import { topSongs, TopSongs } from "./topSongs";
import { topArtists, TopArtists } from "./topArtists";
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
}
