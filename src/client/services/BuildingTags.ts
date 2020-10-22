import { Player } from "../actors/Player";

/**A singlton class that holds all special items related to building */
export class BuildingTags {
    
    tags: {[tag: string]: buildingTag}

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
        this.tags = {};
        this.tags["door"] = {
            type: "area",
            setup: (scene: Phaser.Scene, object: Phaser.GameObjects.Sprite, player: Player) => {
                //set inital data
                object.setData("doorOpen", false);
                scene.physics.add.overlap(player.party[0].sprite, object,() => {
                    //if the door is closed and we are now within range
                    if(object.getData("doorOpen") == false){
                        //opens the door
                        this.tags["door"].main(object);
                        //if the interval to check if they have left the area has not been created, create it
                        if(object.data.get("interval") == undefined){
                            let interval = setInterval(() => {
                                    //check if we are still within the door's area, if we're not, run optinal and reset interval
                                    if(scene.physics.overlap(player.party[0].sprite, object) == false){
                                        this.tags["door"].optional(object);
                                        clearInterval(object.getData("interval"));
                                        object.setData("interval", undefined);
                                    }
                                },750);
                            //after creating the interval store in within the sprites data
                            object.data.set("interval", interval);
                        }
                    }
                })
            },
            main: (object: Phaser.GameObjects.Sprite) => {
                //changes the graghic to make it look like it is open
                object.rotation += Phaser.Math.DegToRad(90);
                object.setFlipX(true);
                //set the door's open state
                object.setData("doorOpen", true);
            },
            optional: (object: Phaser.GameObjects.Sprite) => {
                //changes the graghic to make it look like it is closed
                object.rotation -= Phaser.Math.DegToRad(90);
                object.setFlipX(false);
                //set the door's open state
                object.setData("doorOpen", false);
            }
        }
    }

    applyTag(key: string ,object: Phaser.GameObjects.Sprite, player: Player, scene: Phaser.Scene){
        this.tags[key].setup(scene,object,player);
    }
}

/**This is the varible used to store our one instance of our singlton class, this
 * is a module level variable and cannot be seen by other scripts.
 */
let instance: BuildingTags = null;

interface buildingTag {
    type: string,
    setup: Function,
    main: Function,
    optional: Function
}