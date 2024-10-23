# KrowdMap

An interactive/informational map for CubeKrowd's su1! Includes bases, shops, and more.

*Created & managed by Kaybeo.*

## How do I submit my own base/shop/etc?

### Option 1: Google Form

Fill out [this Google form](https://forms.gle/AFC7trTuWZtGDRMX8).

### Option 2: Pull Request

Make a pull request adding the area you wish to identify to `plots.yaml`. The format is as follows:

```yaml
  - title: "Kaybeo's Base" # Please keep concise (~25 chars max) and distinct.
    description: "Kaybeo lives here! Feel free to stop by." # Try to keep on the shorter side (~300 chars max).
    sector: "Global" # Options: "Global", "Shopping District", "Spawn"
    fillColor: "#008000" # Fill color in hex; reduced a good bit in opacity on the actual map.
    borderColor: "#004d00" # Border color in hex.
    shape: "rect" # Options: "rect", "circle", "dot"
    coordinates:
      - [1000, 1500]  # (x1, z1) - For rectangle: first corner, like a WorldEdit selection. For circle/dot: enter the center point.
      - [1200, 1650]  # (x2, z2) - For rectangle: Second corner. For circle/dot: Remove this line.
    radius: 0 # Enter a radius in blocks if shape is circle.
    img: "https://www.example.com/image.png" # Optionally include an in-game screenshot link; prefer Imgur for this
```

*To ensure speedy entry, please notify Kaybeo on Discord once you submit a PR or Google Form.*

## Potential FAQs

### When I submit an area, which region do I choose?
Try to pick the most specific option:
- `Spawn` for spawn builds
- `Shopping District` for builds in the shopping district
- `Global` for everything else (e.g. bases)

### If I submit an area to one region, will it show up on the others?
Submissions to "Global" will appear on zoomed-in quadrant maps (e.g. Northeast Quadrant) that they fit within.

### What's the 'dot' shape for?
Area names are only shown for dots when hovered over. Dots are best used to denote important sites within a larger rectangle/circle, or for small builds.

### My build doesn't really fit in a rectangle or a circle.
No worries; just try to approximate it, prioritizing the avoidance of unclaimed land. Alternatively, consider a dot for small builds.

### I want to update, change, or remove a submission.
Option 1: Select "I'm updating an entry" in the Google Form linked above.

Option 2: Submit an appropriate pull request.

### How often does the Dynmap update on this website?
Every hour-ish, slowed somewhat by the runtime. 
