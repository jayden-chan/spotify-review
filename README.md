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
