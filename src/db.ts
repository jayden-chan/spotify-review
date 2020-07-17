import * as sqlite3 from "sqlite3";

export default class PromiseDB {
  db: sqlite3.Database;

  constructor(path: string) {
    this.db = new sqlite3.Database(path);
  }

  async run(query: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(query, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async all(query: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}
