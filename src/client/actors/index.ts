import { Character } from './Character';

console.log("Typeof classes:", typeof Character);
export var playableCharacterMap: { [key: string]: typeof Character } = {};
console.log(playableCharacterMap);