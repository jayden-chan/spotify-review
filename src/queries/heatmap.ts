import PromiseDB from "../db";

type QueryResult = {
  total_ms: number;
  day_of_year: number;
}[];

export type Heatmap = {
  heatmap: number[];
};

export async function heatmap(db: PromiseDB, year: number): Promise<Heatmap> {
  const query = `
  SELECT
    SUM(ms_played) AS total_ms,
    CAST(strftime('%j', ts) AS INT) - 1 AS day_of_year
  FROM
    endsong
  WHERE
    CAST(strftime('%Y', ts) AS INT) = ${year}
  GROUP BY
    day_of_year
  ORDER BY
    day_of_year
  `;

  const results: QueryResult = await db.all(query);
  let resultIdx = 0;
  const max = Math.max(...results.map((r) => r.total_ms));
  const heatmap: number[] = Array.from({ length: 366 }, (_, i) => {
    if (results[resultIdx]?.day_of_year !== i) {
      return 0;
    } else {
      resultIdx += 1;
      return Math.round((results[resultIdx - 1].total_ms / max) * 16);
    }
  });
  return { heatmap };
}
