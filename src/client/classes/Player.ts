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
    path: {x: number, y: number}[];

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
        this.path[0] = {x: this.x, y: this.y};
    }

    addPartyMemeberByKey(key: string){
        /**construct our new party member and add them to the party */
        let newPartyMember = new Character(this.currentScene.anims);
        newPartyMember.createSprite(this.currentScene,key,this.x,this.y);
        //newPartyMember.sprite.setScale(0);
        this.party.push(newPartyMember);
    }

    addCollisionByLayer(layer: Phaser.Tilemaps.StaticTilemapLayer | Phaser.Tilemaps.DynamicTilemapLayer){
        for (let i = 0; i < this.party.length; i++){
            this.currentScene.physics.add.collider(this.party[i].sprite, layer);
        }
    }

    changeLeader(){
        /**set the timeout to be true to prevent rapid changing */
        this.leaderChangeTimeOut = true;
        /**removes the current leader from the front and add them to the back */
        this.x = this.party[0].sprite.x;
        this.y = this.party[0].sprite.y;
        console.log(this.party[0].name, this.party[0].sprite.scale);
        this.party.push(this.party.shift())
        /**now set the new leader */
        this.party[0].moveTo(this.x,this.y);
        /**fix the current scenes main camera to follow the new leader */
        this.currentScene.cameras.main.startFollow(this.party[0].sprite,true);
        console.log(this.party[0].name, this.party[0].sprite.scale);

        setTimeout(() => {this.leaderChangeTimeOut = false;}, 500);
    }

    /**Adds a new position to the path and check to make sure the path
     * has not grown bigger then 120 elements */
    addToPath(newX:number, newY:number){
        if (Math.abs(newX - this.path[0].x) > 4 || Math.abs(newY - this.path[0].y) > 4){
            let newlength = this.path.unshift({x:newX, y:newY});
            /*to help with performance we wait till it fill to 120 then splice off
            everyhting back down to 80*/
            if(newlength > 120){
                this.path.splice(80);
            }
        }
    }

    updatePartyOnPath(){
        for(let i = 1; i < this.party.length; i++){
            if (this.path.length > i * 3){
                let rangeX = Math.abs(this.path[i*3].x - this.party[i].sprite.x);
                let rangeY = Math.abs(this.path[i*3].y - this.party[i].sprite.y);
                if (rangeX > 3 || rangeY > 3){
                    this.currentScene.physics.moveTo(this.party[i].sprite, this.path[i*3].x, this.path[i*3].y, this.freeRoamSpeed);
                } else {
                    let body = <Phaser.Physics.Arcade.Body>this.party[i].sprite.body;
                    body.setVelocity(0,0);
                }
            }
        }
    }

    /**ran in the update loop of the current scene, checks for all player input and
     * runs any methods that need to be ran accordingly.
     */
    updatePlayerInput(){
        /**first we'll check for key pressed related to movement and move the leader based on those */
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
        this.party[0].UpdateMovement(x,y);
        this.addToPath(this.party[0].sprite.x, this.party[0].sprite.y);
        this.updatePartyOnPath();
        /**check for input to change the party leader */
        if (this.controls.isDown("change leader") && !this.leaderChangeTimeOut){
            this.changeLeader();
        }
    }
}