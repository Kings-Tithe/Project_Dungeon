import { Character } from "./Character";
import { Controls } from "./Controls";

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
    path: {x: number, y: number, facing: string}[];
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

    constructor(scene: Phaser.Scene, x: number = 0, y: number = 0){
        this.money = 0;
        this.party = [];
        this.controls = new Controls(scene);
        this.currentScene = scene;
        this.x = x;
        this.y = y;
        this.freeRoamSpeed = 130;
        this.leaderChangeTimeOut = false;
        this.path = [];
        this.path[0] = {x: this.x, y: this.y, facing: "down"};
        this.startDepth = 10;
    }

    /**Adds a party member to the list by a passed in spritekey, this
     * constructs a new character object to add a new member by the character
     * object use addPartyMemberByObject() */
    addPartyMemberByKey(key: string){
        //construct our new party member and add them to the party
        let newPartyMember = new Character(this.currentScene.anims);
        newPartyMember.createSprite(this.currentScene,key,this.x,this.y);
        this.party.push(newPartyMember);
    }

    /**Adds a party member to the list by a passed in character object,
     * to add a new member using a spritekey use addPartyMemberByKey() */
    addPartyMemberByObject(newPartyMember: Character){
        this.party.push(newPartyMember);
    }

    /**Adds collision for all party members for a passed in layer within the current scene */
    addCollisionByLayer(layer: Phaser.Tilemaps.StaticTilemapLayer | Phaser.Tilemaps.DynamicTilemapLayer){
        for (let i = 0; i < this.party.length; i++){
            this.currentScene.physics.add.collider(this.party[i].sprite, layer);
        }
    }

    /**Pulls the current leader to the back of the party and moves up the party member
     * currently behind the leader */
    changeLeader(){
        //set the timeout to be true to prevent rapid changing
        this.leaderChangeTimeOut = true;
        //grab the current leaders direction to keep consistancy
        let direction = this.party[0].facingDirection;
        //remove the current leader from the front and add them to the back
        this.x = this.party[0].sprite.x;
        this.y = this.party[0].sprite.y;
        this.party.push(this.party.shift())
        //now set the new leader and make sure their facing the same direction
        this.party[0].moveTo(this.x,this.y);
        this.party[0].facingDirection = direction;
        //fix the current scenes main camera to follow the new leader
        this.currentScene.cameras.main.startFollow(this.party[0].sprite,true);
        console.log(this.party[0].name, this.party[0].sprite.scale);

        setTimeout(() => {this.leaderChangeTimeOut = false;}, 500);
    }

    /**Adds a new position to the path and checks to make sure the path
     * has not grown bigger then 120 elements */
    addToPath(newX:number, newY:number, newFacing: string){
        if (Math.abs(newX - this.path[0].x) > 3 || Math.abs(newY - this.path[0].y) > 3){
            let newlength = this.path.unshift({x:newX, y:newY, facing: newFacing});
            /*to help with performance we wait till it fill to 120 then splice off
            everyhting back down to 80 */
            if(newlength > 120){
                this.path.splice(80);
            }
        }
    }

    /**Meant to be used in sync with a scenes update loop, uses the path that follows the leader
     * of the party and makes the other party member follow behind on the path, each being a set
     * number of nodes behind the leader on the path, with a threshold of 2 pixels both ways for
     * when to stop and allow the party member to idle. */
    updatePartyOnPath(){
        for(let i = 1; i < this.party.length; i++){
            if (this.path.length > i * 3){
                let body = <Phaser.Physics.Arcade.Body>this.party[i].sprite.body;
                //determine movement for the non-leader party members
                let rangeX = Math.abs(this.path[i*3].x - this.party[i].sprite.x);
                let rangeY = Math.abs(this.path[i*3].y - this.party[i].sprite.y);
                if (rangeX > 3 || rangeY > 3){
                    this.currentScene.physics.moveTo(this.party[i].sprite, this.path[i*3].x, this.path[i*3].y, this.freeRoamSpeed);
                } else {
                    body.setVelocity(0,0);
                }
                /*determine what sprite/animation to use if currently in motion use the walk animation in the direction
                recorded by the path, else use the idle aninmation in that direction */
                if (body.velocity.x || body.velocity.y){
                    if (this.party[i].sprite.anims.getCurrentKey() != this.party[i].spriteKey + "walk_" + this.path[i*3].facing){
                        this.currentScene.anims.play(this.party[i].spriteKey + "walk_" + this.path[i*3].facing, this.party[i].sprite);
                    }
                } else {
                    if (this.party[i].sprite.anims.getCurrentKey() != this.party[i].spriteKey + "idle_" + this.path[i*3].facing){
                        this.currentScene.anims.play(this.party[i].spriteKey + "idle_" + this.path[i*3].facing, this.party[i].sprite);
                    }
                }
            }
        }
    }

    /**runs thru and updates the depth of all party members, it sets the party members
     * higher on the screen to have a lower depth then those lower on the screen allowing
     * party members to apear behind other party members */
    updateDepth(){
        //declares the format of our array and instantiatesd it
        let heightArray: {index: number, y: number}[] = [];
        //first grab all the depths of the party members
        for (let i = 0; i < this.party.length; i++){
            heightArray.push({index: i, y: this.party[i].sprite.y})
        }
        //sort the array by y value
        heightArray.sort((a,b) => {return a.y - b.y});
        //finally set their depth based on the sorted array
        for (let i = 0; i < heightArray.length; i++){
            this.party[heightArray[i].index].sprite.depth = this.startDepth + i;
        }
    }

    /**ran in the update loop of the current scene, checks for all player input and
     * runs any methods that need to be ran accordingly.
     */
    updatePlayerInput(){
        //first we'll check for key pressed related to movement and move the leader based on those
        let x = 0;
        let y = 0;
        if (this.controls.isDown("walk up")){
            y -= this.freeRoamSpeed;
        }
        if (this.controls.isDown("walk down")){
            y += this.freeRoamSpeed;
        }
        if (this.controls.isDown("walk left")){
            x -= this.freeRoamSpeed;
        }
        if (this.controls.isDown("walk right")){
            x += this.freeRoamSpeed
        }
        if (this.leaderChangeTimeOut){
            x = 0;
            y = 0;
        }
        this.party[0].UpdateMovement(x,y);
        this.addToPath(this.party[0].sprite.x, this.party[0].sprite.y, this.party[0].facingDirection);
        this.updatePartyOnPath();
        this.updateDepth();
        //check for input to change the party leader
        if (this.controls.isDown("change leader") && !this.leaderChangeTimeOut){
            this.changeLeader();
        }
    }
}