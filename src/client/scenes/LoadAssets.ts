import { Loader, GameObjects, Scene } from 'phaser';

/**
 * Loads assets (images, sound, etc) for use by the Phaser Engine. This means
 * assigning each one a unique key and sending it to Phaser's loader.
 */
export class LoadAssets extends Scene {

    /**List of all asset files which need to be loaded */
    private files: { [key: string]: string };
    /**A string that holds the path leading to the assets folder */
    assets: string = "../../../assets"

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
        this.load.image("islandA1", `${this.assets}/images/tilesets/islandA1.png`);
        this.load.image("islandA2", `${this.assets}/images/tilesets/islandA2.png`);
        this.load.image("islandB", `${this.assets}/images/tilesets/islandB.png`);
        this.load.image("islandC", `${this.assets}/images/tilesets/islandC.png`);
        this.load.image("testBuildSpriteSheet", `${this.assets}/images/tilesets/testBuildSpriteSheet.png`);
        this.load.image("greg-portrait", `${this.assets}/images/characters/portraits/gregThePortrait.png`);
        this.load.image("dreg-portrait", `${this.assets}/images/characters/portraits/dregThePortrait.png`);
        this.load.image("meg-portrait", `${this.assets}/images/characters/portraits/megThePortrait.png`);
        this.load.image("craig-portrait", `${this.assets}/images/characters/portraits/craigThePortrait.png`);
        this.load.image("characterFrame", `${this.assets}/images/user-interface/character_frame.png`);
        this.load.image("bookIcon", `${this.assets}/images/user-interface/book.png`);
        this.load.image("outlineOfMan", `${this.assets}/images/free-use/outlineOfManBrown.png`);
        this.load.image("hammerIcon", `${this.assets}/images/user-interface/hammerIcon.png`);
        this.load.image("pickIcon", `${this.assets}/images/user-interface/pickIcon.png`);
        this.load.image("flipRightIcon", `${this.assets}/images/user-interface/icon_flip_right.png`);
        this.load.image("flipLeftIcon", `${this.assets}/images/user-interface/icon_flip_left.png`);


        // Loading Spritesheets
        this.load.spritesheet("greg", `${this.assets}/images/characters/gregTheTestDummy.png`, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("dreg", `${this.assets}/images/characters/dregTheTestDummy.png`, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("meg", `${this.assets}/images/characters/megTheTestDummy.png`, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("craig", `${this.assets}/images/characters/craigTheTestDummy.png`, { frameWidth: 32, frameHeight: 32 });

        // Loading Tilemaps
        this.load.tilemapTiledJSON("islandUpleft", `${this.assets}/tilemaps/islandUpleft.json`);
        this.load.tilemapTiledJSON("islandNorthSector", `${this.assets}/tilemaps/islandNorthSector.json`);


        this.load.spritesheet("testBuildSpriteSheetTable", `${this.assets}/images/tilesets/testBuildSpriteSheet.png`, { frameWidth: 16, frameHeight: 16 })
        this.load.spritesheet("woodenBackground", `${this.assets}/images/user-interface/wooden_Background.png`, { frameWidth: 256, frameHeight: 72 })
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