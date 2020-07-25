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
    /**Sprite of the characters portrait that display when they are the leader
     * and on their character sheet */
    portrait: Phaser.GameObjects.Sprite;

    /**Numbers */
    /**Stores the characters set depth, only meant to change when changing party 
     * order, property depthOffSet uses this as a base by which to offset */
    depth: number;
    /**Keeps track of the players level */
    level: number;
    /**Keeps track of the players EXP */
    exp: number;

    /**Numbers - Base Stats: these are the 4 basic stats most the games calculations
     * for characters is based on */
    /**Represents mental & focus based abilities, a character's wit, smarts
     *  steady hand and rationale. */
    focus: number;
    /**Represents a characters survivability, their pain thresholds, poison
     *  resistance, metabolism and strength of spirit. */
    endurance: number;
    /**Represents a character's momentum and mental pacing, their reflexes,
     *  rate of action and defensive capability. */
    speed: number;
    /**Represents Physical power, a character's ability to crush, grapple, 
     * slash, and generally exert force */
    might: number;

    /**Numbers - Indirect Stats: these are useful stats that are stored instead
     * of constantly recalculate that are based on the above base stats */
    /**used as a cost for abilities and skills, increases with endurance, minor cost
     * reduction with focus */
    energy: number;
    /**A measure of how healthy or close to death depending a character is. slightly
     * affected by might and focus, greatly affected by endurance. */
    life: number;
    /**The number of spaces this character can move in battle, based on speed stat */
    battleSpeed: number;
    /**determines your changes of an attack being critical, greatly affected 
     * by focus and speed */
    criticalChance: number;

    /**String */
    /**Used to store the direction the character is facing */
    facingDirection: string;
    /**Stores the string relating to the sprite */
    spriteKey: string;
    /**Stores the string relating to the portraits's sprite */
    portraitKey: string;
    /**Stores the name of this character */
    name: string;

    // Misc
    /**The animation manager is global as such we just need a refernce to it
     * this makes it so we don't need to store a scene to play an animation
     * on our sprite */
    animationManager: Phaser.Animations.AnimationManager;


    /**Creates an instance of our character, this is passed an animation handler
     * by the player class. 
     * @param animationManager A reference to the global animation manager
     */
    constructor(animationManager: Phaser.Animations.AnimationManager) {
        this.animationManager = animationManager;
        this.depth = 10;
        this.level = 0;
        this.exp =0;
        this.focus = 0;
        this.endurance = 0;
        this.speed = 0;
        this.might = 0;
        this.energy = 0;
        this.life = 0;
        this.battleSpeed = 0;
        this.criticalChance = 0;
    }

    /**Adds the character sprite to any given scene
     * @param scene The Phaser scene to add the sprite to
     * @param spriteKey The sprite key of the given character, this only needs to be added if the sprite
     * has not be created yet.
     * @param x The x coordinate to create the sprite at if the sprite has not been created
     * @param y The y coordinate to create the sprite at if the sprite has not been created
     */
    addSpriteToScene(scene: Phaser.Scene, spriteKey: string = this.spriteKey, portraitKey: string, x: number = 0, y: number = 0) {
        //Make sure the sprite has been created, if not, create it
        if (this.sprite == null) {
            this.createSprite(scene, spriteKey, portraitKey, x, y);
        }
        scene.add.existing(this.sprite);
    }

    /**Constructs the sprite for the character based on a spriteKey
     * @param scene The Phaser scene to initially add the sprite to
     * @param spriteKey The sprite key to create the sprite from, this will then be stored as part
     * of the class
     * @param x The x coordinate to create the sprite at
     * @param y The y coordinate to create the sprite at
     */
    createSprite(scene: Phaser.Scene, spriteKey: string, portraitKey: string, x: number = 0, y: number = 0) {
        /**generate the inital sprite */
        this.sprite = scene.physics.add.sprite(x, y, spriteKey, 0);
        this.sprite.setDepth(this.depth);
        this.sprite.ignoreDestroy = true;
        this.spriteKey = spriteKey;
        this.portraitKey = portraitKey;
        this.name = spriteKey;
        /**generate all the animations associated with this sprite */
        /**animation for character walking right */
        scene.anims.create({
            key: spriteKey + 'walk_right',
            frames: scene.anims.generateFrameNumbers(spriteKey, { start: 8, end: 15 }),
            frameRate: 7,
            repeat: -1
        });
        //animation for character walking up
        scene.anims.create({
            key: spriteKey + 'walk_up',
            frames: scene.anims.generateFrameNumbers(spriteKey, { start: 16, end: 23 }),
            frameRate: 7,
            repeat: -1
        });
        //animation for character walking down
        scene.anims.create({
            key: spriteKey + 'walk_down',
            frames: scene.anims.generateFrameNumbers(spriteKey, { start: 24, end: 31 }),
            frameRate: 7,
            repeat: -1
        });
        //animation for character walking left
        scene.anims.create({
            key: spriteKey + 'walk_left',
            frames: scene.anims.generateFrameNumbers(spriteKey, { start: 32, end: 39 }),
            frameRate: 7,
            repeat: -1
        });
        //animation used to reset the frame of the character sprite
        scene.anims.create({
            key: spriteKey + 'idle',
            frames: scene.anims.generateFrameNumbers(spriteKey, { end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        //animation used to reset the frame of the character sprite after walking up
        scene.anims.create({
            key: spriteKey + 'idle_up',
            frames: scene.anims.generateFrameNumbers(spriteKey, { start: 1, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        //animation used to reset the frame of the character sprite after walking down
        scene.anims.create({
            key: spriteKey + 'idle_down',
            frames: scene.anims.generateFrameNumbers(spriteKey, { end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        //animation used to reset the frame of the character sprite after walking left
        scene.anims.create({
            key: spriteKey + 'idle_left',
            frames: scene.anims.generateFrameNumbers(spriteKey, { start: 3, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        //animation used to reset the frame of the character sprite after walking right 
        scene.anims.create({
            key: spriteKey + 'idle_right',
            frames: scene.anims.generateFrameNumbers(spriteKey, { start: 2, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        //set players inital animation
        scene.anims.play(spriteKey + "idle_down", this.sprite);
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
            if (this.sprite.anims.getCurrentKey() != this.spriteKey + 'walk_down') {
                this.animationManager.play(this.spriteKey + 'walk_down', this.sprite);
                this.facingDirection = "down";
            }
        } else if (y < 0) {
            if (this.sprite.anims.getCurrentKey() != this.spriteKey + 'walk_up') {
                this.animationManager.play(this.spriteKey + 'walk_up', this.sprite);
                this.facingDirection = "up";
            }
        } else if (x > 0) {
            if (this.sprite.anims.getCurrentKey() != this.spriteKey + 'walk_right') {
                this.animationManager.play(this.spriteKey + 'walk_right', this.sprite);
                this.facingDirection = "right";
            }
        } else if (x < 0) {
            if (this.sprite.anims.getCurrentKey() != this.spriteKey + 'walk_left') {
                this.animationManager.play(this.spriteKey + 'walk_left', this.sprite);
                this.facingDirection = "left";
            }
        } else {
            if (this.sprite.anims.getCurrentKey() != this.spriteKey + "idle_" + this.facingDirection) {
                this.animationManager.play(this.spriteKey + "idle_" + this.facingDirection, this.sprite);
            }
        }
    }

    /**Manually sets the position of the character
     * @param x The x coordinate position in the world to set the character
     * @param y The y coordinate position in the world to set the character
     */
    moveTo(x: number, y: number) {
        this.sprite.setPosition(x, y);
    }

    /**Destroys the sprite and then sets it to null for good measure */
    destroy() {
        this.sprite.destroy();
        this.sprite = null;
    }

}