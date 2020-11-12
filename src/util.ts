export function handleQueryError(err: any): void {
  console.error("Failed to execute query:");
  console.error(err.message);
}
