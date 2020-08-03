import { SignalManager } from "./SignalManager";

/**Controls
 * Hanldes the storing and polling of keys that have been assigned to certain
 * in-game actions, these actions are stored in seperate schemes. A scheme should
 * never be set to more then one scene at a time, this would defeat the point of the
 * schemes. A scene can however have multiple schemes applied to it and in all likely hood
 * will. Note: schemes should not have actions of the same name as other schemes. It is set
 * up so that there can eventually be a menu for adjusting keyboard controls.
 */
export class Controls {

    //member varibles
    /**Keys */
    schemes: { [key: string]: Ischeme }

    //event emitter
    emitter: SignalManager;

    //boolean
    globalCheckable: boolean;



    private constructor(){
        this.schemes = {};
        this.loadKeyBindings();
        this.globalCheckable = true;
        this.emitter = SignalManager.get();
    }

    /**Allows getting the single global instance of this class, must
     * be used because this class is a singleton and the constructor is private
     * @param scene the inital scene this is being grabbed in, simply used to grab a refernce to the
     * global input manager
     */
    static getInstance(){
        //if an instance has not been made yet, create one
        if (instance == null){
            instance = new Controls();
        }
        //as long as we have an instance, return it
        return instance;
    }

    /**Eventually this will be stored in a key_config.json somewhere on the
     * local machine However until then there are default values here*/
    loadKeyBindings(){
        //generate schemes
        this.schemes["Player"] = {
            name: "Player",
            actions: {},
            currentScene: null
        }
        this.schemes["User Interface"] = {
            name: "User Interface",
            actions: {},
            currentScene: null
        }
        this.schemes["Scene"] = {
            name: "Scene",
            actions: {},
            currentScene: null
        }
        this.schemes["Building"] = {
            name: "Building",
            actions: {},
            currentScene: null
        }

        let defaultdelayDuration: number = 400;
        //fill this.keys will all the keys we will need to poll in this scene
        this.schemes["Player"].actions["walk up"] = {
            actionKey: "walk up", 
            delayDuration: defaultdelayDuration, 
            keyCode: Phaser.Input.Keyboard.KeyCodes.W,
            key: null, 
            delayed: false,
            checkable: true
        }
        this.schemes["Player"].actions["walk left"] = {
            actionKey: "walk left", 
            delayDuration: defaultdelayDuration, 
            keyCode: Phaser.Input.Keyboard.KeyCodes.A,
            key: null,  
            delayed: false,
            checkable: true
        }
        this.schemes["Player"].actions["walk down"] = {
            actionKey: "walk down", 
            delayDuration: defaultdelayDuration, 
            keyCode: Phaser.Input.Keyboard.KeyCodes.S,
            key: null,  
            delayed: false,
            checkable: true
        }
        this.schemes["Player"].actions["walk right"] = {
            actionKey: "walk right", 
            delayDuration: defaultdelayDuration, 
            keyCode: Phaser.Input.Keyboard.KeyCodes.D,
            key: null,  
            delayed: false,
            checkable: true
        }
        this.schemes["Player"].actions["change leader"] = {
            actionKey: "change leader", 
            delayDuration: defaultdelayDuration, 
            keyCode: Phaser.Input.Keyboard.KeyCodes.E,
            key: null,  
            delayed: false,
            checkable: true
        }
        this.schemes["Scene"].actions["pause scene"] = {
            actionKey: "pauseScene", 
            delayDuration: defaultdelayDuration, 
            keyCode: Phaser.Input.Keyboard.KeyCodes.ESC,
            key: null,  
            delayed: false,
            checkable: true
        }
        this.schemes["User Interface"].actions["pause"] = {
            actionKey: "pause", 
            delayDuration: defaultdelayDuration, 
            keyCode: Phaser.Input.Keyboard.KeyCodes.ESC,
            key: null,  
            delayed: false,
            checkable: true
        }
        this.schemes["Building"].actions["rotate block right"] = {
            actionKey: "pause", 
            delayDuration: defaultdelayDuration, 
            keyCode: Phaser.Input.Keyboard.KeyCodes.E,
            key: null,  
            delayed: false,
            checkable: true
        }
        this.schemes["Building"].actions["rotate block left"] = {
            actionKey: "pause", 
            delayDuration: defaultdelayDuration, 
            keyCode: Phaser.Input.Keyboard.KeyCodes.Q,
            key: null,  
            delayed: false,
            checkable: true
        }
    }

    /**
     * Allows applying schemes to a scene. A scheme cannot be applied to multiple
     * scenes at a time. Multiple schemes can be applied to one scene.
     * @param scene Scene to apply the scheme to
     * @param schemeKeys The key(s) of the schemes to apply
     */
    applyScheme(scene: Phaser.Scene, schemeKeys: string[]){
        for(let schemeKey of schemeKeys){
            //set the schemes current scene
            this.schemes[schemeKey].currentScene = scene;
            //create/replace the key objects to allow polling and set up the listeners for the keys
            for(let actionKey of Object.keys(this.schemes[schemeKey].actions)){
                this.schemes[schemeKey].actions[actionKey].key = scene.input.keyboard.addKey(this.schemes[schemeKey].actions[actionKey].keyCode);
                this.addKeyListeners(schemeKey, actionKey);
        }
        }
    }

    /**
     * Adds the listeners for for a key of a scheme is pressed down and 
     * let up at which point the global emitter will send -down and -up signals.
     * @param schemeKey The scheme that holds the key to set up the listeners for
     * @param actionKey The action key attached to the key to set up the listeners for
     */
    addKeyListeners(schemeKey: string, actionKey: string){
    /*set it to globally emit the actions key plus -down when pressed down and not delayed, then delay
        it's self for the delayed period */
        this.schemes[schemeKey].actions[actionKey].key.on("down", () => {
            if(!this.schemes[schemeKey].actions[actionKey].delayed && this.schemes[schemeKey].actions[actionKey].checkable && this.globalCheckable){
                this.emitter.emit(actionKey + "-down");
                this.schemes[schemeKey].actions[actionKey].delayed = true;
                setTimeout(() => {
                    this.schemes[schemeKey].actions[actionKey].delayed = false;
                }, this.schemes[schemeKey].actions[actionKey].delayDuration);
            }
        });
        //set it to globally emit the actions key plus -up first released
        this.schemes[schemeKey].actions[actionKey].key.on("up", () => {
            if(this.schemes[schemeKey].actions[actionKey].checkable && this.globalCheckable){
                this.emitter.emit(actionKey + "-up");
            }
        });
    }

    /**
     * This is used to change what key is used to represent an action, it first removes all the old
     * keys bindings and then sets up the new keys bindings
     * @param actionKey the action string to change
     * @param newKey The new Phaser key object to change the action to
     */
    changeKey(schemeKey: string, actionKey:string, newKey: string){
        //completely remove old key
        this.schemes[schemeKey].actions[actionKey].key.removeAllListeners();
        this.schemes[schemeKey].currentScene.input.keyboard.removeKey(this.schemes[schemeKey].actions[actionKey].key);
        this.schemes[schemeKey].actions[actionKey].key.destroy;
        //set up the new key
        this.schemes[schemeKey].actions[actionKey].key = this.schemes[schemeKey].currentScene.input.keyboard.addKey(newKey);
    }

    /**
     * Enables or diables the ability of this action to be checked, this does not change
     * the key, that is done thru setKeyCheckable, this is only for the action, allowing other
     * actions that might use the same key to be used.
     * @param state water to disbale or enable the given actions key
     */
    setActionCheckable(schemeKey: string, actionKey: string, state: boolean){
        this.schemes[schemeKey].actions[actionKey].checkable = state;
    }

    /**This disables or enables a key to bed checkable, id a key is disabled all actions
     * that use the key will also be disabled.
     * @param key what key should be enabeld or disabled
     */
    setKeyCheckable(key: Phaser.Input.Keyboard.Key, state: boolean){
        key.enabled = state;
    }

    /**Sets weather or not any key can be checkable thru this class allowing for disabling of
     * all keyboard input temporarly. This dosen't disable keys nor override actions indivdual
     * cheackable states
     * @param state the state to put the entire manager in
     */
    setGlobalCheckable(state: boolean){
        this.globalCheckable = state;
    }

    /**Used to poll a key and see if it is pressed down 
     * @param key the string key of the action being polled
    */
    isDown(schemeKey: string, actionKey: string){
        if (this.schemes[schemeKey] && this.schemes[schemeKey].actions[actionKey] && this.schemes[schemeKey].actions[actionKey].checkable && this.globalCheckable){
            return this.schemes[schemeKey].actions[actionKey].key.isDown;
        } else {
            console.log("Error: no known keybinding for the action: " + actionKey);
        }
    }

    /**Used to poll a key and see if it is currently not pressed
    * @param key the string key of the action being polled
    */
   isUp(schemeKey: string, actionKey: string){
        if (this.schemes[schemeKey].actions[actionKey] && this.schemes[schemeKey].actions[actionKey].checkable && this.globalCheckable){
            return this.schemes[schemeKey].actions[actionKey].key.isUp;
        } else {
            console.log("Error: no known keybinding for the action: " + actionKey);
        }
    }

    /**
     * Used to check how long a action's key has been down
     * @param actionKey the action to check the keys duration
     */
    downDuration(schemeKey: string, actionKey: string): number{
        return this.schemes[schemeKey].actions[actionKey].key.getDuration();
    }

    /**Tells you what key is attached to an action
     * @param actionKey the action to check the key for
     */
    whatKey(schemeKey: string, actionKey: string): Phaser.Input.Keyboard.Key{
        return this.schemes[schemeKey].actions[actionKey].key;
    }

    /**
     * Sets the time to wait before allowing the emission of the -up and -down flags
     * for a key
     * @param schemeKey The scheme that holds the key to set the delay for 
     * @param actionKey The action to set the delay for
     * @param duration The duration to set the delay for
     */
    setDelay(schemeKey: string, actionKey: string, duration: number){
        this.schemes[schemeKey].actions[actionKey].delayDuration = duration;
    }
}

/**This is the varible used to store our one instance of our singlton class, this
 * is a module level variable and cannot be seen by other scripts */
let instance: Controls;

/**Class level interface used to store information important to each action and
 * related key binding
 */
interface IAction {
    /**The string used to signal the related in-game action */
    actionKey: string,
    /**String that tells the key generator what key to add to the scene */
    keyCode: number,
    /**Stores the key object so we can poll it later on */
    key: Phaser.Input.Keyboard.Key,
    /**Delay used between single key press detections */
    delayDuration: number,
    /**Boolean telling if the key is currently delayed or not */
    delayed: boolean,
    /**tells weather or not the action can be checked at the time */
    checkable: boolean
}

interface Ischeme {
    /**The name of the scheme used internally */
    name: string,
    /**A list of actions that this scheme holds */
    actions: {[key: string]: IAction};
    /**Stores the current scene using this scheme */
    currentScene: Phaser.Scene
}