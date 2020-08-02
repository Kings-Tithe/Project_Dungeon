// Use Character class to define the type of the map
import { Character } from './Character';
import { Dreg } from './player-characters/Dreg';
import { Craig } from './player-characters/Craig';
import { Greg } from './player-characters/Greg';
import { Meg } from './player-characters/Meg';

export var playableCharacterMap: { [key: string]: typeof Character } = {};
export const addToPlayableCharacterMap = function(key: string, characterClass: typeof Character){
    playableCharacterMap[key] = characterClass;
}

addToPlayableCharacterMap("dreg", Dreg);
addToPlayableCharacterMap("craig", Craig);
addToPlayableCharacterMap("greg", Greg);
addToPlayableCharacterMap("meg", Meg);
