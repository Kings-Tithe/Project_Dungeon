import { Hud } from "../scenes/overlays/Hud";
import { GAME_WIDTH } from "../tools/Globals";
import { SignalManager } from "../services/SignalManager";


export class BuildMenu {

    /**The hud scene of which this menu exits in */
    private hud: Hud;

    //HTML Elements
    /** A div that holds the entire menu */
    private menuDiv: HTMLDivElement;
    /**A border that goes around the main div */
    private borderDiv: HTMLDivElement;
    /**Refernce to the Phaser dom used here */
    public MenuDom: Phaser.GameObjects.DOMElement;
    /**Refernce to the Phaser dom used here */
    public borderDom: Phaser.GameObjects.DOMElement;
    /**Used to hold the lists for the 4 layers */
    private floorList;
    private wallList;
    private roofList;
    private specialList;
    /**Used to hold what tile us currently selected */
    public currentSelectedItem: HTMLLIElement;

    //Global Emitter
    private emitter: SignalManager;

    /**Sprite used to toggle one and off the building menu */
    buildingToggleButton: Phaser.GameObjects.Sprite;

    //tiledata
    /**This holds the information used to contruct the list 
     * items in the main div element */
    private tiles: tiledata[];


    //boolean
    /**Tells weather or not we are currently in building mode */
    inBuildingMode: boolean;
    /**Tells us if the menu is currently visible */
    public visible: boolean;

    //sprites
    /**This button is used to turn the block to be place 90 towards the right */
    flipRightButton: Phaser.GameObjects.Sprite;
    /**This button is used to turn the block to be place 90 towards the left */
    flipLeftButton: Phaser.GameObjects.Sprite;
    /**Used to select the build tool*/
    hammerButton: Phaser.GameObjects.Sprite;
    /**Used to select the destroy tool */
    pickButton: Phaser.GameObjects.Sprite;
    /**Used to select the floor layer */
    floorButton: Phaser.GameObjects.Sprite;
    /**Used to select the wall layer */
    wallButton: Phaser.GameObjects.Sprite;
    /**Used to select the roof layer */
    roofButton: Phaser.GameObjects.Sprite;
    /**Used to select the special object layer */
    specialObjectButton: Phaser.GameObjects.Sprite;

    //string
    /**Tells us what tool us currently selected */
    toolSelected: string;
    /**Tells us what layer is currently selected */
    layerSelected: string;

    //graghics
    /**Used as a back drop to the build menus buttons */
    buttonBackdrop: Phaser.GameObjects.Graphics;

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
        this.toolSelected = "";
        this.layerSelected = "";
        this.depth = 0;
        //create the actual clickable side menu
        this.createMainDiv();
        this.createLists();
        this.clearLists();
        // adds the 4 lists to the div element
        this.menuDiv.appendChild(this.floorList);
        this.menuDiv.appendChild(this.wallList);
        this.menuDiv.appendChild(this.roofList);
        this.menuDiv.appendChild(this.specialList);
        //create dom and add the main div
        this.borderDom = this.hud.add.dom(0,0,this.borderDiv);
        this.borderDom.setDepth(this.depth)
        this.borderDom.setOrigin(0);
        this.borderDom.setVisible(false);
        this.MenuDom = this.hud.add.dom(0,0,this.menuDiv);
        this.MenuDom.setDepth(this.depth + 1)
        this.MenuDom.setOrigin(0);
        this.MenuDom.setVisible(false);
        //create and set small top screen buttons
        this.createBuildButtons(hud);

        //select default layer: floor
        this.clearLayerSelect(false);
        this.clearLists();
        this.floorList.style.display = "block";
        this.layerSelected = "floor";
        this.floorButton.setTexture("floorIcon", 1);
        this.emitter.emit("buildingLayerChanged", this.layerSelected);
        //select default tool: hammer
        this.clearToolSelect();
        this.toolSelected = "hammer";
        this.hammerButton.setTexture("hammerIcon", 1);
        this.emitter.emit("buildMenuHammerSelected");
    }

    /**Gets an instance of this class, the class is a singleton and as such
     * there is only one instance, this either creates and returns or just
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

    /**Create the main dic that contains the rest of the menu */
    createMainDiv() {
        //create div
        this.menuDiv = document.createElement("div");
        this.menuDiv.style.width = '256px';
        this.menuDiv.style.height = '684px';
        this.menuDiv.style.padding = "0px";
        this.menuDiv.style.margin = "0px";
        this.menuDiv.style.backgroundImage = "url('./assets/images/user-interface/wooden_Background.png')";
        this.menuDiv.style.backgroundAttachment = "local";
        this.menuDiv.style.position = "absolute";
        this.menuDiv.style.top = "18px";
        this.menuDiv.style.left = (GAME_WIDTH-256-18).toString() + "px";
        this.menuDiv.style.zIndex = "0";
        this.menuDiv.style.borderStyle = "solid";
        this.menuDiv.style.borderColor = "#915b20";
        this.menuDiv.style.borderWidth = "8px";
        this.menuDiv.style.borderRadius = "30px";
        this.menuDiv.style.border
        this.menuDiv.style.overflowY = "auto";
        this.menuDiv.style.float = "left";
        this.menuDiv.id = "mainDiv";

        //create border div
        this.borderDiv = document.createElement("div");
        this.borderDiv.style.width = '256px';
        this.borderDiv.style.height = '684px';
        this.borderDiv.style.backgroundColor = "#915b20";
        this.borderDiv.style.position = "absolute";
        this.borderDiv.style.top = "18px";
        this.borderDiv.style.left = (GAME_WIDTH-256-18).toString() + "px";
        this.borderDiv.style.zIndex = "1";
        this.borderDiv.style.borderStyle = "solid";
        this.borderDiv.style.borderColor = "#915b20";
        this.borderDiv.style.borderWidth = "10px";
        this.borderDiv.style.borderRadius = "30px";

        let style = document.createElement("style");
        style.innerHTML = "#mainDiv::-webkit-scrollbar {width: 8px;}";
        style.innerHTML += "#mainDiv::-webkit-scrollbar-track {background: #915b20;}";
        style.innerHTML += "#mainDiv::-webkit-scrollbar-thumb {background: #80511d;}";
        style.innerHTML += "#mainDiv::-webkit-scrollbar-thumb:hover {background: #b87328;}";
        this.menuDiv.appendChild(style);
    }

    /**Used to fill the layers lists with tiles from this.tiles */
    createLists() {
        //create floor list
        this.floorList = document.createElement("ul");
        this.floorList.style.listStyle = "none";
        this.floorList.style.padding = "0px";
        this.floorList.style.margin = "3px";
        //populate list
        for (let i = 0; i < 1; i++) {
            let newItem = this.createListItem(this.tiles[i]);
            this.floorList.appendChild(newItem);
        }

        //create Wall list
        this.wallList = document.createElement("ul");
        this.wallList.style.listStyle = "none";
        this.wallList.style.padding = "0px";
        this.wallList.style.margin = "3px";
        //populate list
        for (let i = 1; i < 8; i++) {
            let newItem = this.createListItem(this.tiles[i % 8]);
            this.wallList.appendChild(newItem);
        }

        //create roof list
        this.roofList = document.createElement("ul");
        this.roofList.style.listStyle = "none";
        this.roofList.style.padding = "0px";
        this.roofList.style.margin = "3px";
        //currently no tiles to populate with

        //create roof list
        this.specialList = document.createElement("ul");
        this.specialList.style.listStyle = "none";
        this.specialList.style.padding = "0px";
        this.specialList.style.margin = "3px";
        //currently no tiles to populate with

        // Style the list items, this creates the back and forth color pattern on the lists
        let styling = document.createElement('style');
        styling.type = "text/css";
        styling.innerHTML = ".tileDesc:nth-child(even) { background: rgba(0,0,0,0.2) }\n";
        styling.innerHTML += "li { color: white }";
        this.floorList.appendChild(styling);
        this.wallList.appendChild(styling);
        this.roofList.appendChild(styling);
        this.specialList.appendChild(styling);
    }

    /**
     * Create a new list item to be put in a layers list
     * @param tile the tile data to construct the item from
     * @returns the newly constructed item
     */
    createListItem(tile: tiledata): HTMLLIElement {
        // List item object, contains details for each block
        let item = document.createElement('li');
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.className = "tileDesc";
        item.style.marginBottom = "5px";
        item.style.padding = "0px";
        item.style.borderColor = "yellow";
        // Image of the block
        let image = document.createElement('img');
        image.style.width = "64px";
        image.style.display = "inline-block";
        image.style.margin = "0px";
        image.style.padding = "0px";
        /*make the images not draggable method suggested on stack overflow
        had to prevent this because it caused an infinite build on the mouse */
        image.ondragstart = () => { return false; };
        // Image data passed in a base 64 string
        image.src = this.hud.textures.getBase64('testBuildSpriteSheetTable', tile.tileSetOffSet);
        // Side text is a list within the list (so it's elements can be top->bottom)
        let textsList = document.createElement('ul');
        textsList.style.display = "inline-block";
        textsList.style.maxWidth = "128px";
        textsList.style.listStyle = "none";
        textsList.style.padding = "0px";
        textsList.style.margin = "0px 0px 10px 10px";
        textsList.style.verticalAlign = "center";
        textsList.style.lineHeight = "1.2";
        textsList.innerHTML = `<li>${tile.name}</li>`;
        textsList.innerHTML += `<li>${tile.count}</li>`;
        // Assign a callback to clicking on the item
        item.onclick = () => {
            this.swapItemSelection(item);
            this.emitter.emit("newTileSelected", tile);
        }
        // Append item elements to list
        item.appendChild(image);
        item.appendChild(textsList);
        //return the created item
        return item;
    }

    /**
     * Creates all the buttons in the menu at the top of the screen
     * @param hud the current hud scene to create the button in 
     */
    createBuildButtons(hud: Hud) {
        //create the background for the build buttons
        this.buttonBackdrop = this.hud.add.graphics();
        this.buttonBackdrop.fillStyle(0xb06e27, 1);
        this.buttonBackdrop.lineStyle(20, 0x915b20, 1)
        this.buttonBackdrop.strokeRoundedRect(270, 25, 300, 75, 20)
        this.buttonBackdrop.fillRoundedRect(270, 25, 300, 75, 20);
        this.buttonBackdrop.setVisible(false);

        //create flip left button
        this.flipLeftButton = hud.add.sprite(300, 65, "flipLeftIcon");
        this.flipLeftButton.setDepth(this.depth);
        this.flipLeftButton.setVisible(false);
        this.flipLeftButton.setInteractive();
        /*here we use the controls action key as if the button had been pressed, this
        means less code in the end and accomplishes the same thing */
        this.flipLeftButton.on("pointerdown", () => {
            this.emitter.emit("rotate block left-down")
        });

        //create flip right button
        this.flipRightButton = hud.add.sprite(350, 65, "flipRightIcon");
        this.flipRightButton.setDepth(this.depth);
        this.flipRightButton.setVisible(false);
        this.flipRightButton.setInteractive();
        /*here we use the controls action key as if the button had been pressed, this
        means less code in the end and accomplishes the same thing */
        this.flipRightButton.on("pointerdown", () => {
            this.emitter.emit("rotate block right-down")
        });

        //create hammer button
        this.hammerButton = hud.add.sprite(400, 65, "hammerIcon");
        this.hammerButton.setDepth(this.depth);
        this.hammerButton.setScale(2);
        this.hammerButton.setVisible(false);
        this.hammerButton.setInteractive()
        this.hammerButton.on("pointerdown", () => {
            this.clearToolSelect();
            this.toolSelected = "hammer";
            this.hammerButton.setTexture("hammerIcon", 1);
            this.emitter.emit("buildMenuHammerSelected");
        })

        //create pick button
        this.pickButton = hud.add.sprite(450, 65, "pickIcon", 0);
        this.pickButton.setDepth(this.depth);
        this.pickButton.setScale(2);
        this.pickButton.setVisible(false);
        this.pickButton.setInteractive()
        this.pickButton.on("pointerdown", () => {
            this.clearToolSelect();
            this.toolSelected = "pick";
            this.pickButton.setTexture("pickIcon", 1);
            this.emitter.emit("buildMenuPickSelected");
        })

        //create the layer selection keys
        //create floor button
        this.floorButton = hud.add.sprite(500, 93, "floorIcon");
        this.floorButton.setDepth(this.depth);
        this.floorButton.setScale(.75);
        this.floorButton.setVisible(false);
        this.floorButton.setInteractive()
        this.floorButton.on("pointerdown", () => {
            if (this.layerSelected != "floor"){
                this.clearLayerSelect(false);
                this.clearLists();
                this.floorList.style.display = "block";
                this.layerSelected = "floor";
                this.floorButton.setTexture("floorIcon", 1);
                this.emitter.emit("buildingLayerChanged", this.layerSelected);
            }
        })
        //create wall button
        this.wallButton = hud.add.sprite(500, 74, "wallIcon");
        this.wallButton.setDepth(this.depth);
        this.wallButton.setScale(.75);
        this.wallButton.setVisible(false);
        this.wallButton.setInteractive()
        this.wallButton.on("pointerdown", () => {
            if (this.layerSelected != "wall"){
                this.clearLayerSelect(false);
                this.clearLists();
                this.wallList.style.display = "block";
                this.layerSelected = "wall";
                this.wallButton.setTexture("wallIcon", 1);
                this.emitter.emit("buildingLayerChanged", this.layerSelected);   
            }
        })
        //create roof button
        this.roofButton = hud.add.sprite(500, 44, "roofIcon");
        this.roofButton.setDepth(this.depth);
        this.roofButton.setScale(.75);
        this.roofButton.setVisible(false);
        this.roofButton.setInteractive()
        this.roofButton.on("pointerdown", () => {
            if (this.layerSelected != "roof"){
                this.clearLayerSelect(false);
                this.clearLists();
                this.roofList.style.display = "block";
                this.layerSelected = "roof";
                this.roofButton.setTexture("roofIcon", 1);
                this.emitter.emit("buildingLayerChanged", this.layerSelected);
            }
        })
        //create special Object button
        this.specialObjectButton = hud.add.sprite(543, 73, "doorIcon");
        this.specialObjectButton.setDepth(this.depth);
        this.specialObjectButton.setScale(1);
        this.specialObjectButton.setVisible(false);
        this.specialObjectButton.setInteractive()
        this.specialObjectButton.on("pointerdown", () => {
            if (this.layerSelected != "special"){
                this.clearLayerSelect(false);
                this.clearLists();
                this.specialList.style.display = "block";
                this.layerSelected = "special";
                this.specialObjectButton.setTexture("doorIcon", 1);
                this.emitter.emit("buildingLayerChanged", this.layerSelected);   
            }
        })
    }

    /**
     * Chooses a place to place the toggle button on screen and creates it
     * if it has not already been created
     * @param hud the current hud to create the button
     * @param buttonX where to place the button on the x plane
     * @param buttonY where to place the button on the y plane
     */
    placeToggleButton(hud: Hud, buttonX: number, buttonY: number) {
        if (this.buildingToggleButton) {
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
     * swaps the selection border on the currently selected item and a newly
     * selected item
     * @param newItem The new item to add the border to 
     */
    swapItemSelection(newItem: HTMLLIElement) {
        if (this.currentSelectedItem) {
            this.currentSelectedItem.style.borderStyle = "none";
        }
        this.currentSelectedItem = newItem;
        this.currentSelectedItem.style.borderStyle = "solid";
    }

    /**Used to import all the tiles it is possible to use for building */
    importTiles() {
        /*Eventually these will be enumerated in a file but for now it is all
        generated here */
        this.tiles = [];
        for (let i = 0; i < 8; i++) {
            this.tiles[i] = {
                tileSetKey: "testBuildSpriteSheet",
                tileSetOffSet: i,
                name: "TestTile",
                count: ((i * 10) % 3) + 1
            }
        }
    }

    /**
     * Toggles if the menu is visible or not
     * @param show if to show the menu or not, defaults to the
     * inverse of the current state
     */
    toggle(show = !this.visible) {
        this.MenuDom.setVisible(show);
        this.borderDom.setVisible(show);
        this.buttonBackdrop.setVisible(show);
        this.flipRightButton.setVisible(show);
        this.flipLeftButton.setVisible(show);
        this.hammerButton.setVisible(show);
        this.pickButton.setVisible(show);
        this.floorButton.setVisible(show);
        this.wallButton.setVisible(show);
        this.roofButton.setVisible(show);
        this.specialObjectButton.setVisible(show);
        this.visible = show;
    }

    /**
    * Sets the depth for just the toggle button 
    * @param newDepth The depth to set the toggle button at
    */
    setToggleButtonDepth(newDepth: number) {
        this.buildingToggleButton.setDepth(newDepth);
    }

    /**
     * Sets the depth for the whole build menu
     * @param newDepth The depth to set the toggle button at
     */
    setDepth(newDepth: number) {
        this.pickButton.setDepth(newDepth);
        this.hammerButton.setDepth(newDepth);
        this.flipLeftButton.setDepth(newDepth);
        this.flipRightButton.setDepth(newDepth);
    }

    /**
     * Clears the value relating to selected layers, allows
     * picking to send the global signal or not, this means
     * this can be used to reset the values internally as well
     * as game wide. defaults to true.
     * @param emitEvent if to emit the global event signaling 
     * to clear the layer within other classes that use this
     * data 
     */
    clearLayerSelect(emitEvent: boolean = true) {
        //clear the string holder layer's string key
        this.layerSelected = "";
        //make sure no button shows as selected
        this.floorButton.setTexture("floorIcon", 0);
        this.wallButton.setTexture("wallIcon", 0);
        this.roofButton.setTexture("roofIcon", 0);
        this.specialObjectButton.setTexture("doorIcon", 0);
        //if passed in to, emit global event
        if (emitEvent) {
            this.emitter.emit("clearBuildingLayer");
        }
        //clear current selected tile
        if (this.currentSelectedItem) {
            this.currentSelectedItem.style.borderStyle = "none";
            this.currentSelectedItem = null;
        }
    }

    /**
     * Clears the value relating to selected tools, allows
     * picking to send the global signal or not, this means
     * this can be used to reset the values internally as well
     * as game wide. defaults to true.
     * @param emitEvent if to emit the global event signaling 
     * to clear the layer within other classes that use this
     * data 
     */
    clearToolSelect(emitEvent: boolean = true) {
        //make sure to clear the string holding tools string key
        this.toolSelected = "";
        //make sure no button shows as selected
        this.hammerButton.setTexture("hammerIcon", 0);
        this.pickButton.setTexture("pickIcon", 0);
        //if passed in to, emit global event
        if (emitEvent) {
            this.emitter.emit("clearBuildingTool");
        }
    }

    /**Clears which lists are being displayed */
    clearLists() {
        this.floorList.style.display = "none";
        this.wallList.style.display = "none";
        this.roofList.style.display = "none";
        this.specialList.style.display = "none";
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
        //deselect current selected item
        if(this.currentSelectedItem){
            this.currentSelectedItem.style.borderStyle = "none";
            this.currentSelectedItem = null;
        }
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