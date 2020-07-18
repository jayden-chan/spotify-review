import { topSongs, TopSongs } from "./topSongs";
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
}
