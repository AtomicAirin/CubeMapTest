# KrowdMap

An interactive/informational map for CubeKrowd's su1! Includes bases, shops, and more.

*Created & managed by Kaybeo.*

## How do I submit my own base/shop/etc?

### Option 1: Google Form

Fill out [this Google form](https://www.example.com).

### Option 2: Pull Request

Make a pull request adding the area you wish to identify to `plots.yaml`. The format is as follows:

```yaml
  - title: "Kaybeo's Base" # Please keep concise (~25 chars max) and distinct.
    description: "Kaybeo lives here! Feel free to stop by." # Try to keep on the shorter side (~300 chars max).
    sector: "Global" # Which map to display on. Options: "Global", "Shopping District", and "Spawn".
    fillColor: "#008000" # Box fill color in hex, reduced to 30% opacity on the actual map.
    borderColor: "#004d00" # Box border color in hex, reduced to 80% opacity on the actual map.
    coordinates:
      - [1000, 1500]  # (x1, y1) - First corner, like a WorldEdit selection.
      - [1200, 1650]  # (x2, y2) - Second corner.
```

*To ensure speedy entry, please notify Kaybeo on Discord once you submit a PR or Google Form.*

## FAQs

### When I submit an area, which "map" field do I choose?
Try to pick the most specific option:
- `Spawn` for spawn builds
- `Shopping District` for builds in the shopping district
- `Global` for everything else (e.g. bases)

### If I submit an area to one map, will it show up on the others?
Submissions to "Global" will appear on zoomed-in quadrant maps that they fit within. Otherwise, there is no cross-listing of maps.

### My base doesn't really fit in a rectangle.
No worries! Just try to approximate it, prioritizing the avoidance of unclaimed land.

### I want to change/remove a submission (color, size, name, etc.).
Option 1: Select "I'm updating an entry" in the Google Form linked above.

Option 2: Submit an appropriate pull request.

### How often does the Dynmap update on this website?
A script to update the maps begins every hour, taking some minutes to complete.
