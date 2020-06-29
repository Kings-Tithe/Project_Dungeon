import { Character } from "./Character";
import { Controls } from "../tools/Controls";
import { EventGlobals } from "../tools/EventGlobals";

/**Player
 * Holds all the information and functionality of the player themselves
 * this is seperate from individual characters in that a player as a team
 * of character instead of playing as any one character. This class also 
 * allows you to switch party members and who the leader of your party is.
 */
export class Player {

    /**Memeber Varibles */

    /**Numbers */
    /**How much of the in-game currency the player has */
    money: number;
    /**Our players x coordinate in the world, this allows our position
     * in the world to stay consistant even when changing characters */
    x: number;
    /**Our players y coordinate in the world, this allows our position
     * in the world to stay consistant even when changing characters */
    y: number;
    /**The speed at which oue character move when in free roam */
    freeRoamSpeed: number;
    /**Used to allow the sprites of the non-leader party member to follow the leader */
    path: { x: number, y: number, facing: string; }[];
    /**the depth at which we start when setting the depth for characters it goes from here to
     * +4 of here assuming 4 party members */
    startDepth: number;

    /**Boolean */
    /**Used to tell if the party change is in timeout */
    leaderChangeTimeOut: boolean;

    /**Characters */
    /**An array of characters that make up your party with the first one being the leader */
    party: Character[];

    /**Controls */
    /**Control handler used to poll keys with an update loop */
    controls: Controls;

    /**scene */
    /**Stores a refernce to the current scene */
    currentScene: Phaser.Scene;

    //GlobalEmitter
    /**Stores a refernce to the global event emitter */
    globalEmitter: EventGlobals;

    /**Instantiates an instance of this class, this is also where alot of our default
     * values are setup and stuff like arrays are first instantiated.
     */
    constructor(scene: Phaser.Scene, x: number = 0, y: number = 0) {
        //storing passed in values
        this.currentScene = scene;
        this.x = x;
        this.y = y;
        //things that need to be instantiated before use.
        this.path = [];
        this.party = [];
        this.controls = Controls.getInstance(scene);
        //default values
        this.money = 0;
        this.freeRoamSpeed = 130;
        this.startDepth = 10;
        this.globalEmitter = EventGlobals.getInstance();
        /* priming varibles for logic, these should not be changed unless 
        the logic involving them is */
        this.leaderChangeTimeOut = false;
        this.path[0] = { x: this.x, y: this.y, facing: "down" };
    }

    /**Adds a party member to the list by a passed in spritekey, this
     * constructs a new character object to add a new member by the character
     * object use addPartyMemberByObject() */
    addPartyMemberByKey(key: string, portrait: string) {
        //construct our new party member and add them to the party
        let newPartyMember = new Character(this.currentScene.anims);
        newPartyMember.createSprite(this.currentScene, key, portrait, this.x, this.y);
        console.log("sent the thing");
        this.globalEmitter.emit("partyChange", this.party);
        this.globalEmitter.emit("addPortrait", portrait);
        this.party.push(newPartyMember);
    }

    /**Adds a party member to the list by a passed in character object,
     * to add a new member using a spritekey use addPartyMemberByKey() */
    addPartyMemberByObject(newPartyMember: Character) {
        this.globalEmitter.emit("partyChange", newPartyMember);
        this.party.push(newPartyMember);
    }

    /**Adds collision for all party members for a passed in layer within the current scene */
    addCollisionByLayer(layer: Phaser.Tilemaps.StaticTilemapLayer | Phaser.Tilemaps.DynamicTilemapLayer) {
        for (let i = 0; i < this.party.length; i++) {
            this.currentScene.physics.add.collider(this.party[i].sprite, layer);
        }
    }

    /**Pulls the current leader to the back of the party and moves up the party member
     * currently behind the leader */
    changeLeader() {
        //set the timeout to be true to prevent rapid changing
        this.leaderChangeTimeOut = true;
        //grab the current leaders direction to keep consistancy
        let direction = this.party[0].facingDirection;
        //store current leaders coordinates for consistancy
        this.x = this.party[0].sprite.x;
        this.y = this.party[0].sprite.y;
        //remove the current leader from the front and add them to the back
        this.party.push(this.party.shift());
        //set the new leader and make sure their facing the same direction as the old one
        this.party[0].moveTo(this.x, this.y);
        this.party[0].facingDirection = direction;
        //change the hud's portrait to refelct the new leader
        this.globalEmitter.emit("changePortrait",this.party[0].portraitKey);
        //fix the current scenes main camera to follow the new leader
        this.currentScene.cameras.main.startFollow(this.party[0].sprite, true);
        //set timeout to allow for leader changing again
        setTimeout(() => { this.leaderChangeTimeOut = false; }, 500);
    }

    /**Adds a new point/node to the path and checks to make sure the path
     * has not grown bigger then 120 elements */
    addToPath(newX: number, newY: number, newFacing: string) {
        /* We only add to the path if the passed in position varies by atleast 3 pixels from
        the last recorded point/node */
        if (Math.abs(newX - this.path[0].x) > 3 || Math.abs(newY - this.path[0].y) > 3) {
            //unshift adds an element to the front of the array and returns the new length of the array
            let newlength = this.path.unshift({ x: newX, y: newY, facing: newFacing });
            /*to help with performance we wait till it fill to 120 then splice off
            everyhting back down to 80 */
            if (newlength > 120) {
                this.path.splice(80);
            }
        }
    }

    /**Meant to be used in sync with a scenes update loop, uses the path that follows the leader
     * of the party and makes the other party member follow behind on the path, each being a set
     * number of nodes behind the leader on the path, with a threshold of 2 pixels both ways for
     * when to stop and allow the party member to idle. */
    updatePartyOnPath() {
        /**The area the chracter must be within of the target area to idle */
        let idleZone: number = 3;
        /**The number of nodes down the path each character stays back from one another */
        let nodeOffSet: number = 5;
        //run for each non-leader member of the party
        for (let i = 1; i < this.party.length; i++) {
            //make sure there is enough nodes on the path to follow to
            if (this.path.length > i * nodeOffSet) {
                /**The pysics body of the party members sprite */
                let body = <Phaser.Physics.Arcade.Body>this.party[i].sprite.body;
                /**the distance on the x-axis between our current position and desired position */
                let differenceX = Math.abs(this.path[i * nodeOffSet].x - this.party[i].sprite.x);
                /**the distance on the y-axis between our current position and desired position */
                let differenceY = Math.abs(this.path[i * nodeOffSet].y - this.party[i].sprite.y);

                /*if we have for some reason gotten more then 50 pixels from our target, this is kinda as a
                last resort catch if anything get in their way or stops them for some reason */
                if (Math.hypot(differenceX, differenceY) > 30) {
                    this.party[i].moveTo(this.path[i * nodeOffSet].x, this.path[i * nodeOffSet].y);
                } //if we are atleast more then 3 pixels away from our target but not more then 50 
                else if (Math.hypot(differenceX, differenceY) > 3) {
                    this.currentScene.physics.moveTo(this.party[i].sprite, this.path[i * nodeOffSet].x, this.path[i * nodeOffSet].y, this.freeRoamSpeed * 1.1535);
                } //if we are within 3 pixels of our target then make the character stop moving
                else {
                    body.setVelocity(0, 0);
                }
                /*determine what sprite/animation to use if currently in motion use the walk animation in the direction
                recorded by the path, else use the idle aninmation in that direction */
                if (body.velocity.x || body.velocity.y) {
                    /* check if the animation is already playing, otherwise it will restart it repeatadle making it 
                    look like only the first frame of the animation */
                    if (this.party[i].sprite.anims.getCurrentKey() != this.party[i].spriteKey + "walk_" + this.path[i * nodeOffSet].facing) {
                        this.currentScene.anims.play(this.party[i].spriteKey + "walk_" + this.path[i * nodeOffSet].facing, this.party[i].sprite);
                    }
                } else {
                    /* check if the animation is already playing, otherwise it will restart it repeatadle making it 
                    look like only the first frame of the animation */
                    if (this.party[i].sprite.anims.getCurrentKey() != this.party[i].spriteKey + "idle_" + this.path[i * nodeOffSet].facing) {
                        this.currentScene.anims.play(this.party[i].spriteKey + "idle_" + this.path[i * nodeOffSet].facing, this.party[i].sprite);
                    }
                }
            }
        }
    }

    /**runs thru and updates the depth of all party members, it sets the party members
     * higher on the screen (lower y value) to have a lower depth then those lower on the screen
     * (higher y value) allowing party members to apear behind other party members */
    updateDepth() {
        //declares the format of our array and instantiatesd it
        let heightArray: { index: number, y: number; }[] = [];
        //first grab all the depths of the party members
        for (let i = 0; i < this.party.length; i++) {
            heightArray.push({ index: i, y: this.party[i].sprite.y });
        }
        //sort the array by y value
        heightArray.sort((a, b) => { return a.y - b.y; });
        //finally set their depth based on the sorted array
        for (let i = 0; i < heightArray.length; i++) {
            this.party[heightArray[i].index].sprite.depth = this.startDepth + i;
        }
    }

    /**Makes calls to any functions that should be run in sync with the update loop
     * Meant to be called after updatePlayerInput.
     */
    update() {
        this.addToPath(this.party[0].sprite.x, this.party[0].sprite.y, this.party[0].facingDirection);
        this.updatePartyOnPath();
        this.updateDepth();
    }

    /**ran in the update loop of the current scene, checks for all player input and
     * runs any methods that need to be ran accordingly.
     */
    updatePlayerInput() {
        //first we'll check for key pressed related to movement and move the leader based on those
        let x = 0;
        let y = 0;
        if (this.controls.isDown("walk up")) {
            y -= this.freeRoamSpeed;
        }
        if (this.controls.isDown("walk down")) {
            y += this.freeRoamSpeed;
        }
        if (this.controls.isDown("walk left")) {
            x -= this.freeRoamSpeed;
        }
        if (this.controls.isDown("walk right")) {
            x += this.freeRoamSpeed;
        }
        if (this.leaderChangeTimeOut) {
            x = 0;
            y = 0;
        }
        this.party[0].UpdateMovement(x, y);
        //check for input to change the party leader
        if (this.controls.isDown("change leader") && !this.leaderChangeTimeOut) {
            this.changeLeader();
        }
    }
}