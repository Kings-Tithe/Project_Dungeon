import { Console } from "../../tools/Console";
import { EventGlobals } from "../../tools/EventGlobals";
import { CENTER } from "../../tools/Globals";

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
    /**Button used to toggle the character sheet */
    characterSheetButton: Phaser.GameObjects.Sprite;
    /**The portrait used in the character sheet */
    characterSheetPortrait: Phaser.GameObjects.Sprite;

    //strings
    /**Stores the spritekey of the currently in use character portrait */
    currentPortrait: string;

    //graphics
    /**This is the backdrop for the character sheet */
    characterSheetBackground: Phaser.GameObjects.Graphics;

    //text
    characterSheetName: Phaser.GameObjects.Text;
    characterSheetLevel: Phaser.GameObjects.Text;
    characterSheetEXP: Phaser.GameObjects.Text;
    characterSheetFocusLabel: Phaser.GameObjects.Text;
    characterSheetEnduranceLabel: Phaser.GameObjects.Text;
    characterSheetSpeedLabel: Phaser.GameObjects.Text;
    characterSheetMightLebel: Phaser.GameObjects.Text;

    //boolean
    /**This keep track of if the character sheet is currently visible */
    characterSheetToggleVisible: boolean;

    //GlobalEmitter
    /**Stores a refernce to the global event emitter */
    globalEmitter: EventGlobals;

    constructor() {
        super('Hud');

        //needs to be instantiated before use
        this.portraitSprites = {};

        //events to listen for
        this.globalEmitter = EventGlobals.getInstance();
        this.globalEmitter.on("addPortrait",this.addPortraitSprite, this)
        this.globalEmitter.on("changePortrait", this.changePortraitSprite, this);

        //inital values
        this.characterSheetToggleVisible = false;
    }

    create() {
        // Create a game console
        let con = new Console(this);
        con.rewireAll();

        //create character frame
        this.characterFrame = this.add.sprite(0, 0, "characterFrame").setOrigin(0, 0);
        this.characterFrame.setScale(2);
        this.characterFrame.setDepth(1); 

        this.createCharacterSheetButton();
        this.createCharacterSheet();
    }

    createCharacterSheetButton(){
        this.characterSheetButton = this.add.sprite(95,52,"bookIcon");
        this.characterSheetButton.setDepth(2);
        this.characterSheetButton.setScale(.8);
        this.characterSheetButton.setInteractive();
        this.characterSheetButton.on("pointerdown", this.toggleCharacterSheet, this);
    }

    createCharacterSheet(){
        //create background
        this.characterSheetBackground = this.add.graphics();
        this.characterSheetBackground.fillStyle(0xb06e27,1);
        this.characterSheetBackground.lineStyle(20,0x915b20,1)
        this.characterSheetBackground.strokeRoundedRect(CENTER.x - 200, CENTER.y - 300, 400, 600,20)
        this.characterSheetBackground.fillRoundedRect(CENTER.x - 200, CENTER.y - 300, 400, 600,20);
        this.characterSheetBackground.setScale(0);
        //create portrait
        this.characterSheetPortrait = this.add.sprite(CENTER.x - 180, CENTER.y - 280,"gregThePortrait");
        this.characterSheetPortrait.setOrigin(0);
        this.characterSheetPortrait.setScale(0);
        //create text config
        let textConfig = {
            fontSize: "22px",
            color: "#000000",
            fontFamily: 'Courier'
        }
        //create portrait side text
        this.characterSheetName = this.add.text(570,100,"Greg the Test Dummy",textConfig);
        this.characterSheetName.setOrigin(0,.5);
        this.characterSheetName.setScale(0);
        this.characterSheetLevel = this.add.text(570,125,"Level: 5",textConfig);
        this.characterSheetLevel.setOrigin(0,.5);
        this.characterSheetLevel.setScale(0);
        this.characterSheetEXP = this.add.text(570,150,"EXP: 3,486",textConfig);
        this.characterSheetEXP.setOrigin(0,.5);
        this.characterSheetEXP.setScale(0);
        //create stats labels
        this.characterSheetFocusLabel = this.add.text(450,215,"Focus:",textConfig);
        this.characterSheetFocusLabel.setOrigin(.5,.5);
        this.characterSheetFocusLabel.setScale(1);
        this.characterSheetFocusLabel.setFontSize(16);
        this.characterSheetEnduranceLabel = this.add.text(525,215,"Endurance:",textConfig);
        this.characterSheetEnduranceLabel.setOrigin(.5,.5);
        this.characterSheetEnduranceLabel.setScale(1);
        this.characterSheetEnduranceLabel.setFontSize(16);
        this.characterSheetSpeedLabel = this.add.text(650,215,"Speed:",textConfig);
        this.characterSheetSpeedLabel.setOrigin(.5,.5);
        this.characterSheetSpeedLabel.setScale(1);
        this.characterSheetSpeedLabel.setFontSize(16);
        this.characterSheetMightLebel = this.add.text(750,215,"Might:",textConfig);
        this.characterSheetMightLebel.setOrigin(.5,.5);
        this.characterSheetMightLebel.setScale(1);
        this.characterSheetMightLebel.setFontSize(16);
    }

    toggleCharacterSheet(){
        if(this.characterSheetToggleVisible){
            this.characterSheetBackground.setScale(0);
            this.characterSheetPortrait.setScale(0);
            this.characterSheetName.setScale(0);
            this.characterSheetLevel.setScale(0);
            this.characterSheetEXP.setScale(0);
            this.characterSheetToggleVisible = false;
        } else {
            this.characterSheetBackground.setScale(1);
            this.characterSheetPortrait.setScale(2);
            this.characterSheetName.setScale(1);
            this.characterSheetLevel.setScale(1);
            this.characterSheetEXP.setScale(1);
            this.characterSheetToggleVisible = true;
        }
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