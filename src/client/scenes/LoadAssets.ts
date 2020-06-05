import { Loader, GameObjects, Scene } from 'phaser';

/**
 * Loads assets (images, sound, etc) for use by the Phaser Engine. This means
 * assigning each one a unique key and sending it to Phaser's loader.
 */
export class LoadAssets extends Scene {

    /**List of all asset files which need to be loaded */
    private files: { [key: string]: string };
    /**A string that holds the path leading to the assets folder */
    assetsFolder: string = "../../../assets"

    /**Creates instance of Scene */
    constructor() {
        super('LoadAssets');
        /**
         * List of all asset files which need to be loaded. Each line starts
         * with an asset type identifying code, then the path to the asset starting
         * from the assets folder/from the path held by this.assetsFolder.
         * A = Audio
         * I = Image
         * S = Spritesheet
         * T = Tilemap
         */
        this.files = {
            /** Images */
            "islandA1": "I/images/tilesets/islandA1.png",
            "islandA2": "I/images/tilesets/islandA2.png",
            "islandB": "I/images/tilesets/islandB.png",
            "islandC": "I/images/tilesets/islandC.png",

            /** Spritesheet */
            "character_template": "S/images/TemplateSpriteSheet.png",

            /** Tilemaps */
            "island": "T/tilemaps/island.json",
        }

    }

    /**
     * Phaser.Scene method which allows for loading of assets with the Phaser
     * loader. Runs after init() and before create()
     */
    preload() {

        // Loop through every key in the file list
        for (let key of Object.keys(this.files)) {
            /**Check the type of asset, then load the asset. When loading, take
             * a slice that doesn't include the first character. That first
             * character just tells use the type of asset. */
            if (this.files[key][0] == 'S') {
                this.load.spritesheet(key, this.assetsFolder + this.files[key].slice(1), { frameWidth: 32, frameHeight: 32 });
            } else if (this.files[key][0] == 'I') {
                this.load.image(key, this.assetsFolder + this.files[key].slice(1));
            } else if (this.files[key][0] == 'A') {
                this.load.audio(key, this.assetsFolder + this.files[key].slice(1));
            } else if (this.files[key][0] == 'T') {
                this.load.tilemapTiledJSON(key, this.assetsFolder + this.files[key].slice(1))
            }
        }
    }

    /**
     * Phaser.Scene method which represents the start of the Scene's behavior.
     * It runs after init() and preload() have completed
     */
    create() {
        // Start the next scene
        this.scene.start('Island');
    }

}