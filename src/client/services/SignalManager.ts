/**This is a global emitter used for communication between scenes and classes */
export class SignalManager extends Phaser.Events.EventEmitter {

    private constructor() {
        super();
    }

    static get() {
        //if an instance has not been made yet, create one
        if (instance == null) {
            instance = new SignalManager;
        }
        //as long as we have an instance, return it
        return instance;
    }
}

/**This is the varible used to store our one instance of our singlton class, this
 * is a module level variable and cannot be seen by other scripts.
 */
let instance: SignalManager = null;