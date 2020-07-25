import { playableCharacterMap } from '../index';
import { Character } from "../Character";
import { ICharacterData } from "../../../interfaces/ICharacterData";

export class Dreg extends Character {

    /**Creates an instance of our character
     */
    constructor(incomingData?: ICharacterData) {
        if (incomingData) {
            super(incomingData);
        } else {
            super(defaultDreg);
        }
        this.key = "dreg";
    }

}

let defaultDreg: ICharacterData = {
    name: "Dreg",
    focus: 0,
    endurance: 0,
    speed: 0,
    might: 0,
    battleSpeed: 0,
    life: 0,
    criticalChance: 0,
    energy: 0,
    carryCapacity: 0,
    exp: 0,
    level: 0
}

playableCharacterMap["dreg"] = Dreg;