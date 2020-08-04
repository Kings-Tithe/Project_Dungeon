import { SignalManager } from "./SignalManager";
import { Controls } from "./Controls";
import { tiledata } from "../user-interface/BuildMenu";
import { Player } from "../actors/Player";

/**
 * This class is used on conjunction with the Build Menu class to
 * encompass the games building mechanics. The Build Menu allows
 * the picking of the tools and tiles placed by this class. They
 * are seperate both because one is a ui class while one is a functional
 * class and because one stays on the hud and the other directly edits
 * many diffrent scenes. Since this one edits many scenes it can'y hold and
 * graghics it's self and is only funcitons for editing existing tilemaps.
 */
export class TilemapBuilder {

    //member varibles
        
    //scene
    /**
     * A refernce to the current phaser scene we are building in,
     * This is however seperate from the scene that the buttons
     * and html tile section menu is set up in. This changes as
     * we change scenes.
     */
    currentScene: Phaser.Scene;

    //numbers
    /**Tells us how to rotate a tile before placing it, also controls rotation
     * on the tileCursor */
    rotation: number;
    /**Used to store the depth of layers meant to apear above the player */
    upperDepth: number;
    /**Used to store the depth of layers meant to apear below the player */
    lowerDepth: number;
    /**Used to store the depth of the cursors */
    cursorDepth: number;

    //dynamic layers
    /**Layer used for building floor tiles */
    floorLayer: Phaser.Tilemaps.DynamicTilemapLayer;
    /**Layer used for building wall tiles */
    wallLayer: Phaser.Tilemaps.DynamicTilemapLayer;
    /**Layer used for building floor tiles */
    roofLayer: Phaser.Tilemaps.DynamicTilemapLayer;
    /**Layer used for building floor tiles */
    specialLayer: Phaser.Tilemaps.DynamicTilemapLayer;

    // Handles signals from other scenes/classes
    signals: SignalManager;

    //sprites
    /**Used to show players where they are about to build */
    cursorTile: Phaser.GameObjects.Sprite;
    /**Used as a build mode icon of the hammer, does a hammering motion when placing a tile */
    toolCursor: Phaser.GameObjects.Sprite;

    //controls
    controls: Controls;

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

    //tilesets
    /**Tileset used to for the testing of the building mode */
    testBuildSpriteSheet: Phaser.Tilemaps.Tileset;

    //booleans
    /**Used to tell weather this scene is currently in build mode or not */
    inBuildMode: boolean;

    //string
    /**keeps track of what tool is selected in the build menu */
    toolSelected: string;
    /**keeps track of what layer is selected in the build menu */
    layerSelected: string;

    /**creates our instance of this class, a new instance is created for
     * every scene, as such we don't need to worry about persisting things
     * across scenes.
     * @param scene The scene we will be building in
     * @param map A refernce to the tilemap we'll be building on
     */
    constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap){
        //inital values
        this.currentScene = scene;
        this.rotation = 0;
        this.inBuildMode = false;
        this.toolSelected = "";
        this.layerSelected = "";
        this.signals = SignalManager.get();
        this.controls = Controls.getInstance();
        this.upperDepth = 0;
        this.lowerDepth = 0;
        this.cursorDepth = 0;
        //create everything
        this.createLayers(map);
        this.createListeners();
        this.createToolCursor();
    }

    /**creates the cursor tool ans sets all its default values */
    createToolCursor(){
        //create build mode hammer cursor
        this.toolCursor = this.currentScene.add.sprite(0, 0, "hammerIcon");
        this.toolCursor.setScale(1);
        this.toolCursor.setDepth(this.cursorDepth + 0.1);
        this.toolCursor.setVisible(false);
        this.hammeringTween = this.currentScene.tweens.add({
            targets: this.toolCursor,
            angle: 90,
            duration: 150,
            paused: true,
            repeat: 0,
            yoyo: true
        });
    }

    /**
     * Creates the 4 building layers floor,wall,roof,special and
     * the stores refernces to them.
     * @param map the map to create the layers in
     */
    createLayers(map: Phaser.Tilemaps.Tilemap){
        //eventually this will be imported in but for now it is hardcoded
        this.testBuildSpriteSheet = map.addTilesetImage("testBuildSpriteSheet");
        //create new black dynamic layers
        this.floorLayer = map.createBlankDynamicLayer("floor", [this.testBuildSpriteSheet]);
        this.wallLayer = map.createBlankDynamicLayer("wall", [this.testBuildSpriteSheet]);
        this.roofLayer = map.createBlankDynamicLayer("roof", [this.testBuildSpriteSheet]);
        this.specialLayer = map.createBlankDynamicLayer("special", [this.testBuildSpriteSheet]);
        //set depths
        this.floorLayer.depth = this.lowerDepth + 0.1;
        this.wallLayer.depth = this.lowerDepth + 0.2;
        this.specialLayer.depth = this.lowerDepth + 0.3;
        this.roofLayer.depth = this.upperDepth;
    }

    /**Sets up varibles and logic for when entering build mode */
    enterBuildMode(){
        this.inBuildMode = true;
        if(this.cursorTile){
            this.cursorTween.resume();
        }
    }

    /**Sets up varibles and logic for when exiting build mode */
    exitBuildMode(){
        this.inBuildMode = false;
        this.toolCursor.setVisible(false);
        if(this.cursorTile){
            this.cursorTile.setVisible(false);
            this.cursorTween.pause();
        }
    }

    /**
     * Adds collison to the player for the bulding players
     * @param player The player to add collison to all the party members of 
     * */
    addCollisionToPlayer(player: Player){
        player.addCollisionByLayer(this.wallLayer);
        player.addCollisionByLayer(this.specialLayer);
    }

    /**
     * Sets the depth for layers meant be shown above the player
     * @param newDepth the depth to set the upper layers to
     *  */
    setUpperDepth(newDepth: number){
        this.upperDepth = newDepth;
        this.roofLayer.depth = this.upperDepth;
    }

    /**
     * Sets the depth for layers meant be shown below the player
     * @param newDepth the depth to set the lower layers to
     *  */
    setLowerDepth(newDepth: number){
        this.lowerDepth = newDepth;
        this.floorLayer.depth = this.lowerDepth + 0.1;
        this.wallLayer.depth = this.lowerDepth + 0.2;
        this.specialLayer.depth = this.lowerDepth + 0.3;
    }

    /**
     * sets the depth of the cursors
     * @param newDepth The new depth to set the cursors to */
    setCursorDepth(newDepth: number){
        this.cursorDepth = newDepth;
        this.toolCursor.setDepth(this.cursorDepth + 0.1);
        if (this.cursorTile){
            this.cursorTile.setDepth(this.cursorDepth + 0.2);
        }
    }


    /**
     * Update function called in the update loop to run the logic for moving and placing blocks when in build mode. 
     * @param player what player is doing the building here and we should check around to allow building
     * */
    update(player: Player) {
        if(this.inBuildMode && this.currentTile){
            //grab the cursor's current point in the world taking into account the camera
            let worldPoint = <Phaser.Math.Vector2>this.currentScene.input.activePointer.positionToCamera(this.currentScene.cameras.main);
            let worldTile: Phaser.Math.Vector2 = this.floorLayer.worldToTileXY(worldPoint.x, worldPoint.y,true);
            let tilecoord = this.floorLayer.tileToWorldXY(worldTile.x, worldTile.y);
            //move cursor tile
            this.cursorTile.x = tilecoord.x + 8;
            this.cursorTile.y = tilecoord.y + 8;
            //move cursor hammer
            this.toolCursor.x = worldPoint.x - 10;
            this.toolCursor.y = worldPoint.y - 10;
            //check if a block could be placed this update
            let canPlace: boolean = true;
            //check for radius around player
            let differenceX = Math.abs(player.party[0].sprite.x - tilecoord.x);
            let differenceY = Math.abs(player.party[0].sprite.y - tilecoord.y)
            if(Math.hypot(differenceX, differenceY) > 125){
                canPlace = false;
            }
            //check we are not building on the player
            let playerBounds = player.party[0].sprite.getBounds();
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
            if (this.currentScene.input.manager.activePointer.isDown && this.currentTile && canPlace) {
                this.hammeringTween.play();
                if(this.toolSelected == "hammer"){
                    if(this.layerSelected == "floor"){
                        let tilesetStart = this.testBuildSpriteSheet.firstgid;
                        let tile = this.floorLayer.putTileAtWorldXY(tilesetStart + this.currentTile.tileSetOffSet, worldPoint.x, worldPoint.y);
                        tile.rotation = Phaser.Math.DegToRad(this.rotation);
                    } else if (this.layerSelected == "wall"){
                        let tilesetStart = this.testBuildSpriteSheet.firstgid;
                        let tile = this.wallLayer.putTileAtWorldXY(tilesetStart + this.currentTile.tileSetOffSet, worldPoint.x, worldPoint.y);
                        tile.rotation = Phaser.Math.DegToRad(this.rotation);
                        tile.setCollision(true);
                    }
                } else if (this.toolSelected == "pick"){
                    if(this.layerSelected == "floor"){
                        this.floorLayer.removeTileAtWorldXY(worldPoint.x, worldPoint.y);
                    } else if (this.layerSelected == "wall") {
                        this.wallLayer.removeTileAtWorldXY(worldPoint.x, worldPoint.y);
                    }
                }
            }
        }
    }

    /**
     * Creates all the listerns used by this class, this also allows the file to stay organized as all the
     * listeners are listen in one place
     */
    createListeners(){
        this.signals.on("newTileSelected", (incomingTile: tiledata) => {
            if (this.cursorTile){
                this.cursorTile.setTexture(incomingTile.tileSetKey+"Table",incomingTile.tileSetOffSet);
            } else {
                //create build modes cursor tile
                this.cursorTile = this.currentScene.add.sprite(0, 0, incomingTile.tileSetKey+"Table", incomingTile.tileSetOffSet);
                this.cursorTile.setOrigin(.5,.5);
                this.cursorTile.setAlpha(.7);
                this.cursorTile.setDepth(this.cursorDepth + 0.2);
                this.cursorTile.setVisible(false);
                this.cursorTile.rotation = Phaser.Math.DegToRad(this.rotation);
                this.cursorTween = this.currentScene.tweens.add({
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

        this.signals.on("buildingLayerChanged", (newCurrentLayer: string) => {
            this.layerSelected = newCurrentLayer;
        })

        this.signals.on("clearBuildingLayer", (newCurrentLayer: string) => {
            this.layerSelected = "";
        })

        this.signals.on("clearBuildingTool", (newCurrentLayer: string) => {
            this.toolSelected = "";
        })
    }
    
}