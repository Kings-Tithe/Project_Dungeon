// ---> need this before first build
//import * as Phaser from 'phaser';

/**Dungeon_Project game configuration, including settings such as render type,
 * logical size, anti-aliasing, and more. */
const config: Phaser.Types.Core.GameConfig = {

    /** Automatically determine how to render */
    type: Phaser.AUTO,
    /** Primary scene objects */
    scene: [],
    /** Title to display on the game */
    title: 'Dungeon_Project',
    /** Prevents anti-aliasing */
    render: {
        pixelArt: true
    },
    /** Black background when nothing else is being displayed over it */
    backgroundColor: '000000',
    /**Game (canvas) attaches to the div with id 'game'. Scale manager ensures
     * scaling of logical size (calculated) to actual size (window), The 
     * resolution we decided to go with was 720p */
    scale: {
        parent: 'game',
        mode: Phaser.Scale.FIT,
        width: 1280,
        height: 720
    }
}

/** This is the primary Phaser game object. After construction it
 * will automatically transition to the first scene in the scene array.
 */
new Phaser.Game(config);

console.log("yay, the build script worked!");