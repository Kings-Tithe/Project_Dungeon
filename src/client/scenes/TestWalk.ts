
export class TestWalk extends Phaser.Scene {

    cursor : Phaser.Types.Input.Keyboard.CursorKeys;
    testguy: Phaser.GameObjects.Sprite;


    preload(){
        //load in test tile maps
        this.load.image("test-tiles",'../../../assets/images/tilesets/desert_A.png');
        this.load.tilemapCSV("test-tilemap",'../../../assets/tilemaps/MyFirstTileMap.csv');
        //load the spritesheet for the character
        this.load.spritesheet("template_spritesheet", "../../../assets/images/TemplateSpriteSheet.png",
        {
        frameWidth: 32, 
        frameHeight: 32,
        })
    }

    create(){
        //this creates just the most basic tilemap background for the purposes of this test
        let map = this.make.tilemap({ key: "test-tilemap", tileWidth: 16, tileHeight: 16 });
        let tileset = map.addTilesetImage("test-tiles");
        let layer = map.createStaticLayer(0, tileset, 0, 0);
        /**Now lets set up the player character
         * since this is a test we'll cut some corners on idles and such */
        //set up characters sprite
        this.testguy = this.add.sprite(100,100,"template_spritesheet",0);
        this.testguy.setScale(3);
        /** Animation for character walking left */
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('template_spritesheet', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        /** Animation for character walking left */
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('template_spritesheet', { start: 16, end: 23 }),
            frameRate: 10,
            repeat: -1
        });
        /** Animation for character walking left */
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('template_spritesheet', { start: 24, end: 31 }),
            frameRate: 10,
            repeat: -1
        });
        /** Animation for character walking left */
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('template_spritesheet', { start: 33, end: 40 }),
            frameRate: 10,
            repeat: -1
        });
        /** Animation used to set frame for when he is not moving */
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('template_spritesheet', { end: 0}),
            frameRate: 10,
            repeat: -1
        });
        //this returns an object containing 4 hotkeys used for polling up, down left and right
        this.cursor = this.input.keyboard.createCursorKeys();

        /** set the bounds for the camera to the total size of the tile map
         *  and set the camera to follow the player */
        this.cameras.main.setBounds(0,0,1600,1600);
        this.cameras.main.startFollow(this.testguy, true, 0.05, 0.05);
    }

    update(){
        /** check which key if any is being pressed and move the character
         * according */
        if (this.cursor.left.isDown){
            //only start to play animation if it is not already playing
            if (this.testguy.anims.getCurrentKey() != 'left' ){
                this.anims.play("left",this.testguy);
            }
            this.testguy.x -= 3;
        }
        else if (this.cursor.right.isDown){
            //only start to play animation if it is not already playing
            if (this.testguy.anims.getCurrentKey() != 'right' ){
                this.anims.play("right",this.testguy);
            }
            this.testguy.x += 3;
        }
        else if (this.cursor.up.isDown){
            //only start to play animation if it is not already playing
            if (this.testguy.anims.getCurrentKey() != 'up' ){
                this.anims.play("up",this.testguy);
            }
            this.testguy.y -= 3;
        }
        else if (this.cursor.down.isDown){
            //only start to play animation if it is not already playing
            if (this.testguy.anims.getCurrentKey() != 'down' ){
                this.anims.play("down",this.testguy);
            }
            this.testguy.y += 3;
        } else {
            this.anims.play("idle",this.testguy);
        }
    }
}