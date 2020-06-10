import { hookToMethod } from "../tools/Hook";

/** Island
 * Purpose: Phaser Scene with a basic starting example island for what the final
 * one might look like. This will be used to test new features and game mechanics 
 * that will be used on the island.
 * 
 * Functions:
 * constructor
 * init()
 * create()
 * update()
 * createTileMap()
 * createPlayerSprite()
 * createKeys()
 * playerUpdateMovement()
 * 
 */
export class Island extends Phaser.Scene {

    /**Member Varibles */

    /**Sprites */
    /**Currently just a dude to walk around the world with and run some testing. 
     * Eventually will hold the sprite linked to the currently party leader character */
    player: Phaser.GameObjects.Sprite;

    /**Keys */
    keys: { [key: string]: Phaser.Input.Keyboard.Key }

    /**Numbers */
    /**Used to store the width of the tilemap in pixels */
    tilemapWidthInPixels: number;
    /**Used to store the height of the tilemap in Pixels */
    tilemapHeightInPixels: number;
    /**Stores the players set depth, not meant to change, 
     * property depthOffSet uses this as a base by which to offset */
    playerDepth: number;
    /**The speed at which the player walks, Will eventually be part of the player class*/
    playerSpeed: number;

    /**Tilemaps */
    /**The main map used in this scene */
    map: Phaser.Tilemaps.Tilemap;

    /**Tilesets */
    /**Tileset used to construct this.map */
    islandA1: Phaser.Tilemaps.Tileset;
    /**Tileset used to construct this.map */
    islandA2: Phaser.Tilemaps.Tileset;
    /**Tileset used to construct this.map */
    islandB: Phaser.Tilemaps.Tileset;

    /**Static Layers */
    /**Is the basic background layer that everything else is placed over */
    backgroundLayer: Phaser.Tilemaps.StaticTilemapLayer;
    /**The layer of stuff the player walks on or into depending on the passThru property */
    walkLayer: Phaser.Tilemaps.StaticTilemapLayer;
    /**A layer of things that sit above the player and adds a sense of depth */
    overheadLayer: Phaser.Tilemaps.StaticTilemapLayer;

    /**String */
    /**Used to store the direction the character is facing, will eventually be part of
     * the character class */
    characterDirection: string;

    /**Calls to the parent constructor to construct the scene. Parents adds
     * the key of the scene that is passed in below to the game objects list
     * of Phaser scenes
     */
    constructor() {
        super("Island")
    }

    /** used to instantiate objects and set inital values where they apply
     * this runs in full before create()
     */
    init(){
        this.keys = {};
        this.playerDepth = 10;
        this.playerSpeed = 150;
        this.cameras.main.setZoom(2);
    }

    /**Used to initally create all of our assets and set up the games scene/stage the
     * way we want. To keep things organized this will mostly call to methods that create
     * a particular part of the scene unless creating that thing takes a single command.
    */
    create() {
        this.createTileMap();
        this.createPlayerSprite();
        this.createKeys();
        /**setup the main camera */
        this.cameras.main.startFollow(this.player, true);

        // Round physics positions to avoid ugly render artifacts
        hookToMethod(Phaser.Physics.Arcade.Body.prototype, 'update', function() {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
        });
        
    }

    /**A overwritten version of the game loop that is called 60 times
     * a second by the game.
     */
    update() {
        this.playerUpdateMovement();
    }

    /**Creates and puts together the primary tilemap for this scene*/
    createTileMap() {
        this.map = this.make.tilemap({ key: "islandUpleft" });
        this.islandA1 = this.map.addTilesetImage("islandA1");
        this.islandA2 = this.map.addTilesetImage("islandA2");
        this.islandB = this.map.addTilesetImage("islandB");
        this.backgroundLayer = this.map.createStaticLayer("background",[this.islandA1,this.islandA2],0,0);
        this.walkLayer = this.map.createStaticLayer("walk",[this.islandA1,this.islandB],0,0);
        this.overheadLayer= this.map.createStaticLayer("overhead",[this.islandB],0,0);
        /**make sure the layers appear where they are supposed to in relation to the player*/
        this.backgroundLayer.depth = this.playerDepth - 1;
        this.walkLayer.depth = this.playerDepth - 1;
        this.overheadLayer.depth = this.playerDepth + 1;
        /**set collision for the walk layer */
        this.walkLayer.setCollisionByProperty({ passThru: false });
        /**set veribles values to their proper values based on newly created tilemap */
        this.tilemapHeightInPixels = this.map.heightInPixels;
        this.tilemapWidthInPixels = this.map.widthInPixels;
        this.cameras.main.setBounds(0,0,this.tilemapWidthInPixels,this.tilemapHeightInPixels);
    }

    /**Right now this just creates a test sprite dude to walk around the world with
     * and run some testing. Eventually when we have actaully characters made this
     * will construct the sprite for a character based on a player/characters interface
     */
    createPlayerSprite() {
        /**generate the inital sprite */
        this.player = this.physics.add.sprite(this.tilemapWidthInPixels / 2, this.tilemapHeightInPixels / 2, "character_template", 0);
        this.player.setDepth(this.playerDepth);
        /**generate all the animations associated with this sprite */
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('character_template', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation for character walking left */
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('character_template', { start: 16, end: 23 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation for character walking left */
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('character_template', { start: 24, end: 31 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation for character walking left */
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('character_template', { start: 32, end: 39 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation used to reset the frame of the character sprite */
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('character_template', { end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation used to reset the frame of the character sprite after walking up */
        this.anims.create({
            key: 'idle_up',
            frames: this.anims.generateFrameNumbers('character_template', { start:1, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation used to reset the frame of the character sprite after walking down */
        this.anims.create({
            key: 'idle_down',
            frames: this.anims.generateFrameNumbers('character_template', { end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation used to reset the frame of the character sprite after walking left */
        this.anims.create({
            key: 'idle_left',
            frames: this.anims.generateFrameNumbers('character_template', { start:3, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        /**animation used to reset the frame of the character sprite after walking right */
        this.anims.create({
            key: 'idle_right',
            frames: this.anims.generateFrameNumbers('character_template', { start:2, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        /**set players inital animation */
        this.anims.play("idle_down", this.player);
        this.characterDirection = "down";

        /**adds collision for the player */
        this.physics.add.collider(this.player, this.walkLayer);
        let body = <Phaser.Physics.Arcade.Body>this.player.body;
        body.setSize(16,16,false);
        body.setOffset(8,16);
    }

    /**creates Phaser.Input.Keyboard.Key objects that can used for polling in the games update loop */
    createKeys() {
        /**fill this.keys will all the keys we will need to poll in this scene */
        this.keys["up"] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys["left"] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys["down"] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keys["right"] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }


    /**Used to poll and see if and of the WASD keys are being pushed down
     * if they are moves the character's sprite and changes animation accordingly
     * Will attempt to condense code when moving it into the player class, this was
     * a first pass try if you will.
     */
    playerUpdateMovement() {
        /**type casting the body to use arcade body methods */
        let body = <Phaser.Physics.Arcade.Body>this.player.body;
        /**reset bodies volocity to 0 */
        body.setVelocity(0);
        /**for each direction each if the correct key is being pressed
         * if it is the check if the animation for that direction is playing
         * if not play it. Then move the player sprite in the correct direction.
         */
        /**Check the four two key combos */
        if (this.keys["up"].isDown && this.keys["right"].isDown){
            if (this.player.anims.getCurrentKey() != "up") {
                this.anims.play("up", this.player);
                this.characterDirection = "up";
            }
            body.setVelocityX(this.playerSpeed/2);
            body.setVelocityY(-this.playerSpeed/2);
            console.log("up,right");
        } else if (this.keys["up"].isDown && this.keys["left"].isDown){
            if (this.player.anims.getCurrentKey() != "up") {
                this.anims.play("up", this.player);
                this.characterDirection = "up";
            }
            body.setVelocityX(-this.playerSpeed/2);
            body.setVelocityY(-this.playerSpeed/2);
            console.log("up,left");
        } else if (this.keys["down"].isDown && this.keys["right"].isDown){
            if (this.player.anims.getCurrentKey() != "down") {
                this.anims.play("down", this.player);
                this.characterDirection = "down";
            }
            body.setVelocityX(this.playerSpeed/2);
            body.setVelocityY(this.playerSpeed/2);
        } else if (this.keys["down"].isDown && this.keys["left"].isDown){
            if (this.player.anims.getCurrentKey() != "down") {
                this.anims.play("down", this.player);
                this.characterDirection = "down";
            }
            body.setVelocityX(-this.playerSpeed/2);
            body.setVelocityY(this.playerSpeed/2);
        }
        /**Check the four basic directions */
        else if (this.keys["up"].isDown) {
            if (this.player.anims.getCurrentKey() != "up") {
                this.anims.play("up", this.player);
                this.characterDirection = "up";
            }
            body.setVelocityY(-this.playerSpeed);
        } else if (this.keys["left"].isDown) {
            if (this.player.anims.getCurrentKey() != "left") {
                this.anims.play("left", this.player);
                this.characterDirection = "left";
            }
            body.setVelocityX(-this.playerSpeed);
        } else if (this.keys["down"].isDown) {
            if (this.player.anims.getCurrentKey() != "down") {
                this.anims.play("down", this.player);
                this.characterDirection = "down";
            }
            body.setVelocityY(this.playerSpeed);
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

        //normalize the speed so we don't moveat weird speeds on diagonals
        body.velocity.normalize().scale(this.playerSpeed);
    }
}