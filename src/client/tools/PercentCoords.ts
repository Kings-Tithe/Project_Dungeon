import { GAME_WIDTH, GAME_HEIGHT } from './Globals';

/** returns the pixel size of a given percentage of the game width 
 * @param {number} percentage percentage of game width to return
 * @return {number} pixel size of given percentage of the game width
*/
export function px(percentage) {
    return percentage / 100 * GAME_WIDTH;
}

/** returns the pixel size of a given percentage of the game height 
 * @param {number} percentage percentage of game height to return
 * @return {number} pixel size of given percentage of the game height
*/
export function py(percentage) {
    return percentage / 100 * GAME_HEIGHT;
}

/** returns the scale to reach a given pixel size 
 * @param {number} desiredPixelSize desired pixel size
 * @param {number} originalPixelSize original pixel size of object being scaled
 * @return {number} scale factor to reach desired pixel size from given pixel size
*/
export function scaleTo(desiredPixelSize, originalPixelSize) {
    return desiredPixelSize / originalPixelSize;
}