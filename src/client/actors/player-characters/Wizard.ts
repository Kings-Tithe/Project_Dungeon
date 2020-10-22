import { Character } from "../Character";
import { ICharacterData } from "../../../interfaces/ICharacterData";

export class Wizard extends Character {

    /**Creates an instance of our character
     */
    constructor(incomingData?: ICharacterData) {
        if (incomingData) {
            super(incomingData);
        } else {
            super(defaultWizard);
        }
        this.key = "wizard";
    }

}

let defaultWizard: ICharacterData = {
    name: "Wizard",
    focus: 10,
    endurance: 5,
    speed: 2,
    might: 2,
    battleSpeed: 5,
    life: 50,
    criticalChance: 20,
    energy: 200,
    carryCapacity: 150,
    exp: 1456,
    level: 3
}