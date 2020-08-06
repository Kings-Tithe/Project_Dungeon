import { Console } from "../../user-interface/Console";
import { BuildMenu } from "../../user-interface/BuildMenu";
import { hookToMethod } from "../../tools/Hook";
import { SignalManager } from "../../services/SignalManager";
import { CharacterSheet } from "../../user-interface/CharacterSheet";
import { Controls } from "../../services/Controls";
import { GAME_WIDTH, GAME_HEIGHT, CENTER } from "../../tools/Globals";

/*
Depth Table
Depth   | Object/Tile
----------------------------------
101     | Pause Text
100     | Pause Fog
5       | (All Toggle Buttons)
4       | Build Menu
3       | Character Frame
2       | Character Portrait
1       | Character Sheet
----------------------------------
*/

/**
 * Hud scene that should display over the main game screen. Contains various
 * interactable elements and information for the player.
 */
export class Hud extends Phaser.Scene {

    //Memeber Varibles

    //sprites
    /**Sprite frame at the top of the screen that other ui element's toggle
     * buttons sit on top of */
    characterFrame: Phaser.GameObjects.Sprite;
    /**The currently being shown portrait */
    portrait: Phaser.GameObjects.Sprite;

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
    pauseText: Phaser.GameObjects.Text;

    //controls
    controls: Controls;
    
    buildMenu: BuildMenu;

    constructor() {
        super('Hud');

        //needs to be instantiated before use
        this.inBuildingMode = false;
        this.paused = false;
        this.pausedScenes = [];
        this.controls = Controls.getInstance();

        //events to listen for
        this.signals = SignalManager.get();
        this.addListeners();

        this.characterSheet = new CharacterSheet(this);
    }

    create() {
        // Create a game console
        let con = Console.get(this);
        // Create a buidling menu ui element
        this.buildMenu = BuildMenu.get(this);
        this.buildMenu.setDepth(4);
        this.buildMenu.placeToggleButton(this,130,52);
        this.buildMenu.setToggleButtonDepth(5);

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
        this.characterFrame.setDepth(3);

        //create our character sheet
        this.characterSheet.createCharacterSheet();
        this.characterSheet.setDepth(1);
        this.characterSheet.createToggleButton(95, 52);
        this.characterSheet.setToggleButtonDepth(5); 

        //create pause fog
        this.pauseFog = this.add.graphics();
        this.pauseFog.fillStyle(0x19abb5,.4);
        this.pauseFog.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
        this.pauseFog.visible = false;
        this.pauseFog.setDepth(100);

        //create pausedText
        this.pauseText = this.add.text(CENTER.x, CENTER.y - 200, "Paused", {
            fontSize: "40px",
            color: "#4aff26"
        });
        this.pauseText.setOrigin(.5,.5);
        this.pauseText.visible = false;
        this.pauseText.setDepth(101);
    }

    /**Used to change what portrait is currently being shown */
    changePortraitSprite(spritekey) {
        if(!this.portrait){
            this.portrait = this.add.sprite(10, 12, spritekey)
            this.portrait.setOrigin(0, 0);
            this.portrait.setScale(1.3);
            this.portrait.setDepth(2);
        } else {
            this.portrait.setTexture(spritekey);
        }
    }

    addListeners(){
        this.signals.on("changePortrait", this.changePortraitSprite, this);
        this.signals.on("pause-down", () => {
            if(this.paused){
                this.pauseFog.visible = false;
                this.pauseText.visible = false;
                if(this.buildMenu.visible){
                    this.buildMenu.dom.setVisible(true);
                }
                for(let i = 0; i < this.pausedScenes.length; i++){
                    this.scene.resume(this.pausedScenes[i]);
                }
                this.paused = false;
            } else {
                this.paused = true;
                this.pauseFog.visible = true;
                this.pauseText.visible = true;
                console.log(this.buildMenu.visible)
                if(this.buildMenu.visible){
                    this.buildMenu.dom.setVisible(false);
                }
            }
        })
        this.signals.on("pausing", (incomingScene: string) => {
            this.pausedScenes.push(incomingScene);
        })
    }

}