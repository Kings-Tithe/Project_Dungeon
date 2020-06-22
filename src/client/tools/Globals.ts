
/**
 * GAME_WIDTH and GAME_HEIGHT represent the size of the game
 */
export var GAME_WIDTH: number = 1280;
export var GAME_HEIGHT: number = 720;

/**
 * CENTER marks the center of the screen and is helpful for
 * positioning objects.
 */
interface Point { x: number, y: number }
export var CENTER: Point = {
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2
};