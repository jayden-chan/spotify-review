import PromiseDB from "../db";
import { MS_TO_MIN } from "../constants";

export type MinutesListened = {
  year: number;
  minutes_listened: number;
}[];

export async function minutesListened(db: PromiseDB): Promise<MinutesListened> {
  const query = `
  SELECT
    CAST(strftime('%Y', ts) AS INT) AS year,
    SUM(ms_played) / ${MS_TO_MIN} AS minutes_listened
  FROM
    endsong
  WHERE
    track_name IS NOT NULL
  GROUP BY
    year
  ORDER BY
    year DESC
  `;

  return db.all(query);
}
