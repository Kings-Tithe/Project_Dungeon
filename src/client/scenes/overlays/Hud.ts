import { Console } from "../../tools/Console";
import { hookToMethod } from "../../tools/Hook";

/**
 * Hud scene that should display over the main game screen. Contains various
 * interactable elements and information for the player.
 */
export class Hud extends Phaser.Scene {

    constructor() {
        super('Hud');
    }

    create() {
        this.createConsole();
    }

    createConsole() {
        // Create a game console
        let con = new Console(this);
        con.rewireAll();
        console.log(document.onkeypress);
        hookToMethod(document, 'onkeypress', function() {
            console.log('backtiiiiiiiick');
        });
    }

}