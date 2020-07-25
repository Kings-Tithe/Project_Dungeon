import { Console } from "../../tools/Console";
import { BuildMenu } from "../../classes/ui/BuildMenu";
import { hookToMethod } from "../../tools/Hook";
import { SignalManager } from "../../tools/SignalManager";
import { CharacterSheet } from "../../classes/CharacterSheet";
import { Controls } from "../../tools/Controls";
import { GAME_WIDTH, GAME_HEIGHT, CENTER } from "../../tools/Globals";

/**
 * Hud scene that should display over the main game screen. Contains various
 * interactable elements and information for the player.
 */
export class Hud extends Phaser.Scene {

    //Memeber Varibles

    //sprites
    /**This stores all the potrait sprites for the characters in a party, it does
     * so in the form of an array of objects where the objects hold the spritekey
     * and the sprite it's self, the spritekey is stored so we can refrence that
     * sprite more easily */
    portraitSprites: { [key: string]: Phaser.GameObjects.Sprite };
    /**Sprite frame at the top of the screen that other ui elements hit ontop of it
     * sets a depth of 5. The character portrait sits under it */
    characterFrame: Phaser.GameObjects.Sprite;

    //strings
    /**Stores the spritekey of the currently in use character portrait */
    currentPortrait: string;
    /**stores the strings of scenes that have been paused */
    pausedScenes: string[];

    //GlobalEmitter
    /**Stores a refernce to the global event emitter */
    signals: SignalManager;

    //character sheet
    /**The instance of our character sheet part of the hud */
    characterSheet: CharacterSheet;

    //boolean
    /**Tells weather or not we are currently in building mode */
    inBuildingMode: boolean;
    /**tell weather the game is currently paused */
    paused: boolean;

    //graghics
    /**This is used to have a alpha over the screen when pausing */
    pauseFog: Phaser.GameObjects.Graphics;

    //text
    /**Displays text saying the game is paused when the game is paused */
    pausedText: Phaser.GameObjects.Text;

    //controls
    controls: Controls;
    
    buildMenu: BuildMenu;

    constructor() {
        super('Hud');

        //needs to be instantiated before use
        this.portraitSprites = {};
        this.inBuildingMode = false;
        this.paused = false;
        this.pausedScenes = [];
        this.controls = Controls.getInstance();

        //events to listen for
        this.signals = SignalManager.get();
        this.signals.on("addPortrait", this.addPortraitSprite, this)
        this.signals.on("changePortrait", this.changePortraitSprite, this);
        this.signals.on("pause-down", () => {
            if(this.paused){
                this.pauseFog.visible = false;
                this.pausedText.visible = false;
                for(let i = 0; i < this.pausedScenes.length; i++){
                    this.scene.resume(this.pausedScenes[i]);
                }
                this.paused = false;
            } else {
                this.paused = true;
                this.pauseFog.visible = true;
                this.pausedText.visible = true;
            }
        })
        this.signals.on("pausing", (incomingScene: string) => {
            this.pausedScenes.push(incomingScene);
        })
    

        this.characterSheet = new CharacterSheet(this);
    }

    create() {
        // Create a game console
        let con = Console.get(this);
        // Create a buidling menu ui element
        this.buildMenu = BuildMenu.get(this);
        this.buildMenu.placeToggleButton(this,130,52);

        // Listen for keypress and handle hud events
        hookToMethod(document, 'onkeypress', (ret, ev) => {
            // Backtick (or tilde) key (`, ~) even opens/closes the console
            if (ev.which == '96') {
                // Toggle the display of the console and phaser controls
                con.toggleDisplay(this.game.input.keyboard);
            }
        });

        //add control scheme
        this.controls.applyScheme(this, ["User Interface"]);

        //create character frame
        this.characterFrame = this.add.sprite(0, 0, "characterFrame").setOrigin(0, 0);
        this.characterFrame.setScale(2);
        this.characterFrame.setDepth(1)
;
        //create our character sheet
        this.characterSheet.createToggleButton(95, 52);
        this.characterSheet.createCharacterSheet();

        //create pause fog
        this.pauseFog = this.add.graphics();
        this.pauseFog.fillStyle(0x19abb5,.4);
        this.pauseFog.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
        this.pauseFog.visible = false;

        //create pausedText
        this.pausedText = this.add.text(CENTER.x, CENTER.y - 200, "Paused", {
            fontSize: "40px",
            color: "#4aff26"
        });
        this.pausedText.setOrigin(.5,.5);
        this.pausedText.visible = false;
    }

    /**Used to add to the list of character portrait sprites we have in portraitSprites */
    addPortraitSprite(spritekey: string) {
        if (this.portraitSprites[spritekey] == null) {
            //create the new sprite if it is not already in the list
            let newPortrait = this.add.sprite(10, 12, spritekey).setOrigin(0, 0);
            newPortrait.setScale(0);
            newPortrait.setDepth(0);
            //add to list
            this.portraitSprites[spritekey] = newPortrait;
        } else {
            console.log(spritekey + " already exists in the spritePortrait list");
        }

        //if there is no sprite currently in use, use the new one
        if (!this.currentPortrait) {
            this.currentPortrait = spritekey;
            this.portraitSprites[this.currentPortrait].setScale(1.3);
        }
    }

    /**Used to change what portrait is currently being shown */
    changePortraitSprite(spritekey) {
        //if the sprite exists hide the current and scale to visible the passed in portrait
        if (this.portraitSprites[spritekey] != null) {
            this.portraitSprites[this.currentPortrait].setScale(0);
            this.portraitSprites[spritekey].setScale(1.3);
            this.currentPortrait = spritekey;
        } else {
            console.log(spritekey + " does not exist in the spritePortrait list");
        }
    }

}