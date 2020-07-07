import { Console } from "../../tools/Console";
import { EventGlobals } from "../../tools/EventGlobals";
import { CENTER } from "../../tools/Globals";
import { CharacterSheet } from "../../classes/CharacterSheet";
import { hookToMethod } from "../../tools/Hook";

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
    /**Sprite used to toggle one and off the building menu */
    buildingToggleButton: Phaser.GameObjects.Sprite;

    //strings
    /**Stores the spritekey of the currently in use character portrait */
    currentPortrait: string;

    //GlobalEmitter
    /**Stores a refernce to the global event emitter */
    globalEmitter: EventGlobals;

    //character sheet
    /**The instance of our character sheet part of the hud */
    characterSheet: CharacterSheet;

    //boolean
    /**Tells weather or not we are currently in building mode */
    inBuildingMode: boolean;

    constructor() {
        super('Hud');

        //needs to be instantiated before use
        this.portraitSprites = {};
        this.inBuildingMode = false;

        //events to listen for
        this.globalEmitter = EventGlobals.getInstance();
        this.globalEmitter.on("addPortrait",this.addPortraitSprite, this)
        this.globalEmitter.on("changePortrait", this.changePortraitSprite, this);

        this.characterSheet = new CharacterSheet(this);
    }

    create() {
        // Create a game console
        let con = new Console(this);
        con.rewireAll();

        //create character frame
        this.characterFrame = this.add.sprite(0, 0, "characterFrame").setOrigin(0, 0);
        this.characterFrame.setScale(2);
        this.characterFrame.setDepth(1);
        
        //create our character sheet
        this.characterSheet.createToggleButton(95,52);
        this.characterSheet.createCharacterSheet();

        //create the building menu and toggle button
        this.buildingToggleButton = this.add.sprite(130,52,"hammerIcon");
        this.buildingToggleButton.setScale(2);
        this.buildingToggleButton.setDepth(2);
        this.buildingToggleButton.setInteractive();
        this.buildingToggleButton.on("pointerdown", () => {
            if(this.inBuildingMode){
                this.exitBuildMode();
            } else {
                this.enterBuildMode();
            }
            console.log(this.inBuildingMode);
        })
    }

    /**Makes any changes that need to be made when entering building mode */
    enterBuildMode(){
        //set that we are now in building mode
        this.inBuildingMode = true;
    }

    /**Makes any changes that need to be made when entering building mode */
    exitBuildMode(){
        //set that we are no longer in building mode
        this.inBuildingMode = false;
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
        console.log(this.portraitSprites);
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