
/** */
export class TilemapManager {

    //tilemap
    /**Stores the tilemap being managed by this class */
    map: Phaser.Tilemaps.Tilemap;

    //layers
    /**Stores all the layers created/grabed off the tilemap for this map */
    layers: {[key: string]: Phaser.Tilemaps.StaticTilemapLayer | Phaser.Tilemaps.DynamicTilemapLayer}

    //tilesets
    /**Stores all the tilesets used to create the diffrent layers for this map */
    tilesets: {[key: string]: Phaser.Tilemaps.Tileset}

    /**Uses a tilemap key to create and store a tilemap */
    constructor(key: string, scene: Phaser.Scene){
        this.map = scene.make.tilemap({ key: key });
        this.layers = {};
        this.tilesets = {};
    }

    addTileset(key: string): Phaser.Tilemaps.Tileset{
        //add tileset
        this.tilesets[key] = this.map.addTilesetImage(key);
        //return in case the user needs to store a reference to the tileset
        return this.tilesets[key];
    }

    addLayer(key: string, tilesetKeys: string[], depth: number = 0, collision: boolean = false, dynamic: boolean = true): Phaser.Tilemaps.DynamicTilemapLayer | Phaser.Tilemaps.StaticTilemapLayer{
        //make an array of the tilesets for this layer
        let tilesets: Phaser.Tilemaps.Tileset[] = [];
        for(let i = 0; i < tilesetKeys.length; i++){
            tilesets.push(this.tilesets[tilesetKeys[i]]);
        }
        //create the layer, either dynamic or static based on dynamic boolean
        if(dynamic){
            this.layers[key] = this.map.createDynamicLayer(key,tilesets,0,0);
        } else {
            this.layers[key] = this.map.createStaticLayer(key,tilesets,0,0);
        }
        //set the layers depth
        this.layers[key].depth = depth;
        //if collision set collision on all block on that layer
        if(collision){
            //this.layers[key].setCollisionByExclusion([-1], true);
            this.layers[key].setCollisionByProperty({ passThru: false });
        }
        //return the created layer in case it needs to be stored by the user
        return this.layers[key];
    }

    getLayer(key: string): Phaser.Tilemaps.StaticTilemapLayer | Phaser.Tilemaps.DynamicTilemapLayer{
        return this.layers[key];
    }

    getSize(): Phaser.Math.Vector2{
        let size = new Phaser.Math.Vector2(this.map.widthInPixels,this.map.heightInPixels);
        return size;
    }

    //Need to reevalute how we make flags
    // createFlags(){
    //     let flag: Phaser.GameObjects.Sprite;
    //     this.mapManager.map.getObjectLayer("flags").objects
    //     .filter((tile)=>tile.id == 2)
    //     .forEach((tile)=>{
    //         flag = this.physics.add.sprite(tile.x, tile.y, 'orangeFlag');
    //         flag.setOrigin(0,0);
    //         flag.setScale(tile.width / flag.width, tile.height/ flag.height);
    //     })
    //     flag.setDepth(20);
    //     flag.setAlpha(0);
    //     //set collision with this flag
    //     this.physics.add.overlap(this.player.party[0].sprite, flag, () => {
    //         this.signals.emit("sceneChange");
    //         this.Builder.clearListeners();
    //         this.clearListeners();
    //         this.scene.start("IslandNorth", {
    //             x: 30,
    //             y: 575
    //         });
    //     })
    // }
}