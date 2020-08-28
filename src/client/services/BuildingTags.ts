
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
                if(doorTile.flipX == false){
                    doorTile.rotation += Phaser.Math.DegToRad(90);
                    doorTile.setFlipX(true);
                    doorTile.setCollision(false,false,false,false)
                } else {
                    doorTile.rotation -= Phaser.Math.DegToRad(90);
                    doorTile.setFlipX(false);
                    doorTile.setCollision(true,true,true,true);
                }
                
            }
        }
    }
}

/**This is the varible used to store our one instance of our singlton class, this
 * is a module level variable and cannot be seen by other scripts.
 */
let instance: BuildingTags = null;