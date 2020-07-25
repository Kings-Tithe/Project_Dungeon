// Use Character class to define the type of the map
import { Character } from './Character';
import { Dreg } from './player-characters/Dreg';

export var playableCharacterMap: { [key: string]: typeof Character } = {};
export const addToPlayableCharacterMap = function(key: string, characterClass: typeof Character){
    playableCharacterMap[key] = characterClass;
}

addToPlayableCharacterMap("dreg", Dreg);
