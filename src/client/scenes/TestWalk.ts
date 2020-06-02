
export class TestWalk extends Phaser.Scene {


    preload(){
        //load in test tile maps
        this.load.image("test-tiles",'../../../assets/images/tilemaps/desert_A.png');
        this.load.tilemapCSV("test-tilemap",'../../../assets/tilemaps/MyFirstTileMap.csv');
    }

    create(){
            let map = this.make.tilemap({ key: "test-tilemap", tileWidth: 16, tileHeight: 16 });
            let tileset = map.addTilesetImage("test-tiles");
            let layer = map.createStaticLayer(0, tileset, 0, 0); 
    }
}