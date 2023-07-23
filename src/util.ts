export function handleQueryError(err: any): void {
  console.error("Failed to execute query:");
  console.error(err.message);
}

export type TableData = {
  [key: string]: any;
}[];

export function printData(data: TableData, format: string) {
  if (data.length === 0) {
    console.log("No data...");
    return;
  }

  if (format === "table") {
    console.table(data);
  } else if (format === "csv") {
    const keys = Object.keys(data[0]);
    console.log(`index,` + keys.join(","));
    data.forEach((row, index) =>
      console.log(
        `${index},` +
          Object.values(row)
            .map((val) => {
              const asString = `${val}`;
              if (asString.includes(",") || asString.includes('"')) {
                return `"${asString.replace(/"/g, '""')}"`;
              }
              return asString;
            })
            .join(",")
      )
    );
  } else {
    console.error("Error: unknown format");
  }
}
