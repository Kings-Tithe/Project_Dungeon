
export class TestWalk extends Phaser.Scene {


    preload(){
        //load in test tile maps
        this.load.image("test-tiles",'../../../assets/images/tilesets/desert_A.png');
        this.load.tilemapCSV("test-tilemap",'../../../assets/tilemaps/MyFirstTileMap.csv');
        //load the spritesheet for the character
        this.load.spritesheet("template_spritesheet", "../../../assets/images/TemplateSpriteSheet.png",
        {
        frameWidth: 32, 
        frameHeight: 32
        })
    }

    create(){
        //this creates just the most basic tilemap background for the purposes of this test
        let map = this.make.tilemap({ key: "test-tilemap", tileWidth: 16, tileHeight: 16 });
        let tileset = map.addTilesetImage("test-tiles");
        let layer = map.createStaticLayer(0, tileset, 0, 0);
        /**Now lets set up the player character
         * since this is a test we'll cut some corners on idles and such */
        /** Animation for character walking left */
        let testguy = this.add.sprite(100,100,"template_spritesheet",0);
        testguy.setScale(3);
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('template_spritesheet', { start: 9, end: 16 }),
            frameRate: 10,
            repeat: -1
        });
        /** Animation for character walking left */
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('template_spritesheet', { start: 17, end: 24 }),
            frameRate: 10,
            repeat: -1
        });
        /** Animation for character walking left */
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('template_spritesheet', { start: 25, end: 32 }),
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
    }
}