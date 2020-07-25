## Depth Values

### Classes
classes that hold visual representations of their intrenal data should have a single internal depth. If they have multiple graghics
then they should take the interal depth and use fractions of it to set their depth relative to one another. This internal depth should be set by a setDepth function at the class level (You should not make the scene have to travel into the class to edit these values) and should default to 0.

### Tilemaps
Tilemaps should generally use 2 sets of depths. Background and foreground tiles ("lower" tiles) should be displayed below the player/interactable objects. Whereas overhead or overlay tiles ("upper" tiles) should be displayed above players/interactables. If multiple layers exist in the lower or upper tile depths (such as background and foreground both occupying the lower depth) then they should be further designated by decimal numbers.
See the example chart below.

### Scenes

Depth is handled at the Scene level. Therefore, every Scene should document the depth values it uses at the top of the file. Objects occupying the same depth level can be further specified with decimal values. Objects occupying a range of values can use the `~` symbol as a wildcard.
See the example chart below.

### Example Chart
``` ts
/*
Depth   | Object/Tile
----------------------------------
10      | Overlay image of some kind?
7       | Overhead Tiles
5.~     | Player
1.1     | Foreground Tiles
1       | Background Tiles
----------------------------------
*/
```