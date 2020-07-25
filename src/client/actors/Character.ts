import { playableCharacterMap } from './index';
import { ICharacterData } from '../../interfaces/ICharacterData';

/** Character
 * Purpose: This is a character the player can play has, has such
 * it has stats and values a regular npc would not such as attack
 * and speed. It also holds a visual representation of it's self of
 * which can be created and destroyed based on if the character's sprite
 * will be being used at any given time. It also has a portrait used
 * for menus and user-interface elements.
 */

export class Character {
    /**Memeber Varibles */

    /**Sprites */
    /**The visual representation of this character, comes in the form of a
     * sprite that uses our basic character sprite sheet. */
    sprite: Phaser.GameObjects.Sprite;

    //Character Interface
    /**This interface holds all the raw data associated with a Character */
    data: ICharacterData;

    /**String */
    /**Used to store the direction the character is facing */
    facingDirection: string;
    /**A key used to grab the images associated with this character */
    key: string;

    // Misc
    /**The animation manager is global as such we just need a refernce to it
     * this makes it so we don't need to store a scene to play an animation
     * on our sprite */
    animationManager: Phaser.Animations.AnimationManager;


    /**Creates an instance of our character
     */
    constructor(incomingData?: ICharacterData) {
        if (incomingData) {
            this.data = incomingData;
        } else {
            this.data = defaultData;
        }
    }

    /**
     * Used to construct the sprite from an interface, eventually this will be
     * imported but for now
     */
    createFromKey(scene: Phaser.Scene, x: number = 0, y: number = 0) {
        this.createSprite(scene, this.key + "-spritesheet", this.key + "-portrait", x, y);
    }

    setInterface(incomingData: ICharacterData) {
        this.data = incomingData;
    }

    /**This function is used to return this chracters internal interface*/
    getInterface(): ICharacterData {
        return this.data;
    }

    /**Constructs the sprite for the character based on a spriteKey
     * @param scene The Phaser scene to initially add the sprite to
     * @param spriteKey The sprite key to create the sprite from, this will then be stored as part
     * of the class
     * @param x The x coordinate to create the sprite at
     * @param y The y coordinate to create the sprite at
     */
    createSprite(scene: Phaser.Scene, spriteKey: string, portraitKey: string, x: number = 0, y: number = 0) {
        //store this scenes animation manager
        this.animationManager = scene.anims;
        /**generate the inital sprite */
        this.sprite = scene.physics.add.sprite(x, y, spriteKey, 0);
        this.sprite.ignoreDestroy = true;
        this.sprite.setDepth(500);
        /**generate all the animations associated with this sprite */
        /**animation for character walking right */
        scene.anims.create({
            key: this.key + '-animation-walk-right',
            frames: scene.anims.generateFrameNumbers(spriteKey, { start: 8, end: 15 }),
            frameRate: 7,
            repeat: -1
        });
        //animation for character walking up
        scene.anims.create({
            key: this.key + '-animation-walk-up',
            frames: scene.anims.generateFrameNumbers(spriteKey, { start: 16, end: 23 }),
            frameRate: 7,
            repeat: -1
        });
        //animation for character walking down
        scene.anims.create({
            key: this.key + '-animation-walk-down',
            frames: scene.anims.generateFrameNumbers(spriteKey, { start: 24, end: 31 }),
            frameRate: 7,
            repeat: -1
        });
        //animation for character walking left
        scene.anims.create({
            key: this.key + '-animation-walk-left',
            frames: scene.anims.generateFrameNumbers(spriteKey, { start: 32, end: 39 }),
            frameRate: 7,
            repeat: -1
        });
        //set players inital animation
        this.sprite.anims.play(this.key + '-animation-walk-down');
        this.sprite.anims.stop();
        this.facingDirection = "down";

        //set hitbox to cover lower 16x16 block of character, around it's feet
        let body = <Phaser.Physics.Arcade.Body>this.sprite.body;
        body.setSize(16, 16, false);
        body.setOffset(8, 16);
    }

    /**Used to move the character in small increments, is meant to be used in an update loop
     * positive x moves to the right, negative to the left. postive y moves down and negative
     * move up. If the passed in speed is more then 0 then it sets the velocity to that number
     * and starts playing the correct animation otherwise if it is 0 then no movement will be made.
     * @param x positive moves right, negative moves left
     * @param y positive moves down, negative moves up
     */
    UpdateMovement(x: number, y: number) {
        //type casting the body to use arcade body methods
        let body = <Phaser.Physics.Arcade.Body>this.sprite.body;
        //reset bodies volocity to 0
        body.setVelocity(0);

        //Now we are gonna set our speeds
        if (x != 0) {
            body.setVelocityX(x);
        }
        if (y != 0) {
            body.setVelocityY(y);
        }
        //Now we normalize our speed to make sure we don't go faster on diagonals
        if (Math.abs(x) == Math.abs(y)) {
            body.velocity.normalize().scale(Math.abs(x));
        }

        /*now we determine what animation to play with a prefernce towards up
         and down if multiple keys are pressed. If no buttons are being pressed
         then set an idle animation */
        if (y > 0) {
            if (this.sprite.anims.getCurrentKey() != this.key + '-animation-walk-down') {
                this.animationManager.play(this.key + '-animation-walk-down', this.sprite);
                this.facingDirection = "down";
            }
        } else if (y < 0) {
            if (this.sprite.anims.getCurrentKey() != this.key + '-animation-walk-up') {
                this.animationManager.play(this.key + '-animation-walk-up', this.sprite);
                this.facingDirection = "up";
            }
        } else if (x > 0) {
            if (this.sprite.anims.getCurrentKey() != this.key + '-animation-walk-right') {
                this.animationManager.play(this.key + '-animation-walk-right', this.sprite);
                this.facingDirection = "right";
            }
        } else if (x < 0) {
            if (this.sprite.anims.getCurrentKey() != this.key + '-animation-walk-left') {
                this.animationManager.play(this.key + '-animation-walk-left', this.sprite);
                this.facingDirection = "left";
            }
        } else {
            if (this.sprite.anims.isPlaying) {
                this.sprite.anims.restart(false);
                this.sprite.anims.stop();
            }
        }
    }

    /**Manually sets the position of the character
     * @param x The x coordinate position in the world to set the character
     * @param y The y coordinate position in the world to set the character
     */
    setPosition(x: number, y: number) {
        this.sprite.setPosition(x, y);
    }

    /**Destroys the sprite and then sets it to null for good measure */
    destroy() {
        this.sprite.destroy();
        this.sprite = null;
    }

}

playableCharacterMap['character'] = Character;

let defaultData: ICharacterData = {
    name: "",
    focus: 0,
    endurance: 0,
    speed: 0,
    might: 0,
    battleSpeed: 0,
    life: 0,
    criticalChance: 0,
    energy: 0,
    carryCapacity: 0,
    exp: 0,
    level: 0
}