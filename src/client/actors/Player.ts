import { Character } from "./Character";
import { Controls } from "../services/Controls";
import { SignalManager } from "../services/SignalManager";
import { playableCharacterMap } from './index'
import { ICharacterData } from "../../interfaces/ICharacterData";

/**Player
 * Holds all the information and functionality of the player themselves
 * this is seperate from individual characters in that a player as a team
 * of characters instead of playing as any one character. This class also 
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
     * the next whole integar, we use decimals to set the characters to one another.*/
    depth: number;
    /**The area non-leader chracters must be within of the target area on the path to idle */
    idleZone: number;
    /**The number of nodes down the path each character stays back from one another */
    nodeOffSet: number;

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
    globalEmitter: SignalManager;

    // Tile layers that the party should collide with
    collisionLayers: (Phaser.Tilemaps.StaticTilemapLayer | Phaser.Tilemaps.DynamicTilemapLayer)[];

    /**Instantiates an instance of this class, this is also where alot of our default
     * values are setup and stuff like arrays are first instantiated.
     * @param scene The phaser scene to construct this in
     * @param x     The x coordinate for the party to start at
     * @param y     The y coordinate for the party to start at
     */
    constructor(scene: Phaser.Scene, x: number = 0, y: number = 0) {
        //storing passed in values
        this.currentScene = scene;
        this.x = x;
        this.y = y;
        //things that need to be instantiated before use.
        this.collisionLayers = [];
        this.path = [];
        this.party = [];
        this.controls = Controls.getInstance();
        //default values
        this.money = 0;
        this.freeRoamSpeed = 130;
        this.depth = 0;
        this.nodeOffSet = 5;
        this.idleZone = 3;
        this.globalEmitter = SignalManager.get();
        /* priming varibles for logic, these should not be changed unless 
        the logic involving them is */
        this.leaderChangeTimeOut = false;
        this.path[0] = { x: this.x, y: this.y, facing: "down" };
    }

    /**
     * This sets the classes internal depth, for more on class level
     * depths see the client folder's README
     * @param newDepth The number to set the internal depth to
     */
    setDepth(newDepth: number){
        this.depth = newDepth;
    }

    /**
     * Adds a party member to the list by a passed in class key, this
     * constructs a new character object, to add a new member by the character
     * object use addPartyMemberByObject()
     * @param key The sprite key for this party members sprite */
    addPartyMemberByKey(scene: Phaser.Scene, key: string, data?: ICharacterData){
        let characterClass: (typeof Character) = playableCharacterMap[key];
        console.log(playableCharacterMap);
        console.log(key,characterClass);
        //construct our new party member and add them to the party
        let newPartyMember;
        if(data){
            newPartyMember = new characterClass(data);
        } else {
            newPartyMember = new characterClass();
        }
        newPartyMember.createSprite(scene, this.x, this.y);
        this.party.push(newPartyMember);
        // Add colliders between this party member and all collision layers
        this.collisionLayers.forEach((layer) => {
            this.currentScene.physics.add.collider(newPartyMember.sprite, layer);
        }, this);
        this.globalEmitter.emit("partyChange", this.party);
        if (this.party.length < 2){
            this.globalEmitter.emit("changePortrait", this.party[0].key + "-portrait");
        }
        this.updateDepth();
    }

    /**Adds a party member to the list by a passed in character object,
     * to add a new member using a spritekey use addPartyMemberByKey()
     * @param newPartyMember The Character object of the party member to be added
     */
    addPartyMemberByObject(newPartyMember: Character) {
        this.globalEmitter.emit("partyChange", newPartyMember);
        this.party.push(newPartyMember);
    }

    /**Adds collision for all party members for a passed in layer within the current scene 
     * @param layer The layer to add collison to, collison is added between all party 
     * members and this layer
    */
    addCollisionByLayer(layer: Phaser.Tilemaps.StaticTilemapLayer | Phaser.Tilemaps.DynamicTilemapLayer) {
        // Add the layer to list of collision layers
        this.collisionLayers.push(layer);
        // Add a collider for each party member to this layer
        this.party.forEach((member) => {
            this.currentScene.physics.add.collider(member.sprite, layer);
        }, this);
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
        this.party[0].setPosition(this.x, this.y);
        this.party[0].facingDirection = direction;
        //change the hud's portrait to refelct the new leader
        this.globalEmitter.emit("changePortrait", this.party[0].key + '-portrait');
        //fix the current scenes main camera to follow the new leader
        this.currentScene.cameras.main.startFollow(this.party[0].sprite, true);
        //set timeout to allow for leader changing again
        setTimeout(() => { this.leaderChangeTimeOut = false; }, 500);
    }

    /**Adds a new point/node to the path and checks to make sure the path
     * has not grown bigger then the number of characters times 35 nodes.
     * When it is bigger then that limit we splice it back down to 20 times
     * the number of characters in the party.
     * @param newX      The x coordinate of the point trying to be added
     * @param newY      The x coordinate of the point trying to be added
     * @param newFacing The direction the leader is facing at this point
     */
    addToPath(newX: number, newY: number, newFacing: string) {
        /* We only add to the path if the passed in position varies by atleast 3 pixels from
        the last recorded point/node */
        if (Math.abs(newX - this.path[0].x) > 3 || Math.abs(newY - this.path[0].y) > 3) {
            //unshift adds an element to the front of the array and returns the new length of the array
            let newlength = this.path.unshift({ x: newX, y: newY, facing: newFacing });
            /*to help with performance we wait till it fill to (characters * 35) then splice off
            everything back down to (characters * 20) */
            if (newlength > (this.party.length * 35)) {
                this.path.splice(this.party.length * 20);
            }
        }
    }

    /**Meant to be used in sync with a scenes update loop, uses the path that follows the leader
     * of the party and makes the other party member follow behind on the path, each being a set
     * number of nodes behind the leader on the path, with a threshold of 2 pixels both ways for
     * when to stop and allow the party member to idle. */
    updatePartyOnPath() {
        //run for each non-leader member of the party
        for (let i = 1; i < this.party.length; i++) {
            //make sure there is enough nodes on the path to follow to
            if (this.path.length > i * this.nodeOffSet) {
                /**The pysics body of the party members sprite */
                let body = <Phaser.Physics.Arcade.Body>this.party[i].sprite.body;
                /**the distance on the x-axis between our current position and desired position */
                let differenceX = Math.abs(this.path[i * this.nodeOffSet].x - this.party[i].sprite.x);
                /**the distance on the y-axis between our current position and desired position */
                let differenceY = Math.abs(this.path[i * this.nodeOffSet].y - this.party[i].sprite.y);

                /*if we have for some reason gotten more then 30 pixels from our target, this is kinda as a
                last resort catch if anything get in their way or stops them for some reason */
                if (Math.hypot(differenceX, differenceY) > 30) {
                    this.party[i].setPosition(this.path[i * this.nodeOffSet].x, this.path[i * this.nodeOffSet].y);
                } //if we are atleast more then 3 pixels away from our target but not more then 50 
                else if (Math.hypot(differenceX, differenceY) > this.idleZone) {
                    this.currentScene.physics.moveTo(this.party[i].sprite, this.path[i * this.nodeOffSet].x, this.path[i * this.nodeOffSet].y, this.freeRoamSpeed * 1.1535);
                } //if we are within 3 pixels of our target then make the character stop moving
                else {
                    body.setVelocity(0, 0);
                }
                /*determine what sprite/animation to use if currently in motion use the walk animation in the direction
                recorded by the path, else use the idle aninmation in that direction */
                if (body.velocity.x || body.velocity.y) {
                    /* check if the animation is already playing, otherwise it will restart it repeatadle making it 
                    look like only the first frame of the animation */
                    if (this.party[i].sprite.anims.getCurrentKey() != `${this.party[i].key}-animation-walk-${this.path[i * this.nodeOffSet].facing}`) {
                        this.currentScene.anims.play(`${this.party[i].key}-animation-walk-${this.path[i * this.nodeOffSet].facing}`, this.party[i].sprite);
                    }
                } else {
                    /* check if the animation is already playing, otherwise it will restart it repeatadle making it 
                    look like only the first frame of the animation */
                    if (this.party[i].sprite.anims.isPlaying) {
                        this.party[i].sprite.anims.restart(false);
                        this.party[i].sprite.anims.stop();
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
        /**The amount that each character is from each other depth wise */
        let increment = 1 / heightArray.length;
        for (let i = 0; i < heightArray.length; i++) {
            this.party[heightArray[i].index].setDepth(this.depth + (increment * i));
        }
    }

    /**Makes calls to any functions that should be run in sync with the update loop
     * Meant to be called after updatePlayerInput.
     */
    update() {
        //these should be ran no matter what
        this.addToPath(this.party[0].sprite.x, this.party[0].sprite.y, this.party[0].facingDirection);
        this.updatePartyOnPath();
        //this should only be ran if the y coordinate of our leader has changed
        if (this.party[0].sprite.y != this.y) {
            this.updateDepth();
        }
        //store our current y to check if we changed y next update
        this.y = this.party[0].sprite.y;
    }

    /**ran in the update loop of the current scene, checks for all player input and
     * runs any methods that need to be ran accordingly.
     */
    updatePlayerInput() {
        //first we'll check for key pressed related to movement and move the leader based on those
        let x = 0;
        let y = 0;
        if (this.controls.isDown("Player", "walk up")) {
            y -= this.freeRoamSpeed;
        }
        if (this.controls.isDown("Player", "walk down")) {
            y += this.freeRoamSpeed;
        }
        if (this.controls.isDown("Player", "walk left")) {
            x -= this.freeRoamSpeed;
        }
        if (this.controls.isDown("Player", "walk right")) {
            x += this.freeRoamSpeed;
        }
        if (this.leaderChangeTimeOut) {
            x = 0;
            y = 0;
        }
        this.party[0].UpdateMovement(x, y);
        //check for input to change the party leader
        if (this.controls.isDown("Player", "change leader") && !this.leaderChangeTimeOut) {
            this.changeLeader();
        }
    }
}