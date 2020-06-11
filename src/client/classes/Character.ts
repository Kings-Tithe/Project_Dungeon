/** Character
 * Purpose: This is a character the player can play has, has such
 * it has stats and values a regular npc would not such as attack
 * and speed. It also hold a visual representation of it's self of
 * which can be created and destroy based on if the character's sprite
 * will be being used at any given time. It also has a portrait used
 * for menus and user-interface elements.
 */

export class Character {
    /**Memeber Varibles */

    /**Sprites */
    /**The visual representation of this character, comes in the form of a
     * sprite that uses our basic character sprite sheet. */
    sprite: Phaser.GameObjects.Sprite;

    /**Numbers */
    /**Stores the characters set depth, only meant to change when changing party 
     * order, property depthOffSet uses this as a base by which to offset */
    depth: number;
    /**The speed at which the character walks*/
    speed: number;
    /**The number of spaces this character can move in battle */
    battleSpeed: number;

    /**String */
    /**Used to store the direction the character is facing */
    facingDirection: string;

    constructor(){

    }

    addSpriteToScene(scene: Phaser.Scene, x: number = 0, y: number = 0){
        /**Make sure the sprite has been created, if not, create it */
        if (this.sprite == null){
            this.createPlayerSprite(scene,x,y);
        }
        scene.add.existing(this.sprite);
    }

    /**Right now this just creates a test sprite dude to walk around the world with
     * and run some testing. Eventually when we have actaully characters made this
     * will construct the sprite for a character based on a player/characters interface
     */
    createPlayerSprite(scene: Phaser.Scene, x: number = 0, y: number = 0) {
        /**generate the inital sprite */
        this.sprite = scene.physics.add.sprite(x, y, "character_template", 0);
        this.sprite.setDepth(this.depth);
        /**generate all the animations associated with this sprite */
        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('character_template', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation for character walking left */
        scene.anims.create({
            key: 'up',
            frames: scene.anims.generateFrameNumbers('character_template', { start: 16, end: 23 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation for character walking left */
        scene.anims.create({
            key: 'down',
            frames: scene.anims.generateFrameNumbers('character_template', { start: 24, end: 31 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation for character walking left */
        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('character_template', { start: 32, end: 39 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation used to reset the frame of the character sprite */
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('character_template', { end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation used to reset the frame of the character sprite after walking up */
        scene.anims.create({
            key: 'idle_up',
            frames: scene.anims.generateFrameNumbers('character_template', { start:1, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation used to reset the frame of the character sprite after walking down */
        scene.anims.create({
            key: 'idle_down',
            frames: scene.anims.generateFrameNumbers('character_template', { end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation used to reset the frame of the character sprite after walking left */
        scene.anims.create({
            key: 'idle_left',
            frames: scene.anims.generateFrameNumbers('character_template', { start:3, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation used to reset the frame of the character sprite after walking right */
        scene.anims.create({
            key: 'idle_right',
            frames: scene.anims.generateFrameNumbers('character_template', { start:2, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        /**set players inital animation */
        scene.anims.play("idle_down", this.sprite);
        this.facingDirection = "down";

        /**set hitbox to cover lower 16x16 block of character, around it's feet*/
        let body = <Phaser.Physics.Arcade.Body>this.sprite.body;
        body.setSize(16,16,false);
        body.setOffset(8,16);
    }

    /**Used to move the character in small increments, is meant to be used in an update loop
     * positive x moves to the right, negative to the left. postive y moves down and negative
     * move up. If the speed for x or y is set to 1 then it uses the characters standard speed
     * otherwise it is set to the passed in number However if it is 0 then no movement will be taken.
     * @param x positive moves right, negative moves left
     * @param y positive moves down, negative moves up
     */
    characterUpdateMovement(x: number, y: number) {
        /**type casting the body to use arcade body methods */
        let body = <Phaser.Physics.Arcade.Body>this.sprite.body;
        /**reset bodies volocity to 0 */
        body.setVelocity(0);

        /**Now we are gonna determine our speed and in what direction(s) */
        if (x == 1){
            
        } else if {

        } else {

        }
       
        } else if (this.keys["right"].isDown) {
            if (this.player.anims.getCurrentKey() != "right") {
                this.anims.play("right", this.player);
                this.characterDirection = "right";
            }
            body.setVelocityX(this.playerSpeed);
        } 
        /**If no buttons are being pressed */
        else {
            if (this.player.anims.getCurrentKey() != "idle_" + this.characterDirection) {
                this.anims.play("idle_" + this.characterDirection, this.player);
            }
        }

        //normalize the speed so we don't move at weird speeds on diagonals
        body.velocity.normalize().scale(this.playerSpeed);
    }

}