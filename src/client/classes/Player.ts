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

    /**Characters */
    /**An array of characters that make up your party with the first one being the leader */
    party: Character[];
    /**holds a reference to the current party leader held in the party array */
    leader: Character;

    /**Controls */
    /**Control handler used to poll keys with an update loop */
    controls: Controls;

    /**Misc */
    /**The animation manager is global as such we just need a refernce to it
     * this makes it so we don't need to store a scene to allow our party member
     * to create and play their own animations */
    animationManager: Phaser.Animations.AnimationManager;

    constructor(scene: Phaser.Scene, x: number = 0, y: number = 0){
        this.money = 0;
        this.party = [];
        this.controls = new Controls(scene);
        this.animationManager = scene.anims;
        this.x = x;
        this.y = y;
        this.freeRoamSpeed = 120;
    }

    addPartyMemeberByKey(scene: Phaser.Scene, key: string){
        /**construct our new party member and add them to the party */
        let newPartyMember = new Character(this.animationManager);
        newPartyMember.createSprite(scene,key,this.x,this.y);
        newPartyMember.sprite.setScale(0);
        this.party.push(newPartyMember);
        /**check if the party has no leader(is empty), if so make this member it's leader */
        if (this.leader == null){
            this.leader = newPartyMember;
            this.leader.sprite.setScale(1);
            this.leader.moveTo(this.x,this.y);
        }
    }

    addPartyMemberByObject(member: Character){
        this.party.push(member);
        /**check if the party has no leader(is empty), if so make this member it's leader */
        if (this.leader = null){
            this.leader = member;
        }
    }

    changeLeader(){
        /**removes the current leader from the front and add them to the back */
        let oldLeader = this.party.shift();
        oldLeader.sprite.setScale(0);
        this.x = oldLeader.sprite.x;
        this.y = oldLeader.sprite.y;
        this.party.push(oldLeader);
        /**now make the new member */
        this.leader = this.party[0];
        this.leader.sprite.setScale(1);
        this.leader.moveTo(this.x,this.y);
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
        this.leader.UpdateMovement(x,y);
    }
}