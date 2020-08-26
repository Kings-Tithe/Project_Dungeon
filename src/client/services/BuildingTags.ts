
/**A singlton class that holds all special items related to building */
export class BuildingTags {
    
    tags: {[tag: string]: Function}

    private constructor(){
        this.loadTags();
    }

    static get() {
        //if an instance has not been made yet, create one
        if (instance == null) {
            instance = new BuildingTags;
        }
        //as long as we have an instance, return it
        return instance;
    }

    loadTags(){
        this.tags = {
            "door": (doorTile: Phaser.Tilemaps.Tile) => {
                doorTile.rotation += 90;
            }
        }
    }
}

/**This is the varible used to store our one instance of our singlton class, this
 * is a module level variable and cannot be seen by other scripts.
 */
let instance: BuildingTags = null;