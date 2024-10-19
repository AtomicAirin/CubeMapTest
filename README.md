# CubeMap

An interactive/informational map for CubeKrowd and a few of its key locations.

## How do I submit my own base/shop/etc?

**Option 1: Pull Request**

Make a pull request adding the area you wish to identify to `plots.yaml`. The format is as follows:

```yaml
  - title: "Kaybeo's Base" # the name of your area; please keep concise and distinct
    description: "A dense forest area with rich biodiversity." # a description of the area; try to keep <500 chars
    sector: "Sector 1" # which map you want to add to; current options include "General", "Shopping District", and "Spawn"
    fillColor: "#008000" # area fill color in hex, reduced to 30% opacity on the actual map
    borderColor: "#004d00" # area border color in hex, reduced to 80% opacity on the actual map
    coordinates:
      - [0.1, 0.2]  # (x1, y1) - first corner
      - [0.3, 0.4]  # (x2, y2) - second corner
```

**Option 2: Google Form**

Fill out [this Google form](https://www.example.com) with the information above.

*To ensure speedy entry, please notify Kaybeo on Discord once you submit a PR or Google Form.*
