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

    /**creates our instance of this class, a new instance is created for
     * every scene, as such we don't need to worry about persisting things
     * across scenes.
     * @param scene The scene we will be building in
     */
    constructor(scene: Phaser.Scene){

    }
    
}