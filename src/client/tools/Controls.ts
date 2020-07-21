import { SignalManager } from "./SignalManager";

/**Controls
 * Hanldes the storing and polling of keys that have been assigned to certain
 * in-game actions. It is set up so that there can eventually be a menu for
 * adjusting keyboard controls.
 */
export class Controls {

    //member varibles
    /**Keys */
    actions: { [key: string]: ActionI }

    //input manager
    /**Refernces to the games input manager, used to create Phaser's key objects
     * so that we can use this class to poll them during the game. */
    inputManager: Phaser.Input.InputPlugin;

    //event emitter
    emitter: SignalManager;

    //boolean
    globalCheckable: boolean;



    private constructor(scene: Phaser.Scene){
        this.actions = {};
        this.inputManager = scene.input;
        this.loadKeyBindings();
        this.emitter = SignalManager.get();
        this.globalCheckable = true;
    }

    /**Allows getting the single global instance of this class, must
     * be used because this class is a singleton and the constructor is private
     * @param scene the inital scene this is being grabbed in, simply used to grab a refernce to the
     * global input manager
     */
    static getInstance(scene: Phaser.Scene){
        //if an instance has not been made yet, create one
        if (instance == null){
            instance = new Controls(scene);
        }
        //as long as we have an instance, return it
        return instance;
    }

    /**Eventually this will be stored in a key_config.json somewhere on the
     * local machine However until then there are default values here*/
    loadKeyBindings(){
        let defaultOnceDelay: number = 400;
        //fill this.keys will all the keys we will need to poll in this scene
        this.actions["walk up"] = {
            actionKey: "walk up", 
            onceDelay: defaultOnceDelay, 
            key:this.inputManager.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W), 
            delayed: false,
            checkable: true
        }
        this.actions["walk left"] = {
            actionKey: "walk left", 
            onceDelay: defaultOnceDelay, 
            key:this.inputManager.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A), 
            delayed: false,
            checkable: true
        }
        this.actions["walk down"] = {
            actionKey: "walk down", 
            onceDelay: defaultOnceDelay, 
            key:this.inputManager.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S), 
            delayed: false,
            checkable: true
        }
        this.actions["walk right"] = {
            actionKey: "walk right", 
            onceDelay: defaultOnceDelay, 
            key:this.inputManager.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D), 
            delayed: false,
            checkable: true
        }
        this.actions["change leader"] = {
            actionKey: "change leader", 
            onceDelay: defaultOnceDelay, 
            key:this.inputManager.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E), 
            delayed: false,
            checkable: true
        }

        //once our list is loaded up we can go ahead and set everything up
        let keys = Object.keys(this.actions)
        for(let key of keys){
            /*set it to globally emit the actions key plus -down when pressed down and not delayed, then delay
            it's self for the delayed period */
            this.actions[key].key.on("down", () => {
                if(!this.actions[key].delayed && this.actions[key].checkable && this.globalCheckable){
                    this.emitter.emit(this.actions[key].actionKey + "-down");
                    this.actions[key].delayed = true;
                    setTimeout(() => {
                        this.actions[key].delayed = false;
                    }, this.actions[key].onceDelay);
                }
            });
            //set it to globally emit the actions key plus -up first released
            this.actions[key].key.on("up", () => {
                if(this.actions[key].checkable && this.globalCheckable){
                    this.emitter.emit(this.actions[key].actionKey + "-up");
                }
            });
        }
        //set up the emitter for when any key is pressed
        this.inputManager.keyboard.on("keydown",() => {
            this.emitter.emit("anyKey-down");
        })
        this.inputManager.keyboard.on("keyup", () => {
            this.emitter.emit("anyKey-up");
        })
    }

    /**
     * This is used to change what key is used to represent an action, it first removes all the old
     * keys bindings and then sets up the new keys bindings
     * @param actionKey the action string to change
     * @param newKey The new Phaser key object to change the action to
     */
    changeKey(actionKey:string, newKey: Phaser.Input.Keyboard.Key){
        //completely remove old key
        let checkable = this.actions[actionKey].key.enabled;
        this.actions[actionKey].key.removeAllListeners();
        this.inputManager.keyboard.removeKey(this.actions[actionKey].key);
        this.actions[actionKey].key.destroy;
        //set up the new key
        this.actions[actionKey].key = newKey;
        /*set it to globally emit the actions key plus -down when pressed down and not delayed, then delay
        it's self for the delayed period */
        this.actions[actionKey].key.on("down", () => {
            if(!this.actions[actionKey].delayed && this.actions[actionKey].checkable && this.globalCheckable){
                this.emitter.emit(this.actions[actionKey].actionKey + "-down");
                this.actions[actionKey].delayed = true;
                setTimeout(() => {
                    this.actions[actionKey].delayed = false;
                }, this.actions[actionKey].onceDelay);
            }
        });
        //set it to globally emit the actions key plus -up first released
        this.actions[actionKey].key.on("up", () => {
            if (this.actions[actionKey].checkable && this.globalCheckable){
                this.emitter.emit(this.actions[actionKey].actionKey + "-up");
            }
        });
        //make sure to carry over the actions checkable state
        if(!checkable){
            this.actions[actionKey].key.enabled = checkable;
        }
    }

    /**
     * Enables or diables the ability of this action to be checked, this does not change
     * the key, that is done thru setKeyCheckable, this is only for the action, allowing other
     * actions that might use the same key to be used.
     * @param state water to disbale or enable the given actions key
     */
    setActionCheckable(actionKey: string, state: boolean){
        this.actions[actionKey].checkable = state;
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
    isDown(key: string){
        if (this.actions[key] && this.actions[key].checkable && this.globalCheckable){
            return this.actions[key].key.isDown;
        } else {
            console.log("Error: no known keybinding for the action: " + key);
        }
    }

    /**Used to poll a key and see if it is currently not pressed
    * @param key the string key of the action being polled
    */
   isUp(key: string){
        if (this.actions[key] && this.actions[key].checkable && this.globalCheckable){
            return this.actions[key].key.isUp;
        } else {
            console.log("Error: no known keybinding for the action: " + key);
        }
    }

    /**
     * Used to check how long a actions key has been down
     * @param actionKey the action to check the keys duration
     */
    downDuration(actionKey: string): number{
        return this.actions[actionKey].key.getDuration();
    }
}

/**This is the varible used to store our one instance of our singlton class, this
 * is a module level variable and cannot be seen by other scripts */
let instance: Controls;

/**Class level interface used to store information important to each action and
 * related key binding
 */
interface ActionI {
    /**The string used to signal the related in-game action */
    actionKey: string,
    /**Phaser key object assocated with the action */
    key: Phaser.Input.Keyboard.Key,
    /**Delay used between single key press detections */
    onceDelay: number,
    /**Boolean telling if the key is currently delayed or not */
    delayed: boolean,
    /**tells weather or not the action can be checked at the time */
    checkable: boolean
}