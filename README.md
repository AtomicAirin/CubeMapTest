# CubeMap

An interactive/informational map for CubeKrowd's su1! Includes bases, shops, and more.

## How do I submit my own base/shop/etc?

### Option 1: Pull Request

Make a pull request adding the area you wish to identify to `plots.yaml`. The format is as follows:

```yaml
  - title: "Kaybeo's Base" # the name of your area; please keep concise and distinct
    description: "Kaybeo lives here! Feel free to stop by." # a description of the area; try to keep <500 chars
    sector: "Global" # which map you want to add to; current options include "Global", "Shopping District", and "Spawn"
    fillColor: "#008000" # area fill color in hex, reduced to 30% opacity on the actual map
    borderColor: "#004d00" # area border color in hex, reduced to 80% opacity on the actual map
    coordinates:
      - [1000, 1500]  # (x1, y1) - first corner
      - [1200, 1650]  # (x2, y2) - second corner
```

### Option 2: Google Form

Fill out [this Google form](https://www.example.com) with the information above.

*To ensure speedy entry, please notify Kaybeo on Discord once you submit a PR or Google Form.*
