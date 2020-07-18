# spotify-review

Analyze your Spotify listening data

## Installation
```bash
npm install -g spotify-review
```

## Usage

Setup your database:
```bash
spotify-review init /path/to/EndSong.json
```

Once your database is set up you can perform individual queries or generate a full
report:
```bash
spotify-review report
spotify-review analyze topSongs
```

To view available analysis commands use:
```bash
spotify-review analyze --help
```

## Notes
* Q: Why is the minutes listened calculation so much higher than what I see in Spotify
    Wrapped?

  A: I'm not really sure. Ultimately I don't know what Spotify counts as "listening time"
  in their calculation. For a given year, `spotify-review` uses the sum of `ms_played`
  (converted to minutes) for any entry with a `track_name` field and `ts` in that year.

  I've tried many other criteria for what "listening time" is, including:
  * filtering tracks that stopped due to errors
  * requiring a minimum amount of time listened (10s, 20s, 30s etc)
  * selecting entries from the previous year's Spotify Wrapped date until the current
      year's date
  * selecting entries between Jan 1 and Oct 31
  * many more

  Selecting entries between Jan 1 and Oct 31 gets pretty close usually but
  it's never exact, so I don't think that's correct. The "listening time" calculation
  also seems to affect the Top (Songs/Albums/Artists) calculations, since those don't
  quite align with what Spotify provides either (although they are very close).  If you
  have any ideas open an issue/PR.
