import { Console } from "../../tools/Console";

/**
 * Hud scene that should display over the main game screen. Contains various
 * interactable elements and information for the player.
 */
export class Hud extends Phaser.Scene {

    constructor() {
        super('Hud');
    }

    create() {
        // Create a game console
        let con = new Console(this);
        con.rewireAll();
    }
}