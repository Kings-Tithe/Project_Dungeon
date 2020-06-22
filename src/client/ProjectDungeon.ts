import * as Phaser from 'phaser';

import { TestBox } from './scenes/TestBox';
import { Island } from './scenes/Island';
import { LoadAssets } from './scenes/LoadAssets';
import { Hud } from './scenes/overlays/Hud';

/**Dungeon_Project game configuration, including settings such as render type,
 * logical size, anti-aliasing, and more. */
const config: Phaser.Types.Core.GameConfig = {

    /** Automatically determine how to render */
    type: Phaser.AUTO,

    /** Primary scene objects */
    scene: [
        LoadAssets,
        Island,
        TestBox,
        Hud
    ],

    /** Title to display on the game */
    title: 'ProjectDungeon',
    /** Prevents anti-aliasing */
    render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true
    },
    /** Adds easy access to built in functions for collison */
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    /** Black background when nothing else is being displayed over it */
    backgroundColor: '000000',
    /**Game (canvas) attaches to the div with id 'game'. Scale manager ensures
     * scaling of logical size (calculated) to actual size (window), The 
     * resolution we decided to go with was 720p */
    scale: {
        parent: 'project-dungeon',
        mode: Phaser.Scale.FIT,
        width: 1280,
        height: 720
    },
    /** Allows dom elements to be added to phaser's managers */
    dom: {
        createContainer: true
    }
};

/** This is the primary Phaser game object. After construction it
 * will automatically transition to the first scene in the scene array.
 */
new Phaser.Game(config);
