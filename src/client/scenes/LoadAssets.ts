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
    }

    /**
     * Phaser.Scene method which allows for loading of assets with the Phaser
     * loader. Runs after init() and before create()
     */
    preload() {

        // Loading Images
        this.load.image("islandA1", "I/images/tilesets/islandA1.png");
        this.load.image("islandA2", "images/tilesets/islandA2.png");
        this.load.image("islandB", "images/tilesets/islandB.png");
        this.load.image("islandC", "images/tilesets/islandC.png");
        this.load.image("testBuildSpriteSheet", "images/tilesets/testBuildSpriteSheet.png");
        this.load.image("gregThePortrait", "images/characters/potraits/gregThePortrait.png");
        this.load.image("dregThePortrait", "images/characters/potraits/dregThePortrait.png");
        this.load.image("megThePortrait", "images/characters/potraits/megThePortrait.png");
        this.load.image("craigThePortrait", "images/characters/potraits/craigThePortrait.png");
        this.load.image("characterFrame", "images/user-interface/character_frame.png");
        this.load.image("bookIcon", "images/user-interface/book.png");
        this.load.image("outlineOfMan", "images/free-use/outlineOfManBrown.png");
        this.load.image("hammerIcon", "images/user-interface/hammerIcon.png");
        this.load.image("pickIcon", "images/user-interface/pickIcon.png");
        this.load.image("flipRightIcon", "images/user-interface/icon_flip_right.png");
        this.load.image("flipLeftIcon", "images/user-interface/icon_flip_left.png");


        // Loading Spritesheets
        this.load.spritesheet("gregTheTestDummy", "images/character/gregTheTestDummy.png");
        this.load.spritesheet("dregTheTestDummy", "images/character/dregTheTestDummy.png");
        this.load.spritesheet("megTheTestDummy", "images/character/megTheTestDummy.png");
        this.load.spritesheet("craigTheTestDummy", "images/character/craigTheTestDummy.png");

        // Loading Tilemaps
        this.load.tilemapTiledJSON("islandUpleft", "tilemaps/islandUpleft.json");
        this.load.tilemapTiledJSON("islandNorthSector", "tilemaps/islandNorthSector.json");


        this.load.spritesheet("testBuildSpriteSheetTable", this.assetsFolder + "/images/tilesets/testBuildSpriteSheet.png", { frameWidth: 16, frameHeight: 16 })
        this.load.spritesheet("woodenBackground", this.assetsFolder + "/images/wooden_Background.png", { frameWidth: 256, frameHeight: 72 })
    }

    /**
     * Phaser.Scene method which represents the start of the Scene's behavior.
     * It runs after init() and preload() have completed
     */
    create() {
        //start the next scene
        this.scene.start('Island');
    }

}