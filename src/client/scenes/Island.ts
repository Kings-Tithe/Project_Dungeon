import { hookToMethod } from "../tools/Hook";
import { Character } from "../classes/Character";
import { Controls } from "../tools/Controls";
import { Player } from "../classes/Player";
import { Console } from "../tools/Console";

/** Island
 * Purpose: Phaser Scene with a basic starting example island for what the final
 * one might look like. This will be used to test new features and game mechanics 
 * that will be used on the island.
 */
export class Island extends Phaser.Scene {

    /**Member Varibles */

    /**Keys */
    keys: { [key: string]: Phaser.Input.Keyboard.Key; };

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

    /**Player */
    /**The Player containing our party and other relevent details */
    player: Player;

    /**Calls to the parent constructor to construct the scene. Parents adds
     * the key of the scene that is passed in below to the game objects list
     * of Phaser scenes
     */
    constructor() {
        super("Island");
    }

    /** used to instantiate objects and set inital values where they apply
     * this runs in full before create()
     */
    init(){
        this.cameras.main.setZoom(2);
        this.player = new Player(this);
    }

    /**Used to initally create all of our assets and set up the games scene/stage the
     * way we want. To keep things organized this will mostly call to methods that create
     * a particular part of the scene unless creating that thing takes a single command.
    */
    create() {
        // Create a game console
        this.scene.launch('Hud');

        // Round physics positions to avoid ugly render artifacts
        hookToMethod(Phaser.Physics.Arcade.Body.prototype, 'update', function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
        });

        this.createTileMap();
        this.player = new Player(this, this.tilemapWidthInPixels/2, this.tilemapHeightInPixels/2);
        this.player.addPartyMemberByKey("dregTheTestDummy","dregThePortrait");
        this.player.addPartyMemberByKey("gregTheTestDummy","gregThePortrait");
        this.player.addPartyMemberByKey("megTheTestDummy","megThePortrait");
        this.player.addPartyMemberByKey("craigTheTestDummy","craigThePortrait");
        this.player.addCollisionByLayer(this.walkLayer);;

        /**setup the main camera */
        this.cameras.main.startFollow(this.player.party[0].sprite, true);
    }

    /**A overwritten version of the game loop that is called 60 times
     * a second by the game.
     */
    update() {
        this.player.updatePlayerInput();
        this.player.update();
    }

    /**Creates and puts together the primary tilemap for this scene*/
    createTileMap() {
        this.map = this.make.tilemap({ key: "islandUpleft" });
        this.islandA1 = this.map.addTilesetImage("islandA1");
        this.islandA2 = this.map.addTilesetImage("islandA2");
        this.islandB = this.map.addTilesetImage("islandB");
        this.backgroundLayer = this.map.createStaticLayer("background", [this.islandA1, this.islandA2], 0, 0);
        this.walkLayer = this.map.createStaticLayer("walk", [this.islandA1, this.islandB], 0, 0);
        this.overheadLayer = this.map.createStaticLayer("overhead", [this.islandB], 0, 0);
        /**make sure the layers appear where they are supposed to in relation to the player*/
        this.backgroundLayer.depth = 9;
        this.walkLayer.depth = 9;
        this.overheadLayer.depth = 15;
        /**set collision for the walk layer */
        this.walkLayer.setCollisionByProperty({ passThru: false });
        /**set veribles values to their proper values based on newly created tilemap */
        this.tilemapHeightInPixels = this.map.heightInPixels;
        this.tilemapWidthInPixels = this.map.widthInPixels;
        this.cameras.main.setBounds(0, 0, this.tilemapWidthInPixels, this.tilemapHeightInPixels);
    }
}