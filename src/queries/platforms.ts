import PromiseDB from "../db";
import { MS_TO_HR, MS_TO_MIN } from "../constants";

export type Platforms = {
  platform: string;
  minutes_listened: number;
  hours_listened: number;
}[];

export type MappedPlatforms = {
  mappedPlatform?: string;
  platform: string;
  minutes_listened: number;
  hours_listened: number;
}[];

export async function platforms(
  db: PromiseDB,
  limit: number
): Promise<Platforms> {
  const query = `
  SELECT
    platform,
    SUM(ms_played) / ${MS_TO_MIN} AS minutes_listened,
    ROUND(CAST(SUM(ms_played) AS REAL) / ${MS_TO_HR}, 2) AS hours_listened
  FROM
    endsong
  WHERE
    track_name IS NOT NULL
    AND reason_end = 'trackdone'
  GROUP BY
    platform
  ORDER BY
    minutes_listened DESC
  LIMIT ${limit}
  `;

  const mappedResults: MappedPlatforms = [];
  const result: Platforms = await db.all(query);
  result.forEach((row) => {
    const matches = /\((.*?)\)/.exec(row.platform);
    if (matches) {
      const [, platform] = matches;
      const matchingRow = mappedResults.find(
        (r) => r.mappedPlatform === platform
      );
      if (matchingRow) {
        matchingRow.minutes_listened += row.minutes_listened;
        matchingRow.hours_listened += row.hours_listened;
      } else {
        mappedResults.push({ ...row, mappedPlatform: platform });
      }
    } else {
      mappedResults.push(row);
    }
  });

  return mappedResults.map((r) => {
    delete r.mappedPlatform;
    return { ...r, hours_listened: Number(r.hours_listened.toFixed(2)) };
  });
}
