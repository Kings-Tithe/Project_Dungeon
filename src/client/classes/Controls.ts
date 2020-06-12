/**Controls
 * Hanldes the storing and polling of keys that have been assigned to certain
 * in-game actions. Currently there is no way to change these from the hard
 * coded controls but it is set up so that there can eventually be a menu for
 * adjusting keyboard controls.
 */

export class Controls {

    /**member functions */
    /**Keys */
    keys: { [key: string]: Phaser.Input.Keyboard.Key }

    /**Input manager */
    /**Refernces to the games input manager, used to create Phaser's key objects
     * so that we can use this class to poll them during the game. */
    inputManager: Phaser.Input.InputPlugin;


    constructor(scene: Phaser.Scene){
        this.keys = {};
        this.inputManager = scene.input;
        this.loadKeyBindings();
    }

    /**Eventually this will be stored in a key_config.json somewhere on the
     * local machine However until the there are default values here*/
    loadKeyBindings(){
        /**fill this.keys will all the keys we will need to poll in this scene */
        this.keys["walk up"] = this.inputManager.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys["walk left"] = this.inputManager.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys["walk down"] = this.inputManager.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keys["walk right"] = this.inputManager.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    /**Used to poll a key and see if it is pressed down */
    isDown(key: string){
        if (this.keys[key]){
            return this.keys[key].isDown;
        } else {
            console.log("Error: no known keybinding for the action: " + key);
        }
    }
}