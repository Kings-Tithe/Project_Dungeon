/**Scene with a basic starting example island for what the final one might look
 * like. This will be used to test new features and game mechanics that will be
 * used on the island.
 */

export class Island extends Phaser.Scene {

    /**Member Varibles */
    
    /**Sprites */
    /**Currently just a dude to walk around the world with and run some testing. 
     * Eventually will hold the sprite linked to the currently party leader character */
    player: Phaser.GameObjects.Sprite;

    /**Keys */
    keys: {[key: string]: Phaser.Input.Keyboard.Key}

    constructor(){
        super("Island")
    }

    /**Used to initally create all of our assets and set up the games scene/stage the
     * way we want. To keep things organized this will mostly call to methods that create
     * a particular part of the scene unless creating that thing takes a single command.
    */
    create(){
        this.createTileMap();
        this.createPlayerSprite();
        this.createKeys();
        /**Setup the main camera */
        this.cameras.main.setBounds(0,0,4800,4800);
        this.cameras.main.startFollow(this.player,true);
    }

    update(){
        this.playerUpdateMovement();
    }

    /**Creates and puts together the primary tilemap for this scene*/
    createTileMap(){
        let map = this.make.tilemap({ key: "island", tileWidth: 16, tileHeight: 16 });
        let islandA1 = map.addTilesetImage("islandA1");
        let islandA2 = map.addTilesetImage("islandA2");
        let islandB = map.addTilesetImage("islandB");
        let islandC = map.addTilesetImage("islandC");
        let backgroundLayer = map.createStaticLayer("background",[islandA1,islandA2],0,0);
        let forgroundLayer = map.createStaticLayer("foreground",[islandB,islandC],0,0);
        backgroundLayer.depth = 0;
        forgroundLayer.depth = 1;
    }

    /**Right now this just creates a test sprite dude to walk around the world with
     * and run some testing. Eventually when we have actaully characters made this
     * will construct the sprite for a character based on a player/characters interface
     */
    createPlayerSprite(){
        /**Generate the inital sprite */
        this.player = this.add.sprite(100,100,"character_template",0);
        /**Generate all the animations associated with this sprite */
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('character_template', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        /**Animation for character walking left */
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('character_template', { start: 16, end: 23 }),
            frameRate: 10,
            repeat: -1
        });
        /**Animation for character walking left */
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('character_template', { start: 24, end: 31 }),
            frameRate: 10,
            repeat: -1
        });
        /**Animation for character walking left */
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('character_template', { start: 32, end: 39 }),
            frameRate: 10,
            repeat: -1
        });
        /**Animation used to reset the frame of the character sprite */
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('character_template', { end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        /**Set players inital animation */
        this.anims.play("idle", this.player);
    }

    /**Creates Phaser.Input.Keyboard.Key objects that can used for polling in the games update loop */
    createKeys(){
        /**Instantiate keys, it's typing and format are declared above under member functions */ 
        this.keys = {};
        /**Fill this.keys will all the keys we will need to poll in this scene */
        this.keys["up"] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys["left"] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys["down"] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keys["right"] = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);   
    }
    

    /**Used to poll and see if and of the WASD keys are being pushed down
     * if they are moves the character's sprite and changes animation accordingly
     */
    playerUpdateMovement(){
        /**For each direction each if the correct key is being pressed
         * if it is the check if the animation for that direction is playing
         * if not play it. Then move the player sprite in the correct direction.
         */
        if (this.keys["up"].isDown){
            if(this.player.anims.getCurrentKey() != "up"){
                this.anims.play("up", this.player);
            }
            this.player.y -= 2;
        } else if(this.keys["left"].isDown){
            if(this.player.anims.getCurrentKey() != "left"){
                this.anims.play("left", this.player);
            }
            this.player.x -= 2;
        } else if(this.keys["down"].isDown){
            if(this.player.anims.getCurrentKey() != "down"){
                this.anims.play("down", this.player);
            }
            this.player.y += 2;
        } else if(this.keys["right"].isDown){
            if(this.player.anims.getCurrentKey()!= "right"){
                this.anims.play("right", this.player);
            }
            this.player.x += 2;
        } else {
            if(this.player.anims.getCurrentKey() != "idle"){
                this.anims.play("idle", this.player);
            }
        }
    }
}