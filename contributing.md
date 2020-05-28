# Conventions & Structure for Contributing

## Naming Conventions
**With any type of identifier, such as classes, functions, and variables, we prefer verbose naming!**
Yes, your college professors probably told you not to. But for this project, it doesn't matter. Verbose naming makes the intended use clearer and these days we are all using high resolution screens that can display a *lot* of text. That said, be reasonable with your identifiers. No one wants a variable called `theLunchMeatItemThatIsFoundInQuestNumberNineOnTheTable`.

### Variables
Variables are named using **camelCase**. This means they start with a lower case word, and subsequent words each start with an upper case letter.

Consider the following examples:

```js
let bossClockInternalTimer;
let playerSprite;
let monsterSprite;
```

### Functions
Functions also utilize camelCase, with a special additional rule. The first word of a function should be a verb describing what the function does. The subsequent words should describe the associated subject. We'll call this format **verbNoun**.

Example verbs: create, update, get, set, move, destroy

Consider the following examples:

```js
createBossTimer();
getRandomMonster();
createPlayerHealthBar();
updatePlayerHealthBar();
```

### Classes
Classes utilize **PascalCase** for naming. Unlike camelCase, every word in a PascalCase identifier is starts upper case.

Consider the following examples:

```js
class Warrior{}
class ServerControl{}
class NPCManager{}
```

### Interfaces
Interfaces are named exactly like classes but should start with the capital letter `I`.

Consider the following examples:

```js
interface ICharacterData{}
interface ITileData{}
interface IShopItem{}
```

## Comment Blocks
We utilize JSDoc for comment blocks. Here's a nice cheatsheet: https://devhints.io/jsdoc

### Variables
Variables should all start with a JSDoc style comment block explaining what it does. Example:
```js
/** variable used as an example of variable commenting standards */
let myVar
```

### Interfaces
Interfaces are basically a grouped and enumerated set of variables, as such they should simply be commented like a variables. Example:
```js
/** This interface is used to store my first 3 variables used as an example of interface commenting */
interface example {
  /** here is the first variable for this interface */
  varibleName: theTypeOfMyVariable,
  /** here is the second variable for this interface */
  SecondVar: string,
  /** here is the third variable for this interface */
  myThirdVar: number,
}
```

### Classes
Classes should start with a comment block containing the purpose and a list of the functions it has. The list of
functions should be in the order that they apear in the file to make it easier to search through the file. Below
that comment block should be the class declaration. Inside the class declaration before any functions should be
a list of member varibles seperated out by type and commented as described above. Followed by all the functions 
for the class. Each function should have a comment block above it listing it's call, purpose, parameters and
anything returned. Note in the below example how destroy is an example of a function only named after the action it
performs talked about above in the section on function names. Example:
```js
/** Example Class
 * Purpose: The purpose of this class is to generally show how our classes comments should be structured
 * This is by far the longest example on this page. Boss Timer is called by the example class as a off
 * hand example description.
 * 
 * Functions:
 * constructor(scene: Phaser.Scene)
 * createBossExample(spriteKey: string)
 * updateBossDealth(damage: number)
 * onBossDeath()
 * Destroy()
 */

class Example {

    /** Memeber Variables */

    //numbers
    /** Used to keep track of the bosses current health */
    bossCurrentHealth: number;
    /** Used to Keep track of the bosses starting/max health*/
    bossMaxHealth: number;

    //string
    /** Holds the key associated with the bosses sprite */
    bossSpriteKey: string;

    //sprite
    /** Contains the bosses graphical representation/sprite */
    bossSprite: Phaser.GameObjects.Sprite;

    /** constructor
     * Constructs and initiates all the required starting varibles associated with this class
     * @scene used to add all Phaser elements created by the constructor to the scene  */
    constructor(scene: Phaser.Scene){}

    /** createBossExample 
     * Creates and instantiates the boss
     * @param spriteKey used to construct a Phaser.Gameobjects.Sprite object */
    createBossExample(spriteKey: string){}

    /** updateBossHealth
     * Updates the bosses health based on a passed in damage amount, if bosses health is equal
     * to or less than 0, call onBossDeath().
     * @Damage - Number - the amount of health to take away from the bosses health pool 
     * @returns - Number - remaining health after reduction*/
    updateBossHealth(damage: number){}

    /** onBossDeath
     * Called whenever the boss' health drops below or equal to 0 */
    onBossDeath(){}

    /** Destroy
     * Used to release all varibles and elements related to this class */
    Destroy(){}
}
```

### Things to keep in mind
- Remeber to keep track of all references to your varibles, especially when creating destroy functions.
- Don't leave anything running in the background, such as setInterval()s these can be easy to forget to
close but can cause all sorts of problems especially once your out of the scene where you started them.
