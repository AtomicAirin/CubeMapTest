# KrowdMap

An interactive/informational map for CubeKrowd's su1! Includes bases, shops, and more.

## How do I submit my own base/shop/etc?

### Option 1: Pull Request

Make a pull request adding the area you wish to identify to `plots.yaml`. The format is as follows:

```yaml
  - title: "Kaybeo's Base" # Please keep concise (~20 chars max) and distinct.
    description: "Kaybeo lives here! Feel free to stop by." # Try to keep on the shorter side (~300 chars max).
    sector: "Global" # Which map to display on. Options: "Global", "Shopping District", and "Spawn".
    fillColor: "#008000" # Box fill color in hex, reduced to 30% opacity on the actual map.
    borderColor: "#004d00" # Box border color in hex, reduced to 80% opacity on the actual map.
    coordinates:
      - [1000, 1500]  # (x1, y1) - First corner, like a WorldEdit selection.
      - [1200, 1650]  # (x2, y2) - Second corner.
```

### Option 2: Google Form

Fill out [this Google form](https://www.example.com) with the information above.

*To ensure speedy entry, please notify Kaybeo on Discord once you submit a PR or Google Form.*
