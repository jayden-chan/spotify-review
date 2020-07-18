import PromiseDB from "../db";
import { MS_TO_HR, MS_TO_MIN } from "../constants";

export type TopArtists = {
  artist: string;
  plays: number;
  minutes_played: number;
  hours_played: number;
}[];

export async function topArtists(
  db: PromiseDB,
  sort: string,
  limit: number,
  year?: number
): Promise<TopArtists> {
  const sortCol = sort === "plays" ? "plays" : "minutes_played";
  const query = `
  SELECT
    artist,
    COUNT(ms_played) AS plays,
    ROUND(CAST(SUM(ms_played) AS REAL) / ${MS_TO_MIN}, 0) AS minutes_played,
    ROUND(CAST(SUM(ms_played) AS REAL) / ${MS_TO_HR}, 2) AS hours_played
  FROM
    endsong
  WHERE
    track_name IS NOT NULL${year ? ` AND strftime('%Y', ts) = '${year}'` : ""}
  GROUP BY
    artist
  ORDER BY
    ${sortCol} DESC
  LIMIT ${limit}
  `;

  return await db.all(query);
}
