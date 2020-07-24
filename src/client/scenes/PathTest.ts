import { SignalManager } from "../tools/SignalManager";
import { Player } from "../classes/Player";
import * as easystar from 'easystarjs';
import { hookToMethod } from "../tools/Hook";

let PLAYER_OFFSET = {
    x: 8,
    y: -2
}
let PO = PLAYER_OFFSET;

export class PathTest extends Phaser.Scene {

    signals: SignalManager;
    player: Player;
    finder: easystar.js;
    map: Phaser.Tilemaps.Tilemap;
    tiles: Phaser.Tilemaps.Tileset;

    constructor() {
        super("PathTest");
    }

    init() {
        this.cameras.main.setZoom(2);
    }

    create() {
        // Instance of our path finding library
        this.finder = new easystar.js();

        this.player = new Player(this, PO.x, PO.y);

        this.createTileMap();
        this.createListeners();

        this.player.addPartyMemberByKey("craigTheTestDummy", "craigThePortrait");

        /**setup the main camera */
        this.cameras.main.startFollow(this.player.party[0].sprite, true);

        // Create the games hud scene
        this.scene.launch('Hud');

        // Round physics positions to avoid ugly render artifacts
        hookToMethod(Phaser.Physics.Arcade.Body.prototype, 'update', function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
        });

        this.input.on('pointerdown', this.handleClick, this);

    }

    update() {
        this.player.updatePlayerInput();
        this.player.update();
    }

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

    createTileMap() {
        // Create the tilemap w/ tileset in Phaser
        this.map = this.make.tilemap(
            {
                key: 'pathTest'
            }
        );
        this.tiles = this.map.addTilesetImage('islandA2');
        let bgLayer = this.map.createStaticLayer('background', this.tiles, 0, 0);
        bgLayer.setCollisionByProperty({ passThru: false });
        this.player.addCollisionByLayer(bgLayer);

        // Create an abstract grid object for the path finder to use
        let grid = [];
        // Looping through rows & columns, creating 2D grid
        for (let ry = 0; ry < this.map.height; ry++) {
            let col = [];
            for (let cx = 0; cx < this.map.width; cx++) {
                // In each cell we store the ID of the tile, which corresponds
                // to its index in the tileset of the map ("ID" field in Tiled)
                col.push(this.getTileID(cx, ry));
            }
            grid.push(col);
        }
        // Set the pathing system's grid
        this.finder.setGrid(grid);

        // Determine which tiles are walkable in the pathing system and which are not
        let tileset = this.map.tilesets[0];
        let properties = tileset.tileProperties;
        let acceptableTiles = [];
        for (let i = 0; i < this.tiles.total; i++) {
            // If the tile can be passed through, make it an acceptable tile
            if (properties[i]["passThru"]) {
                acceptableTiles.push(i + 1);
            }
            // Set the weight when picking paths
            if (properties[i].pathWeight) {
                this.finder.setTileCost(i + 1, 1 + properties[i].pathWeight);
            } else {
                this.finder.setTileCost(i + 1, 1);
            }
        }
        // Finalize the acceptable tiles in the grid
        this.finder.setAcceptableTiles(acceptableTiles);
    }

    getTileID(x: number, y: number) {
        let tile = this.map.getTileAt(x, y);
        return tile.index;
    }

    handleClick() {
        // Getting variables
        let pointer = this.input.activePointer;
        let x = pointer.worldX;
        let y = pointer.worldY;
        console.log("Clicked at? ", x, y);
        let toX = Math.floor(x / 16);
        let toY = Math.floor(y / 16);
        let fromX = Math.floor((this.player.party[0].sprite.x - PO.x) / 16);
        let fromY = Math.floor((this.player.party[0].sprite.y - PO.y) / 16);
        console.log(this.player.party[0].sprite.x, this.player.party[0].sprite.y);
        console.log('going from (' + fromX + ',' + fromY + ') to (' + toX + ',' + toY + ')');

        // Calculate the actual path and move the player via tweens
        this.finder.findPath(fromX, fromY, toX, toY, (path) => {
            if (path === null) {
                console.warn("Path was not found.");
            } else {
                console.log(path);
                this.tweenMovePlayer(path);
            }
        });
        this.finder.calculate();
    }

    tweenMovePlayer(path) {
        // Time per pixel (for moving) = 1 / player speed
        let tpp = 1 / this.player.freeRoamSpeed;
        // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
        let tweens = [];
        for (let i = 0; i < path.length - 1; i++) {
            let ex = path[i + 1].x;
            let ey = path[i + 1].y;
            tweens.push({
                targets: this.player.party[0].sprite,
                x: { value: ex * this.map.tileWidth + PO.x, duration: tpp * 16 * 1000 },
                y: { value: ey * this.map.tileHeight + PO.y, duration: tpp * 16 * 1000 }
            });
        }
        // Play all the tweens set up from the path
        this.tweens.timeline({
            tweens: tweens
        });
    }

}