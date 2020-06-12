import { hookToMethod } from "../tools/Hook";
import { Character } from "../classes/Character";
import { Controls } from "../classes/Controls";

/** Island
 * Purpose: Phaser Scene with a basic starting example island for what the final
 * one might look like. This will be used to test new features and game mechanics 
 * that will be used on the island.
 */
export class Island extends Phaser.Scene {

    /**Member Varibles */

    /**Numbers */
    /**Used to store the width of the tilemap in pixels */
    tilemapWidthInPixels: number;
    /**Used to store the height of the tilemap in Pixels */
    tilemapHeightInPixels: number;

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

    /**Characters */
    /**Current Main character while I build the character class, 
     * this will eventually be in the players party */
    main: Character;

    /**control handler */
    controls: Controls;

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
        this.cameras.main.setZoom(2);
        this.main = new Character(this);
        this.controls = new Controls(this);
    }

    /**Used to initally create all of our assets and set up the games scene/stage the
     * way we want. To keep things organized this will mostly call to methods that create
     * a particular part of the scene unless creating that thing takes a single command.
    */
    create() {
        this.createTileMap();
        this.main.addSpriteToScene(this, "gregTheTestDummy", this.tilemapWidthInPixels/2, this.tilemapHeightInPixels/2);
        /**adds collision for the player */
        this.physics.add.collider(this.main.sprite, this.walkLayer);
        /**setup the main camera */
        this.cameras.main.startFollow(this.main.sprite, true);

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
        this.poleCharactermovement();
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
        this.backgroundLayer.depth = 9;
        this.walkLayer.depth = 9;
        this.overheadLayer.depth = 11;
        /**set collision for the walk layer */
        this.walkLayer.setCollisionByProperty({ passThru: false });
        /**set veribles values to their proper values based on newly created tilemap */
        this.tilemapHeightInPixels = this.map.heightInPixels;
        this.tilemapWidthInPixels = this.map.widthInPixels;
        this.cameras.main.setBounds(0,0,this.tilemapWidthInPixels,this.tilemapHeightInPixels);
    }

    /**Runs thru and checks what keys are being pressed making a call to
     * the character accordingly to move the character
     */
    poleCharactermovement(){
        let playerSpeed = 130;
        let x = 0;
        let y = 0;
        if (this.controls.isDown("walk up")){
            y -= playerSpeed;
        }
        if (this.controls.isDown("walk down")){
            y += playerSpeed;
        }
        if (this.controls.isDown("walk left")){
            x -= playerSpeed;
        }
        if (this.controls.isDown("walk right")){
            x += playerSpeed;
        }
        /**call to the player to move based on key presses */
        this.main.UpdateMovement(x,y);
    }
}