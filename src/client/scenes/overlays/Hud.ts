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
    /**The outline of a man used in the character sheet */
    characterSheetMan: Phaser.GameObjects.Sprite;

    //strings
    /**Stores the spritekey of the currently in use character portrait */
    currentPortrait: string;

    //graphics
    /**This is the backdrop for the character sheet */
    characterSheetBackground: Phaser.GameObjects.Graphics;
    characterSheetFocusBlock: Phaser.GameObjects.Graphics;
    characterSheetEnduranceBlock: Phaser.GameObjects.Graphics;
    characterSheetSpeedBlock: Phaser.GameObjects.Graphics;
    characterSheetMightBlock: Phaser.GameObjects.Graphics;
    

    //text
    characterSheetName: Phaser.GameObjects.Text;
    characterSheetLevel: Phaser.GameObjects.Text;
    characterSheetEXP: Phaser.GameObjects.Text;
    characterSheetFocusLabel: Phaser.GameObjects.Text;
    characterSheetEnduranceLabel: Phaser.GameObjects.Text;
    characterSheetSpeedLabel: Phaser.GameObjects.Text;
    characterSheetMightLebel: Phaser.GameObjects.Text;
    characterSheetFocusText: Phaser.GameObjects.Text;
    characterSheetEnduranceText: Phaser.GameObjects.Text;
    characterSheetSpeedText: Phaser.GameObjects.Text;
    characterSheetMightText: Phaser.GameObjects.Text;
    characterSheetLifeText: Phaser.GameObjects.Text;
    characterSheetEnergyText: Phaser.GameObjects.Text;
    characterSheetBattleSpeedText: Phaser.GameObjects.Text;

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
            fontSize: "20px",
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
        this.characterSheetFocusLabel = this.add.text(490,215,"Focus:",textConfig);
        this.characterSheetFocusLabel.setOrigin(.5,.5);
        this.characterSheetFocusLabel.setScale(0);
        this.characterSheetFocusLabel.setFontSize(16);
        this.characterSheetEnduranceLabel = this.add.text(590,215,"Endurance:",textConfig);
        this.characterSheetEnduranceLabel.setOrigin(.5,.5);
        this.characterSheetEnduranceLabel.setScale(0);
        this.characterSheetEnduranceLabel.setFontSize(16);
        this.characterSheetSpeedLabel = this.add.text(690,215,"Speed:",textConfig);
        this.characterSheetSpeedLabel.setOrigin(.5,.5);
        this.characterSheetSpeedLabel.setScale(0);
        this.characterSheetSpeedLabel.setFontSize(16);
        this.characterSheetMightLebel = this.add.text(790,215,"Might:",textConfig);
        this.characterSheetMightLebel.setOrigin(.5,.5);
        this.characterSheetMightLebel.setScale(0);
        this.characterSheetMightLebel.setFontSize(16);
        //add blocks for stats
        this.characterSheetFocusBlock = this.add.graphics();
        this.characterSheetFocusBlock.fillStyle(0x915b20,1);
        this.characterSheetFocusBlock.lineStyle(15,0x784b1a,1)
        this.characterSheetFocusBlock.strokeRoundedRect(460, 235, 60, 60,10)
        this.characterSheetFocusBlock.fillRoundedRect(460, 235, 60, 60,10);
        this.characterSheetFocusBlock.setScale(0);
        this.characterSheetEnduranceBlock = this.add.graphics();
        this.characterSheetEnduranceBlock.fillStyle(0x915b20,1);
        this.characterSheetEnduranceBlock.lineStyle(15,0x784b1a,1)
        this.characterSheetEnduranceBlock.strokeRoundedRect(560, 235, 60, 60,10)
        this.characterSheetEnduranceBlock.fillRoundedRect(560, 235, 60, 60,10);
        this.characterSheetEnduranceBlock.setScale(0);
        this.characterSheetSpeedBlock = this.add.graphics();
        this.characterSheetSpeedBlock.fillStyle(0x915b20,1);
        this.characterSheetSpeedBlock.lineStyle(15,0x784b1a,1)
        this.characterSheetSpeedBlock.strokeRoundedRect(660, 235, 60, 60,10)
        this.characterSheetSpeedBlock.fillRoundedRect(660, 235, 60, 60,10);
        this.characterSheetSpeedBlock.setScale(0);
        this.characterSheetMightBlock = this.add.graphics();
        this.characterSheetMightBlock.fillStyle(0x915b20,1);
        this.characterSheetMightBlock.lineStyle(15,0x784b1a,1)
        this.characterSheetMightBlock.strokeRoundedRect(760, 235, 60, 60,10)
        this.characterSheetMightBlock.fillRoundedRect(760, 235, 60, 60,10);
        this.characterSheetMightBlock.setScale(0);
        //add stat text
        this.characterSheetFocusText = this.add.text(490,265,"10",textConfig);
        this.characterSheetFocusText.setOrigin(.5,.5);
        this.characterSheetFocusText.setScale(0);
        this.characterSheetFocusText.setFontSize(24);
        this.characterSheetFocusText.setColor("white");
        this.characterSheetEnduranceText = this.add.text(590,265,"7",textConfig);
        this.characterSheetEnduranceText.setOrigin(.5,.5);
        this.characterSheetEnduranceText.setScale(0);
        this.characterSheetEnduranceText.setFontSize(24);
        this.characterSheetEnduranceText.setColor("white");
        this.characterSheetSpeedText = this.add.text(690,265,"8",textConfig);
        this.characterSheetSpeedText.setOrigin(.5,.5);
        this.characterSheetSpeedText.setScale(0);
        this.characterSheetSpeedText.setFontSize(24);
        this.characterSheetSpeedText.setColor("white");
        this.characterSheetMightText = this.add.text(790,265,"2",textConfig);
        this.characterSheetMightText.setOrigin(.5,.5);
        this.characterSheetMightText.setScale(0);
        this.characterSheetMightText.setFontSize(24);
        this.characterSheetMightText.setColor("white");
        //indirect stats text
        this.characterSheetLifeText = this.add.text(460,330,"Life: 100",textConfig);
        this.characterSheetLifeText.setOrigin(0,.5);
        this.characterSheetLifeText.setScale(0);
        this.characterSheetLifeText.setFontSize(18);
        this.characterSheetEnergyText = this.add.text(460,355,"Energy: 100",textConfig);
        this.characterSheetEnergyText.setOrigin(0,.5);
        this.characterSheetEnergyText.setScale(0);
        this.characterSheetEnergyText.setFontSize(18);
        this.characterSheetBattleSpeedText = this.add.text(460,380,"Battle Speed: 5",textConfig);
        this.characterSheetBattleSpeedText.setOrigin(0,.5);
        this.characterSheetBattleSpeedText.setScale(0);
        this.characterSheetBattleSpeedText.setFontSize(18);
        //add sprite of the outline of a man
        this.characterSheetMan = this.add.sprite(CENTER.x, 535,"outlineOfMan");
        this.characterSheetMan.setOrigin(.5,.5);
        this.characterSheetMan.setScale(0);
    }

    toggleCharacterSheet(){
        if(this.characterSheetToggleVisible){
            this.characterSheetBackground.setScale(0);
            this.characterSheetPortrait.setScale(0);
            this.characterSheetName.setScale(0);
            this.characterSheetLevel.setScale(0);
            this.characterSheetEXP.setScale(0);
            this.characterSheetFocusLabel.setScale(0);
            this.characterSheetEnduranceLabel.setScale(0);
            this.characterSheetSpeedLabel.setScale(0);
            this.characterSheetMightLebel.setScale(0);
            this.characterSheetFocusBlock.setScale(0);
            this.characterSheetEnduranceBlock.setScale(0);
            this.characterSheetSpeedBlock.setScale(0);
            this.characterSheetMightBlock.setScale(0);
            this.characterSheetFocusText.setScale(0);
            this.characterSheetEnduranceText.setScale(0);
            this.characterSheetSpeedText.setScale(0);
            this.characterSheetMightText.setScale(0);
            this.characterSheetLifeText.setScale(0);
            this.characterSheetEnergyText.setScale(0);
            this.characterSheetBattleSpeedText.setScale(0);
            this.characterSheetMan.setScale(0);
            this.characterSheetToggleVisible = false;
        } else {
            this.characterSheetBackground.setScale(1);
            this.characterSheetPortrait.setScale(2);
            this.characterSheetName.setScale(1);
            this.characterSheetLevel.setScale(1);
            this.characterSheetEXP.setScale(1);
            this.characterSheetFocusLabel.setScale(1);
            this.characterSheetEnduranceLabel.setScale(1);
            this.characterSheetSpeedLabel.setScale(1);
            this.characterSheetMightLebel.setScale(1);
            this.characterSheetFocusBlock.setScale(1);
            this.characterSheetEnduranceBlock.setScale(1);
            this.characterSheetSpeedBlock.setScale(1);
            this.characterSheetMightBlock.setScale(1);
            this.characterSheetFocusText.setScale(1);
            this.characterSheetEnduranceText.setScale(1);
            this.characterSheetSpeedText.setScale(1);
            this.characterSheetMightText.setScale(1);
            this.characterSheetLifeText.setScale(1);
            this.characterSheetEnergyText.setScale(1);
            this.characterSheetBattleSpeedText.setScale(1);
            this.characterSheetMan.setScale(1);
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