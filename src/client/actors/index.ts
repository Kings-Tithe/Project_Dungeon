// Use Character class to define the type of the map
import { Character } from './Character';
import { Wizard } from './player-characters/Wizard';

export var playableCharacterMap: { [key: string]: typeof Character } = {};
export const addToPlayableCharacterMap = function(key: string, characterClass: typeof Character){
    playableCharacterMap[key] = characterClass;
}

addToPlayableCharacterMap("wizard", Wizard);
