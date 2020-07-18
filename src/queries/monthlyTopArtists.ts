import PromiseDB from "../db";
import { MONTH_NAMES } from "../constants";
const SEPERATOR = "__spotify-review-sep__";

export type MonthlyTopArtists = {
  top_artists: string[];
  month: string;
}[];

export async function monthlyTopArtists(
  db: PromiseDB,
  year: number,
  limit: number
): Promise<MonthlyTopArtists> {
  const query = `WITH artists_per_month AS (
    SELECT
      artist,
      CAST(strftime('%m', ts) AS INT) AS month,
      SUM(ms_played) AS total_ms
    FROM
      endsong
    WHERE
      strftime('%Y', ts) = '${year}'
      AND artist IS NOT NULL
    GROUP BY
      artist,
      month
  ), ranks AS (
    SELECT
      artist,
      month,
      RANK() OVER (PARTITION BY month ORDER BY total_ms DESC) AS rank
    FROM
      artists_per_month
  )
  SELECT
    GROUP_CONCAT(artist, '${SEPERATOR}') AS top_artists,
    month
  FROM
    ranks
  WHERE
    rank <= ${limit}
  GROUP BY
    month
  ORDER BY
    month
  `;

  return (await db.all(query)).map((row) => {
    row.month = MONTH_NAMES[row.month - 1];
    row.top_artists = row.top_artists.split(SEPERATOR);
    return row;
  });
}
