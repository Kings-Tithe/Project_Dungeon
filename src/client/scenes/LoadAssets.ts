import { Loader, GameObjects, Scene } from 'phaser';
import { hookToMethod } from '../tools/Hook';

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
        this.load.image("characterFrame", `${this.assets}/images/user-interface/character_frame.png`);
        this.load.image("bookIcon", `${this.assets}/images/user-interface/book.png`);
        this.load.image("outlineOfMan", `${this.assets}/images/free-use/outlineOfManBrown.png`);
        this.load.image("flipRightIcon", `${this.assets}/images/user-interface/icon_flip_right.png`);
        this.load.image("flipLeftIcon", `${this.assets}/images/user-interface/icon_flip_left.png`);
        this.load.image("blueFlag", `${this.assets}/images/debugging/blueFlag.png`)
        this.load.image("greenFlag", `${this.assets}/images/debugging/greenFlag.png`)
        this.load.image("orangeFlag", `${this.assets}/images/debugging/orangeFlag.png`)
        this.load.image("redFlag", `${this.assets}/images/debugging/redFlag.png`)

        // Loading Characters
        this.loadCharacter("greg");
        this.loadCharacter("dreg");
        this.loadCharacter("craig");
        this.loadCharacter("meg");


        // Loading Spritesheets
        this.load.spritesheet("testBuildSpriteSheetTable", `${this.assets}/images/tilesets/testBuildSpriteSheet.png`, { frameWidth: 16, frameHeight: 16 })
        this.load.spritesheet("woodenBackground", `${this.assets}/images/user-interface/wooden_Background.png`, { frameWidth: 256, frameHeight: 72 })
        this.load.spritesheet("hammerIcon", `${this.assets}/images/user-interface/hammerIcon.png`, { frameWidth: 14, frameHeight: 18 })
        this.load.spritesheet("pickIcon", `${this.assets}/images/user-interface/pickIcon.png`, { frameWidth: 15, frameHeight: 17 })
        this.load.spritesheet("doorIcon", `${this.assets}/images/user-interface/doorIcon.png`, { frameWidth: 27, frameHeight: 47 })
        this.load.spritesheet("floorIcon", `${this.assets}/images/user-interface/floorIcon.png`, { frameWidth: 70, frameHeight: 16 })
        this.load.spritesheet("wallIcon", `${this.assets}/images/user-interface/wallIcon.png`, { frameWidth: 70, frameHeight: 35 })
        this.load.spritesheet("roofIcon", `${this.assets}/images/user-interface/roofIcon.png`, { frameWidth: 70, frameHeight: 47 })

        // Loading Tilemaps
        this.load.tilemapTiledJSON("islandUpleft", `${this.assets}/tilemaps/islandUpleft.json`);
        this.load.tilemapTiledJSON("islandNorthSector", `${this.assets}/tilemaps/islandNorthSector.json`);
    }

    /**
     * Phaser.Scene method which represents the start of the Scene's behavior.
     * It runs after init() and preload() have completed
     */
    create() {
        // Round physics positions to avoid ugly render artifacts
        hookToMethod(Phaser.Physics.Arcade.Body.prototype, 'update', function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
        });
        // Create the games hud scene
        this.scene.launch('Hud');
        //start the next scene
        this.scene.start('IslandNorthWest');
    }

    /**
     * Allows the quick and easy loading of a character and it's associated componets
     * For this to work the assets in to be in an exact format with in the assets folder.
     * Any assets that won't follow the format layed out below must be loaded manually
     * Format:
     * ---A characters main sprite sheet should be in the assets/images/characters folder
     * with the the characters key + "Spritesheet" + .fileformat as the
     * name
     * ---A characters portrait must be in assets/images/characters/portraits, be named
     * the characters key + "Portrait" + .fileformat
     * @param characterKey the key of the character, generally their name
     * @param fileFormat an optional file format in case the image files are not
     * in default format, default format is png
     */
    loadCharacter(characterKey: string, fileFormat: string = ".png"){
        this.load.spritesheet(characterKey + "-spritesheet" , this.assets + "/images/characters/" + characterKey + "Spritesheet" + fileFormat, { frameWidth: 32, frameHeight: 32 });
        this.load.image(characterKey + "-portrait", this.assets + "/images/characters/portraits/" + characterKey + "Portrait" + fileFormat);
    }

}