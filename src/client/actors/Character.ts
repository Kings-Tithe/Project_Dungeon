import { ICharacterData } from '../../interfaces/ICharacterData';

/** Character
 * Purpose: This is a character the player can play has, has such
 * it has stats and values a regular npc would not such as attack
 * and speed. It also holds a visual representation of it's self.
 * Important:----------------------------------------------------
 * This class is not meant to be used on it's own and is instead
 * meant to be extended, it needs atleast a given key to properly
 * construct.
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


    /**
     * Creates an instance of our character, if a character data
     * is not passed in defaulted values at the bottom of the this
     * module will be used.
     * @param incomingData a way of setting the internal data values when
     * constructing this class
     */
    constructor(incomingData?: ICharacterData) {
        if (incomingData) {
            this.data = incomingData;
        } else {
            this.data = defaultData;
        }
    }

    /**
     * Replaces the internal data for this character in the format of ICharacterData
     * @param incomingData The data to replace the classes current data with in the
     *  format of ICharacterData
     */
    setInterface(incomingData: ICharacterData) {
        this.data = incomingData;
    }

    /**This function is used to return this chracters internal interface*/
    getInterface(): ICharacterData {
        return this.data;
    }

    /**
     * This sets the characters name
     * @param newName The name to set the character's name to
     */
    setName(newName: string){
        this.data.name = newName;
    }

    /**
     * This sets the value of the character's Focus
     * @param number Either the number to replace the current value with or
     * the number to offset the current value by
     * @param offset Determines if number replace the current value or if it
     * is added to the current value. If true then it will offset the value,
     * if set the false it will simply replace the current value, default
     * is false.
     */
    setFocus(number: number, offset: boolean = false){
        if (!offset){
            this.data.focus = number;
        } else {
            this.data.focus += number;
        }
    }

    /**
     * This sets the character's endurance
     * @param number Either the number to replace the current value with or
     * the number to offset the current value by
     * @param offset Determines if number replace the current value or if it
     * is added to the current value. If true then it will offset the value,
     * if set the false it will simply replace the current value, default
     * is false.
     */
    setEndurance(number: number, offset: boolean = false){
        if (!offset){
           this.data.endurance = number;
        } else {
            this.data.endurance += number;
        }
    }

    /**
     * This sets the character's speed
     * @param number Either the number to replace the current value with or
     * the number to offset the current value by
     * @param offset Determines if number replace the current value or if it
     * is added to the current value. If true then it will offset the value,
     * if set the false it will simply replace the current value, default
     * is false.
     */
    setSpeed(number: number, offset: boolean = false){
        if (!offset){
            this.data.speed  = number;
        } else {
            this.data.speed += number;
        }
    }

    /**
     * This sets the character's might
     * @param number Either the number to replace the current value with or
     * the number to offset the current value by
     * @param offset Determines if number replace the current value or if it
     * is added to the current value. If true then it will offset the value,
     * if set the false it will simply replace the current value, default
     * is false.
     */
    setMight (number: number, offset: boolean = false){
        if (!offset){
            this.data.might  = number;
        } else {
            this.data.might += number;
        }
    }

    /**
     * This sets the character's battle speed
     * @param number Either the number to replace the current value with or
     * the number to offset the current value by
     * @param offset Determines if number replace the current value or if it
     * is added to the current value. If true then it will offset the value,
     * if set the false it will simply replace the current value, default
     * is false.
     */
    setBattleSpeed(number: number, offset: boolean = false){
        if (!offset){
            this.data.battleSpeed  = number;
        } else {
            this.data.battleSpeed += number;
        }
    }

    /**
     * This sets the character's life
     * @param number Either the number to replace the current value with or
     * the number to offset the current value by
     * @param offset Determines if number replace the current value or if it
     * is added to the current value. If true then it will offset the value,
     * if set the false it will simply replace the current value, default
     * is false.
     */
    setLife(number: number, offset: boolean = false){
        if (!offset){
            this.data.life  = number;
        } else {
            this.data.life += number;
        }
    }

    /**
     * This sets the character's critical chance
     * @param number Either the number to replace the current value with or
     * the number to offset the current value by
     * @param offset Determines if number replace the current value or if it
     * is added to the current value. If true then it will offset the value,
     * if set the false it will simply replace the current value, default
     * is false.
     */
    setCriticalChance (number: number, offset: boolean = false){
        if (!offset){
            this.data.criticalChance  = number;
        } else {
            this.data.criticalChance += number;
        }
    }

    /**
     * This sets the character's energy
     * @param number Either the number to replace the current value with or
     * the number to offset the current value by
     * @param offset Determines if number replace the current value or if it
     * is added to the current value. If true then it will offset the value,
     * if set the false it will simply replace the current value, default
     * is false.
     */
    setEnergy(number: number, offset: boolean = false){
        if (!offset){
            this.data.energy  = number;
        } else {
            this.data.energy += number;
        }
    }

    /**
     * This sets the character's carry capacity
     * @param number Either the number to replace the current value with or
     * the number to offset the current value by
     * @param offset Determines if number replace the current value or if it
     * is added to the current value. If true then it will offset the value,
     * if set the false it will simply replace the current value, default
     * is false.
     */
    setCarryCapacity(number: number, offset: boolean = false){
        if (!offset){
            this.data.carryCapacity  = number;
        } else {
            this.data.carryCapacity += number;
        }
    }

    /**
     * This sets the character's experience
     * @param number Either the number to replace the current value with or
     * the number to offset the current value by
     * @param offset Determines if number replace the current value or if it
     * is added to the current value. If true then it will offset the value,
     * if set the false it will simply replace the current value, default
     * is false.
     */
    setExp(number: number, offset: boolean = false){
        if (!offset){
            this.data.exp  = number;
        } else {
            this.data.exp += number;
        }
    }

    /**
     * This sets the character's level
     * @param number Either the number to replace the current value with or
     * the number to offset the current value by
     * @param offset Determines if number replace the current value or if it
     * is added to the current value. If true then it will offset the value,
     * if set the false it will simply replace the current value, default
     * is false.
     */
    setLevel(number: number, offset: boolean = false){
        if (!offset){
            this.data.level  = number;
        } else {
            this.data.level += number;
        }
    }

    /**
     * This sets the character sprites's depth
     * @param newDepth The value to set the sprite's depth to
     */
    setDepth(newDepth){
        this.sprite.setDepth(newDepth);
    }


    /**Constructs the sprite for the character based on a spriteKey
     * @param scene The Phaser scene to initially add the sprite to
     * @param x The x coordinate to create the sprite at
     * @param y The y coordinate to create the sprite at
     */
    createSprite(scene: Phaser.Scene, x: number = 0, y: number = 0): boolean {
        if(this.key){
            let spriteKey = this.key + "-spritesheet";
            //store this scenes animation manager
            this.animationManager = scene.anims;
            /**generate the inital sprite */
            this.sprite = scene.physics.add.sprite(x, y, spriteKey, 0);
            /**generate all the animations associated with this sprite */
            /**animation for character walking right */
            scene.anims.create({
                key: this.key + '-animation-walk-right',
                frames: scene.anims.generateFrameNumbers(spriteKey, { start: 12, end: 15 }),
                frameRate: 8,
                repeat: -1
            });
            //animation for character walking up
            scene.anims.create({
                key: this.key + '-animation-walk-up',
                frames: scene.anims.generateFrameNumbers(spriteKey, { start: 8, end: 11 }),
                frameRate: 8,
                repeat: -1
            });
            //animation for character walking down
            scene.anims.create({
                key: this.key + '-animation-walk-down',
                frames: scene.anims.generateFrameNumbers(spriteKey, { start: 0, end: 3 }),
                frameRate: 8,
                repeat: -1
            });
            //animation for character walking left
            scene.anims.create({
                key: this.key + '-animation-walk-left',
                frames: scene.anims.generateFrameNumbers(spriteKey, { start: 4, end: 7 }),
                frameRate: 8,
                repeat: -1
            });
            //set players inital animation
            //this.sprite.anims.play(this.key + '-animation-walk-down');
            this.sprite.anims.stop();
            this.facingDirection = "down";
    
            //set hitbox to cover lower 16x16 block of character, around it's feet
            let body = <Phaser.Physics.Arcade.Body>this.sprite.body;
            body.setSize(16, 16, false);
            body.setOffset(24, 32);   
        } else {
            console.log("You must give the character class a key before trying to use it.");
            return;
        }
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
            if (this.sprite.anims.getCurrentKey() != this.key + '-animation-walk-down' || !this.sprite.anims.isPlaying) {
                this.animationManager.play(this.key + '-animation-walk-down', this.sprite);
                this.facingDirection = "down";
            }
        } else if (y < 0) {
            if (this.sprite.anims.getCurrentKey() != this.key + '-animation-walk-up' || !this.sprite.anims.isPlaying) {
                this.animationManager.play(this.key + '-animation-walk-up', this.sprite);
                this.facingDirection = "up";
            }
        } else if (x > 0) {
            if (this.sprite.anims.getCurrentKey() != this.key + '-animation-walk-right' || !this.sprite.anims.isPlaying) {
                this.animationManager.play(this.key + '-animation-walk-right', this.sprite);
                this.facingDirection = "right";
            }
        } else if (x < 0) {
            if (this.sprite.anims.getCurrentKey() != this.key + '-animation-walk-left' || !this.sprite.anims.isPlaying) {
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

/**Default values used if no interface is passed in upon construction */
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