type Schema = {
  [key: string]: {
    type: string;
    sql?: string;
    sqlname?: string;
  };
};

export const schema: Schema = {
  ts: { type: "string", sql: "TIMESTAMP WITH TIME ZONE" },
  username: { type: "string" },
  platform: { type: "string" },
  ms_played: { type: "number" },
  conn_country: { type: "string" },
  ip_addr_decrypted: { type: "string", sqlname: "ip_addr" },
  user_agent_decrypted: { type: "string", sqlname: "user_agent" },
  master_metadata_track_name: { type: "string", sqlname: "track_name" },
  master_metadata_album_artist_name: { type: "string", sqlname: "artist" },
  master_metadata_album_album_name: { type: "string", sqlname: "album" },
  reason_start: { type: "string" },
  reason_end: { type: "string" },
  shuffle: { type: "boolean" },
  offline: { type: "boolean" },
  offline_timestamp: { type: "number" },
  incognito_mode: { type: "boolean" },
  episode_name: { type: "string" },
  episode_show_name: { type: "string" },
  skipped: { type: "boolean" },
  metro_code: { type: "number" },
  longitude: { type: "number" },
  latitude: { type: "number" },
};
