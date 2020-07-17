import { hookToMethod } from "../tools/Hook";
import { Character } from "../classes/Character";
import { Controls } from "../tools/Controls";
import { Player } from "../classes/Player";
import { Console } from "../tools/Console";
import { SignalManager } from "../tools/SignalManager";

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
    /**Tileset used to for the testing of the building mode */
    testBuildSpriteSheet: Phaser.Tilemaps.Tileset;

    /**Static Layers */
    /**Is the basic background layer that everything else is placed over */
    backgroundLayer: Phaser.Tilemaps.StaticTilemapLayer;
    /**The layer of stuff the player walks on or into depending on the passThru property */
    walkLayer: Phaser.Tilemaps.StaticTilemapLayer;
    /**A layer of things that sit above the player and adds a sense of depth */
    overheadLayer: Phaser.Tilemaps.StaticTilemapLayer;

    //dynamic layers
    /**This is a layer used to test the building mechanics */
    buildLayer: Phaser.Tilemaps.DynamicTilemapLayer;

    /**Player */
    /**The Player containing our party and other relevent details */
    player: Player;

    /**control handler */
    controls: Controls;

    // Handles signals from other scenes/classes
    signals: SignalManager;

    //sprites
    /**Used to show players where they are about to build */
    cursorTile: Phaser.GameObjects.Sprite;
    /**Used as a build mode icon of the hammer, does a hammering motion when placing a tile */
    hammerCursor: Phaser.GameObjects.Sprite;

    //tweens
    /**Those tween is played when clicking in build mode and make the hammer cursor
     * looking like it is hammering the block in place */
    hammeringTween: Phaser.Tweens.Tween;

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
    init() {
        this.cameras.main.setZoom(2);
        this.player = new Player(this);
    }

    /**Used to initally create all of our assets and set up the games scene/stage the
     * way we want. To keep things organized this will mostly call to methods that create
     * a particular part of the scene unless creating that thing takes a single command.
    */
    create() {
        this.createTileMap();
        this.createListeners();
        this.player = new Player(this, this.tilemapWidthInPixels / 2, this.tilemapHeightInPixels / 2);
        this.player.addPartyMemberByKey("craigTheTestDummy", "craigThePortrait");
        this.player.addCollisionByLayer(this.walkLayer);
        this.player.addCollisionByLayer(this.buildLayer);

        /**setup the main camera */
        this.cameras.main.startFollow(this.player.party[0].sprite, true);

        // Create the games hud scene
        this.scene.launch('Hud');

        // Round physics positions to avoid ugly render artifacts
        hookToMethod(Phaser.Physics.Arcade.Body.prototype, 'update', function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
        });

        //create build modes cursor tile
        this.cursorTile = this.add.sprite(0,0,"testBuildSpriteSheetTable",6);
        this.cursorTile.setOrigin(0,0);
        this.cursorTile.setAlpha(.65);
        this.cursorTile.setDepth(100);
        var cursorTween = this.tweens.add({
            targets: this.cursorTile,
            alpha: .2,
            duration: 1000,
            repeat: -1,
            yoyo: true
        });
        this.hammerCursor = this.add.sprite(0,0,"hammerIcon");
        this.hammerCursor.setScale(1);
        this.hammerCursor.setDepth(100);
        this.hammeringTween = this.tweens.add({
            targets: this.hammerCursor,
            angle: 90,
            duration: 150,
            paused: true,
            repeat: 0,
            yoyo: true
        });
    }

    /**A overwritten version of the game loop that is called around 60 times
     * a second by the game */
    update() {
        //console.log(this.buildLayer);
        this.player.updatePlayerInput();
        this.player.update();
        this.buildUpdate();
    }

    buildUpdate(){
        //grab the cursor's current point in the world taking into account the camera
        let worldPoint = <Phaser.Math.Vector2>this.input.activePointer.positionToCamera(this.cameras.main);
        let testTile: Phaser.Math.Vector2 = this.buildLayer.worldToTileXY(worldPoint.x, worldPoint.y,true);
        let tilecoord = this.buildLayer.tileToWorldXY(testTile.x, testTile.y);
        //move cursor tile
        this.cursorTile.x = tilecoord.x;
        this.cursorTile.y = tilecoord.y;
        //move cursor hammer
        this.hammerCursor.x = worldPoint.x - 10;
        this.hammerCursor.y = worldPoint.y - 10;
        //define what to do when clicking in build mode
        if (this.input.manager.activePointer.isDown) {
            this.hammeringTween.play();
            let testTile: Phaser.Math.Vector2 = this.buildLayer.worldToTileXY(worldPoint.x, worldPoint.y,true);
            console.log(this.buildLayer.tileToWorldXY(testTile.x, testTile.y));
            let tile = this.buildLayer.putTileAtWorldXY(611, worldPoint.x, worldPoint.y);
            tile.setCollision(true);
          }
    }

    /**
     * Creates several listeners for various signals that may be important.
     */
    createListeners() {
        this.signals = SignalManager.get();

        // Listens for commands from the console
        this.signals.on("command", (command: string[]) => {

            // This command adds a new party member on the island to follow you
            if (command[0] == 'addtoparty') {
                // Remove the actual command from the list of arguments
                command.shift();
                // For each party member name passed in, add them to the party
                command.forEach((member: string) => {
                    this.player.addPartyMemberByKey(member + "TheTestDummy", member + "ThePortrait");
                }, this);
            }

        }, this);

    }

    /**Creates and puts together the primary tilemap for this scene*/
    createTileMap() {
        this.map = this.make.tilemap({ key: "islandUpleft" });
        this.islandA1 = this.map.addTilesetImage("islandA1");
        this.islandA2 = this.map.addTilesetImage("islandA2");
        this.islandB = this.map.addTilesetImage("islandB");
        this.testBuildSpriteSheet = this.map.addTilesetImage("testBuildSpriteSheet");
        this.backgroundLayer = this.map.createStaticLayer("background", [this.islandA1, this.islandA2], 0, 0);
        this.walkLayer = this.map.createStaticLayer("walk", [this.islandA1, this.islandB], 0, 0);
        this.overheadLayer = this.map.createStaticLayer("overhead", [this.islandB], 0, 0);
        this.buildLayer = this.map.createDynamicLayer("build", [this.testBuildSpriteSheet, this.islandA1]);
        //make sure the layers appear where they are supposed to in relation to the player
        this.backgroundLayer.depth = 9;
        this.walkLayer.depth = 9;
        this.buildLayer.depth = 10;
        this.overheadLayer.depth = 15;
        //set collision for the walk layer 
        this.walkLayer.setCollisionByProperty({ passThru: false });
        //set veribles values to their proper values based on newly created tilemap 
        this.tilemapHeightInPixels = this.map.heightInPixels;
        this.tilemapWidthInPixels = this.map.widthInPixels;
        this.cameras.main.setBounds(0, 0, this.tilemapWidthInPixels, this.tilemapHeightInPixels);
    }
}