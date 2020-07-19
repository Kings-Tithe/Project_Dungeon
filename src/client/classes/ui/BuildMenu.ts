eimport { Hud } from "../../scenes/overlays/Hud";
import { GAME_WIDTH } from "../../tools/Globals";

export class BuildMenu {

    private hud: Hud;
    private menuDiv: HTMLDivElement;
    private dom: Phaser.GameObjects.DOMElement;
    visible: boolean;


    private constructor(hud: Hud) {
        //inital values
        this.visible = false;
        this.hud = hud;
        //create div
        this.menuDiv = document.createElement("div");
        this.menuDiv.style.width = '256px';
        this.menuDiv.style.height = '684px';
        this.menuDiv.style.padding = "0px";
        this.menuDiv.style.backgroundImage = "url('./assets/images/wooden_Background.png')";
        this.menuDiv.style.backgroundAttachment = "local";
        this.menuDiv.style.borderStyle = "solid";
        this.menuDiv.style.borderColor = "#915b20";
        this.menuDiv.style.borderWidth = "6px";
        //create list
        let list = document.createElement("ul");
        list.style.listStyle = "none";
        list.style.padding = "0px";
        list.style.margin = "3px";
        let temp = {
            name: "Temp Test",
            count: 667,
            required: "9 wood, 5 stone"
        }
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
            textsList.innerHTML = `<li>${temp.name}</li>`;
            textsList.innerHTML += `<li>${temp.count}</li>`;
            textsList.innerHTML += `<li style="display: inline">${temp.required}</li>`;
            // Append item elements to list
            item.appendChild(image);
            item.appendChild(textsList);
            list.appendChild(item);
            // Assign a callback to clicking on the item
            item.onclick = () => {
                // tileSelect(i);
                console.log(`You picked tile ${i}`);
            }
        }
        // Style the list items
        let styling = document.createElement('style');
        styling.type = "text/css";
        styling.innerHTML = ".tileDesc:nth-child(even) { background: rgba(0,0,0,0.2) }\n";
        styling.innerHTML += "li { color: white }";
        list.appendChild(styling);
        // Combine html elements
        this.menuDiv.appendChild(list);
        this.menuDiv.style.overflowY = "auto";
        this.dom = this.hud.add.dom((GAME_WIDTH - 256) - 10, 18, this.menuDiv);
        this.dom.setDepth(99).setOrigin(0);
        this.dom.setVisible(false);
    }

    static get(hud: Hud) {
        //if an instance has not been made yet, create one
        if (instance == null) {
            instance = new BuildMenu(hud);
        }
        //as long as we have an instance, return it
        return instance;
    }

    toggle(show = !this.visible) {
        this.dom.setVisible(show);
    }

}

/**This is the varible used to store our one instance of our singlton class, this
 * is a module level variable and cannot be seen by other scripts.
 */
let instance: BuildMenu = null;