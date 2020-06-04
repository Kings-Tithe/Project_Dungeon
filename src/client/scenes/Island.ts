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

    constructor(){
        super("Island")
    }

    /**Used to initally create all of our assets and set up the games scene/stage the
     * way we want. To keep things organized this will mostly call to methods that create
     * a particular part of the scene
    */
    create(){
        this.createTileMap();
        this.createPlayerSprite();
    }

    /**Creates and puts together the primary tilemap for this scene*/
    createTileMap(){
        let map = this.make.tilemap({ key: "island", tileWidth: 16, tileHeight: 16 });
        let islandA1 = map.addTilesetImage("islandA1");
        let islandA2 = map.addTilesetImage("islandA2");
        let islandB = map.addTilesetImage("islandB");
        let islandC = map.addTilesetImage("islandC");
        let backgroundLayer = map.createStaticLayer("background",[islandA1,islandA2],0,0);
        let forgroundLayer = map.createStaticLayer("foreground",[islandA1,islandA2],0,0);
    }

    /**Right now this just creates a test sprite dude to walk around the world with
     * and run some testing. Eventually when we have actaully characters made this
     * will construct the sprite for a character based on a player/characters interface
     */
    createPlayerSprite(){
        /** generate the inital sprite */
        this.player = this.add.sprite(100,100,"character_template",0);

    }
}