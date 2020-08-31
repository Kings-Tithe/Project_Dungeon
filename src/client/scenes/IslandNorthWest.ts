import { hookToMethod } from "../tools/Hook";
import { Character } from "../actors/Character";
import { Controls } from "../services/Controls";
import { Player } from "../actors/Player";
import { Console } from "../user-interface/Console";
import { SignalManager } from "../services/SignalManager";
import { tiledata } from "../user-interface/BuildMenu";
import { TilemapBuilder } from "../services/TilemapBuilder";
import { TilemapManager } from "../services/TilemapManager";

/*
Depth Table
Depth   | Object/Tile
----------------------------------
20      | Flags
10      | Builder- Cursors
8       | Builder- Upper Layers
7       | Overhead Layer
5       | Player
2       | Builder- Lower Layers
1.2     | Walk Layer
1.1     | Background Layer
----------------------------------
*/

/** Island
 * Purpose: Phaser Scene with a basic starting example island for what the final
 * one might look like. This will be used to test new features and game mechanics 
 * that will be used on the island.
 */
export class IslandNorthWest extends Phaser.Scene {

    /**Member Varibles */

    /**Numbers */
    /**Used to store the width of the tilemap in pixels */
    tilemapWidthInPixels: number;
    /**Used to store the height of the tilemap in Pixels */
    tilemapHeightInPixels: number;
    /**Used to place the player on the x axis when moving scenes */
    playerPlaceX: number;
    /**Used to place the player on the y axis when moving scenes */
    playerPlaceY: number;

    /**Tilemap managers */
    /**The main map used in this scene */
    mapManager: TilemapManager;

    /**Player */
    /**The Player containing our party and other relevent details */
    player: Player;

    // Handles signals from other scenes/classes
    signals: SignalManager;

    //controls
    controls: Controls;

    //scene builder
    Builder: TilemapBuilder;

    //Handlers
    /**stores all the handlers for our events so we can turn them off later */
    handlers: {[key: string]: Function}

    /**Calls to the parent constructor to construct the scene. Parents adds
     * the key of the scene that is passed in below to the game objects list
     * of Phaser scenes
     */
    constructor() {
        super("IslandNorthWest");
    }

    /** used to instantiate objects and set inital values where they apply
     * this runs in full before create()
     */
    init(data) {
        this.cameras.main.setZoom(2);
        this.signals = SignalManager.get();
        this.controls = Controls.getInstance();
        if(data){
            this.playerPlaceX = data.x;
            this.playerPlaceY = data.y;
        }
    }

    /**Used to initally create all of our assets and set up the games scene/stage the
     * way we want. To keep things organized this will mostly call to methods that create
     * a particular part of the scene unless creating that thing takes a single command.
    */
    create() {
        //these are needed asap and as such are created first
        this.createListeners();
        //create tilempa and tilemap builder
        this.createTileMap();
        this.Builder = new TilemapBuilder(this,this.mapManager.map);
        this.Builder.setLowerDepth(2);
        this.Builder.setUpperDepth(8);
        this.Builder.setCursorDepth(10);
        //create player
        if(!this.playerPlaceX || !this.playerPlaceY){
            this.playerPlaceX = this.tilemapWidthInPixels / 2;
            this.playerPlaceY = this.tilemapHeightInPixels / 2;
        }
        this.player = new Player(this, this.playerPlaceX, this.playerPlaceY);
        this.player.setDepth(5);
        this.player.addPartyMemberByKey(this,"wizard");
        this.player.addPartyMemberByKey(this,"wizard");
        this.player.addCollisionByLayer(this.walkLayer);
        this.Builder.addCollisionToPlayer(this.player);
        //setup control schemes
        this.controls.applyScheme(this,["Player", "Scene", "Building"]);
        /**setup the main camera */
        this.cameras.main.startFollow(this.player.party[0].sprite, true);
        this.createFlags();
    }

    /**A overwritten version of the game loop that is called around 60 times
     * a second by the game */
    update() {
        this.player.updatePlayerInput();
        this.player.update();
        this.Builder.update(this.player, [this.walkLayer,this.overheadLayer]);
    }

    /**
     * Creates several listeners for various signals that may be important.
     */
    createListeners() {
        this.handlers = {
            "command": (command: string[]) => {

                // This command adds a new party member on the island to follow you
                if (command[0] == 'addtoparty') {
                    // Remove the actual command from the list of arguments
                    command.shift();
                    // For each party member name passed in, add them to the party
                    command.forEach((member: string) => {
                        this.player.addPartyMemberByKey(this,member);
                    }, this);
                }
    
            },
            "pause scene-down": () => {
                this.signals.emit("pausing","Island");
                this.scene.pause("Island");
                this.input.keyboard.resetKeys();
            }
        }

        /*take the keys and functions in this.handlers and bind them to this 
         scene then turn them on */
        for(let key of Object.keys(this.handlers)){
        this.handlers[key].bind(this);
        this.signals.on(key, this.handlers[key]);
        }
    }
    
    /**Clears all the listeners in the global emitter from this class,
     * meant to be used when swapping scenes or before destroying this
     * class
     */
    clearListeners(){
        for(let key of Object.keys(this.handlers)){
            let before = this.signals.listenerCount(key);
            this.signals.off(key, this.handlers[key]);
            let after = this.signals.listenerCount(key);
        }
    }

    /**Creates and puts together the primary tilemap for this scene*/
    createTileMap() {
        this.mapManager = new TilemapManager("islandUpleft", this);
        this.mapManager.addTileset("islandA1");
        this.mapManager.addTileset("islandA2");
        this.mapManager.addTileset("islandB");
        this.mapManager.addLayer("background", ["islandA1", "islandA2"],2.1);
        this.mapManager.addLayer("walk", ["islandA1", "islandB"],2.2, true);
        this.mapManager.addLayer("overhead", ["islandB"],7.1);
        //set varibles values to their proper values based on newly created tilemap 
        this.tilemapHeightInPixels = this.mapManager.map.heightInPixels;
        this.tilemapWidthInPixels = this.mapManager.map.widthInPixels;
        this.cameras.main.setBounds(0, 0, this.tilemapWidthInPixels, this.tilemapHeightInPixels);
    }

    createFlags(){
        let flag: Phaser.GameObjects.Sprite;
        this.mapManager.map.getObjectLayer("flags").objects
        .filter((tile)=>tile.id == 2)
        .forEach((tile)=>{
            flag = this.physics.add.sprite(tile.x, tile.y, 'orangeFlag');
            flag.setOrigin(0,0);
            flag.setScale(tile.width / flag.width, tile.height/ flag.height);
        })
        flag.setDepth(20);
        flag.setAlpha(0);
        //set collision with this flag
        this.physics.add.overlap(this.player.party[0].sprite, flag, () => {
            this.signals.emit("sceneChange");
            this.Builder.clearListeners();
            this.clearListeners();
            this.scene.start("IslandNorth", {
                x: 30,
                y: 575
            });
        })
    }
}