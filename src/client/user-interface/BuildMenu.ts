import { Hud } from "../scenes/overlays/Hud";
import { GAME_WIDTH } from "../tools/Globals";
import { SignalManager } from "../services/SignalManager";

export class BuildMenu {

    /**The hud scene of which this menu exits in */
    private hud: Hud;

    //HTML Elements
    /** A div that holds the entire menu */
    private menuDiv: HTMLDivElement;
    /**Refernce to the Phaser dom used here */
    private dom: Phaser.GameObjects.DOMElement;
    /**This holds the information used to contruct the list 
     * items in the main div element */
    private tiles: tiledata[]; 
    /**Tells us if the menu is currently visible */
    public visible: boolean;
    /**Used to hold what tile us currently selected */
    public currentTile: tiledata;
    
    //Global Emitter
    private emitter: SignalManager;

    /**Sprite used to toggle one and off the building menu */
    buildingToggleButton: Phaser.GameObjects.Sprite;

    //boolean
    /**Tells weather or not we are currently in building mode */
    inBuildingMode: boolean;

    //sprites
    /**This button is used to turn the block to be place 90 towards the right */
    flipRightButton: Phaser.GameObjects.Sprite;
    /**This button is used to turn the block to be place 90 towards the left */
    flipLeftButton: Phaser.GameObjects.Sprite;
    /**Used to select the build tool*/
    hammerButton: Phaser.GameObjects.Sprite;
    /**Used to select the destroy tool */
    pickButton: Phaser.GameObjects.Sprite;

    //string
    /**Tells us what tool us currently selected */
    toolSelected: string;

    //numbers
    /**Handles the depth of non html elements (html elements can't use
     * phaser's internal depth manager and always either apear on top
     * or under the canvas) */
    depth: number;

    private constructor(hud: Hud) {
        //inital values
        this.visible = false;
        this.hud = hud;
        this.importTiles();
        this.emitter = SignalManager.get();
        this.toolSelected = "hammer";
        this.depth = 0;
        //create div
        this.menuDiv = document.createElement("div");
        this.menuDiv.style.width = '256px';
        this.menuDiv.style.height = '684px';
        this.menuDiv.style.padding = "0px";
        this.menuDiv.style.backgroundImage = "url('./assets/images/user-interface/wooden_Background.png')";
        this.menuDiv.style.backgroundAttachment = "local";
        this.menuDiv.style.borderStyle = "solid";
        this.menuDiv.style.borderColor = "#915b20";
        this.menuDiv.style.borderWidth = "6px";
        this.menuDiv.style.overflowY = "auto";
        //create list
        let list = document.createElement("ul");
        list.style.listStyle = "none";
        list.style.padding = "0px";
        list.style.margin = "3px";
        //populate list
        for (let i = 0; i < 8; i++) {
            // List item object, contains details for each block
            let item = document.createElement('li');
            item.style.display = "flex";
            item.style.alignItems = "center";
            item.className = "tileDesc";
            item.style.margin = "0px";
            item.style.padding = "0px";
            // Image of the block
            let image = document.createElement('img');
            image.style.width = "64px";
            image.style.display = "inline-block";
            image.style.margin = "0px";
            image.style.padding = "0px";
            // Image data passed in a base 64 string
            image.src = this.hud.textures.getBase64('testBuildSpriteSheetTable', i % 8);
            // Side text is a list within the list (so it's elements can be top->bottom)
            let textsList = document.createElement('ul');
            textsList.style.display = "inline-block";
            textsList.style.maxWidth = "128px";
            textsList.style.listStyle = "none";
            textsList.style.padding = "0px";
            textsList.style.margin = "0px 0px 10px 10px";
            textsList.style.verticalAlign = "center";
            textsList.style.lineHeight = "1.2";
            textsList.innerHTML = `<li>${this.tiles[i].name}</li>`;
            textsList.innerHTML += `<li>${this.tiles[i].count}</li>`;
            // Append item elements to list
            item.appendChild(image);
            item.appendChild(textsList);
            list.appendChild(item);
            // Assign a callback to clicking on the item
            item.onclick = () => {
                console.log(this.tiles[i]);
                this.emitter.emit("newTileSelected",this.tiles[i]);
            }
            this.createBuildButtons(hud);
        }
        // Style the list items
        let styling = document.createElement('style');
        styling.type = "text/css";
        styling.innerHTML = ".tileDesc:nth-child(even) { background: rgba(0,0,0,0.2) }\n";
        styling.innerHTML += "li { color: white }";
        list.appendChild(styling);
        // Combine html elements
        this.menuDiv.appendChild(list);
        this.dom = this.hud.add.dom((GAME_WIDTH - 256) - 10, 18, this.menuDiv);
        this.dom.setDepth(this.depth)
        this.dom.setOrigin(0);
        this.dom.setVisible(false);
    }

    /**Gets an instance of this class, the class is a singleton and as such
     * ther is only one instance, this either creates and returns or just
     * returns that instance based on if there is already an instance
     */
    static get(hud: Hud) {
        //if an instance has not been made yet, create one
        if (instance == null) {
            instance = new BuildMenu(hud);
        }
        //as long as we have an instance, return it
        return instance;
    }

    /**Toggles if the menu is visible or not */
    toggle(show = !this.visible) {
        this.dom.setVisible(show);
        this.flipRightButton.setVisible(show);
        this.flipLeftButton.setVisible(show);
        this.hammerButton.setVisible(show);
        this.pickButton.setVisible(show);

    }

     /**
     * Sets the depth for just the toggle button 
     * @param newDepth The depth to set the toggle button at
     */
    setToggleButtonDepth(newDepth: number){
        this.buildingToggleButton.setDepth(newDepth);
    }

    /**
     * Sets the depth for the whole build menu
     * @param newDepth The depth to set the toggle button at
     */
    setDepth(newDepth: number){
        this.dom.setDepth(newDepth);
        this.pickButton.setDepth(newDepth);
        this.hammerButton.setDepth(newDepth);
        this.flipLeftButton.setDepth(newDepth);
        this.flipRightButton.setDepth(newDepth);
    }

    /**Used to import all the tiles it is possible to use for building */
    importTiles(){
        /*Eventually these will be enumerated in a file but for now it is all
        generated here */
        this.tiles = [];
        for(let i = 0; i < 8; i++){
            this.tiles[i] = {
                tileSetKey: "testBuildSpriteSheet",
                tileSetOffSet: i,
                name: "TestTile",
                count: ((i * 10) % 3) + 1
            }
        }
    }

    /**
     * Chooses a place to place the toggle button on screen and creates it
     * @param hud the current hud to create the button
     * @param buttonX where to place the button on the x plane
     * @param buttonY where to place the button on the y plane
     */
    placeToggleButton(hud: Hud, buttonX: number, buttonY: number){
        if(this.buildingToggleButton){
            this.buildingToggleButton.x = buttonX;
            this.buildingToggleButton.y = buttonY;
        } else {
            //create the building menu and toggle button
            this.buildingToggleButton = hud.add.sprite(buttonX, buttonY, "hammerIcon");
            this.buildingToggleButton.setScale(2);
            this.buildingToggleButton.setInteractive();
            this.buildingToggleButton.on("pointerdown", () => {
                if (this.inBuildingMode) {
                    this.exitBuildMode();
                } else {
                    this.enterBuildMode();
                }
            })
        }
    }

    /**
     * Creates all the buttons in the menu at the top of the screen
     * @param hud the current hud scene to create the button in 
     */
    createBuildButtons(hud: Hud){
        //create flip right button
        this.flipRightButton = hud.add.sprite(350,52,"flipRightIcon");
        this.flipRightButton.setDepth(this.depth);
        this.flipRightButton.setVisible(false);
        this.flipRightButton.setInteractive();
        /*here we use the controls action key as if the button had been pressed, this
        means less code in the end and accomplishes the same thing */
        this.flipRightButton.on("pointerdown", () => {
            this.emitter.emit("rotate block right-down")
        });

        //create flip left button
        this.flipLeftButton = hud.add.sprite(300,52,"flipLeftIcon");
        this.flipLeftButton.setDepth(this.depth);
        this.flipLeftButton.setVisible(false);
        this.flipLeftButton.setInteractive();
        /*here we use the controls action key as if the button had been pressed, this
        means less code in the end and accomplishes the same thing */
        this.flipLeftButton.on("pointerdown", () => {
            this.emitter.emit("rotate block left-down")
        });

        //create hammer button
        this.hammerButton = hud.add.sprite(400,52,"hammerIcon");
        this.hammerButton.setDepth(this.depth);
        this.hammerButton.setScale(2);
        this.hammerButton.setVisible(false);
        this.hammerButton.setInteractive()
        this.hammerButton.on("pointerdown", () => {
            this.toolSelected = "hammer";
            this.hammerButton.setTexture("hammerIcon",1);
            this.pickButton.setTexture("pickIcon", 0);
            this.emitter.emit("buildMenuHammerSelected");
        })

        //create pick button
        this.pickButton = hud.add.sprite(450,52,"pickIcon",0);
        this.pickButton.setDepth(this.depth);
        this.pickButton.setScale(2);
        this.pickButton.setVisible(false);
        this.pickButton.setInteractive()
        this.pickButton.on("pointerdown", () => {
            this.toolSelected = "pick";
            this.hammerButton.setTexture("hammerIcon",0);
            this.pickButton.setTexture("pickIcon", 1);
            this.emitter.emit("buildMenuPickSelected");
        })
    }

    /**Makes any changes that need to be made when entering building mode */
    enterBuildMode() {
        //set that we are now in building mode
        this.inBuildingMode = true;
        this.toggle(true);
        //emit that we have entered build mode
        this.emitter.emit("enterBuildMode");
    }

    /**Makes any changes that need to be made when entering building mode */
    exitBuildMode() {
        //set that we are no longer in building mode
        this.inBuildingMode = false;
        this.toggle(false);
        //emit that we are no longer in build mode
        this.emitter.emit("exitBuildMode");
    }

}

/**This is the varible used to store our one instance of our singlton class, this
 * is a module level variable and cannot be seen by other scripts.
 */
let instance: BuildMenu = null;

export interface tiledata {
    tileSetKey: string,
    tileSetOffSet: number,
    name: string,
    count: number
}