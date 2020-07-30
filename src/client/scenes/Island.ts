import { hookToMethod } from "../tools/Hook";
import { Character } from "../actors/Character";
import { Controls } from "../services/Controls";
import { Player } from "../actors/Player";
import { Console } from "../user-interface/Console";
import { SignalManager } from "../services/SignalManager";
import { tiledata } from "../user-interface/BuildMenu";

/*
Depth Table
Depth   | Object/Tile
----------------------------------
10.1    | Tool Cursor
10      | Cursor Tile
7       | Overhead Layer
5       | Player
2.3     | Build Layer
2.2     | Walk Layer
2.1     | Background Layer
----------------------------------
*/

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
    rotation: number;

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

    // Handles signals from other scenes/classes
    signals: SignalManager;

    //controls
    controls: Controls;
    //sprites
    /**Used to show players where they are about to build */
    cursorTile: Phaser.GameObjects.Sprite;
    /**Used as a build mode icon of the hammer, does a hammering motion when placing a tile */
    toolCursor: Phaser.GameObjects.Sprite;

    //tweens
    /**Those tween is played when clicking in build mode and make the hammer cursor
     * looking like it is hammering the block in place */
    hammeringTween: Phaser.Tweens.Tween;
    /**This give the effect of the block selected with the building mode fading back and
     * forth */
    cursorTween: Phaser.Tweens.Tween;

    //tiledata
    /**This stores the currently selected tile based on information sent from the BuildMenu class */
    currentTile: tiledata;

    //booleans
    /**Used to tell weather this scene is currently in build mode or not */
    inBuildMode: boolean;

    //string
    toolSelected: string;

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
        this.signals = SignalManager.get();
        this.controls = Controls.getInstance();
        this.player = new Player(this);
        this.rotation = 0;
        this.inBuildMode = false;
        this.toolSelected = "hammer";
    }

    /**Used to initally create all of our assets and set up the games scene/stage the
     * way we want. To keep things organized this will mostly call to methods that create
     * a particular part of the scene unless creating that thing takes a single command.
    */
    create() {
        this.createTileMap();
        this.createListeners();
        this.controls.applyScheme(this,["Player", "Scene"]);
        this.player = new Player(this, this.tilemapWidthInPixels / 2, this.tilemapHeightInPixels / 2);
        this.player.setDepth(5);
        this.player.addPartyMemberByKey(this,"dreg");
        this.player.addCollisionByLayer(this.walkLayer);
        this.player.addCollisionByLayer(this.buildLayer);

        this.controls = Controls.getInstance();

        /**setup the main camera */
        this.cameras.main.startFollow(this.player.party[0].sprite, true);

        // Create the games hud scene
        this.scene.launch('Hud');

        // Round physics positions to avoid ugly render artifacts
        hookToMethod(Phaser.Physics.Arcade.Body.prototype, 'update', function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
        });

        //create build mode hammer cursor
        this.toolCursor = this.add.sprite(0, 0, "hammerIcon");
        this.toolCursor.setScale(1);
        this.toolCursor.setDepth(10.1);
        this.toolCursor.setVisible(false);
        this.hammeringTween = this.tweens.add({
            targets: this.toolCursor,
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
        this.player.updatePlayerInput();
        this.player.update();
        if(this.inBuildMode && this.currentTile){
            this.buildPlaceUpdate();
        }
    }

    enterBuildMode(){
        this.inBuildMode = true;
        if(this.cursorTile){
            this.cursorTween.resume();
        }
    }

    exitBuildMode(){
        this.inBuildMode = false;
        this.toolCursor.setVisible(false);
        if(this.cursorTile){
            this.cursorTile.setVisible(false);
            this.cursorTween.pause();
        }
    }

    buildPlaceUpdate() {
        //grab the cursor's current point in the world taking into account the camera
        let worldPoint = <Phaser.Math.Vector2>this.input.activePointer.positionToCamera(this.cameras.main);
        let worldTile: Phaser.Math.Vector2 = this.buildLayer.worldToTileXY(worldPoint.x, worldPoint.y,true);
        let tilecoord = this.buildLayer.tileToWorldXY(worldTile.x, worldTile.y);
        //move cursor tile
        this.cursorTile.x = tilecoord.x + 8;
        this.cursorTile.y = tilecoord.y + 8;
        //move cursor hammer
        this.toolCursor.x = worldPoint.x - 10;
        this.toolCursor.y = worldPoint.y - 10;
        //check if a block could be placed this update
        let canPlace: boolean = true;
        //check for radius around player
        let differenceX = Math.abs(this.player.party[0].sprite.x - tilecoord.x);
        let differenceY = Math.abs(this.player.party[0].sprite.y - tilecoord.y)
        if(Math.hypot(differenceX, differenceY) > 125){
            canPlace = false;
        }
        //check we are not building on the player
        let playerBounds = this.player.party[0].sprite.getBounds();
        let tilebounds = new Phaser.Geom.Rectangle(tilecoord.x, tilecoord.y, 16, 16);
        if(Phaser.Geom.Rectangle.Overlaps(playerBounds,tilebounds)){
            canPlace = false;
        }
        //determine if to show the cursors or not
        if(canPlace && this.toolSelected == "hammer"){
            this.cursorTile.setVisible(true);
            this.toolCursor.setVisible(true);
        } else if (canPlace && this.toolSelected == "pick"){
            this.cursorTile.setVisible(false);
            this.toolCursor.setVisible(true);
        } else {
            this.cursorTile.setVisible(false);
            this.toolCursor.setVisible(false);
        }
        //define what to do when clicking in build mode
        if (this.input.manager.activePointer.isDown && this.currentTile && canPlace) {
            this.hammeringTween.play();
            if(this.toolSelected == "hammer"){
                let tilesetStart = this.testBuildSpriteSheet.firstgid;
                let tile = this.buildLayer.putTileAtWorldXY(tilesetStart + this.currentTile.tileSetOffSet, worldPoint.x, worldPoint.y);
                tile.rotation = Phaser.Math.DegToRad(this.rotation);
                tile.setCollision(true);
            } else if (this.toolSelected == "pick"){
                this.buildLayer.removeTileAtWorldXY(worldPoint.x, worldPoint.y);
            }
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
                    this.player.addPartyMemberByKey(this,member);
                }, this);
            }

        }, this);

        this.signals.on("pause scene-down",() => {
            this.signals.emit("pausing","Island");
            this.scene.pause("Island");
            this.input.keyboard.resetKeys();
        })

        this.signals.on("newTileSelected", (incomingTile: tiledata) => {
            if (this.currentTile){
                this.cursorTile.setTexture(incomingTile.tileSetKey+"Table",incomingTile.tileSetOffSet);
            } else {
                //create build modes cursor tile
                this.cursorTile = this.add.sprite(0, 0, incomingTile.tileSetKey+"Table", incomingTile.tileSetOffSet);
                this.cursorTile.setOrigin(.5,.5);
                this.cursorTile.setAlpha(.7);
                this.cursorTile.setDepth(10);
                this.cursorTile.setVisible(false);
                this.cursorTile.rotation = Phaser.Math.DegToRad(this.rotation);
                this.cursorTween = this.tweens.add({
                    targets: this.cursorTile,
                    alpha: .3,
                    duration: 1000,
                    repeat: -1,
                    yoyo: true
                });
            }
            this.currentTile = incomingTile;
        })

        this.signals.on("rotate block right-down", () => {
            this.rotation += 90;
            if(this.cursorTile){
                this.cursorTile.rotation = Phaser.Math.DegToRad(this.rotation);
            }
        })

        this.signals.on("rotate block left-down", () => {
            this.rotation -= 90;
            if(this.cursorTile){
                this.cursorTile.rotation = Phaser.Math.DegToRad(this.rotation);
            }
        })

        this.signals.on("enterBuildMode", this.enterBuildMode.bind(this));
        this.signals.on("exitBuildMode", this.exitBuildMode.bind(this));

        this.signals.on("buildMenuHammerSelected", () => {
            this.toolSelected = "hammer";
            this.toolCursor.setTexture("hammerIcon");
        })

        this.signals.on("buildMenuPickSelected", () => {
            this.toolSelected = "pick";
            this.toolCursor.setTexture("pickIcon");
        })
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
        this.backgroundLayer.depth = 2.1;
        this.walkLayer.depth = 2.2;
        this.buildLayer.depth = 2.3;
        this.overheadLayer.depth = 7;
        //set collision for the walk layer 
        this.walkLayer.setCollisionByProperty({ passThru: false });
        //set varibles values to their proper values based on newly created tilemap 
        this.tilemapHeightInPixels = this.map.heightInPixels;
        this.tilemapWidthInPixels = this.map.widthInPixels;
        this.cameras.main.setBounds(0, 0, this.tilemapWidthInPixels, this.tilemapHeightInPixels);
    }
}