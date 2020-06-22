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

        //create character frame
        let frame = this.add.sprite(0,0,"characterFrame").setOrigin(0,0);
        frame.setScale(2);
        frame.setDepth(1);

        //put an example character in the frame
        let portrait = this.add.sprite(10,12,"gregThePortrait").setOrigin(0,0);
        portrait.setScale(1.3);
        portrait.setDepth(0);
    }
}