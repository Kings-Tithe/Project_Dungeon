The following is the commenting format used in the creation of this game. Each is outlined with an explanation and an example.
### Naming
When naming variables or classes anything verbose and descriptive should do the trick, consider the following examples:
```javascript
let bossClockInternalTimer;
let playerSprite;
let monsterSprite;
class monster extends Phaser.Gameobjects.Sprite {};
```
When naming functions it should start with an action and be followed by a variable, class or general thing's name. Such actions might be
things like create, update, get, set, move, destroy, sort and so on. The variable, class or general thing following that should be the
thing being acted upon by the variable. In some cases it will just be the name of an action but most our functions will follow the above
standard. examples:
``` javascript
createBossTimer(){};
getRandomMonster(){};
createPlayerHealthBar(){};
updatePlayerHealthBar(){};
```

### Variables
Variables should all start with a javascript style comment block explaining what it does. Example:
``` javascript
/** variable used as an example of variable commenting standards */
let myVar
```

### Interfaces
Interfaces are basically a grouped and enumerated set of variables, as such they should simply be commented like a variables. Example:
``` javascript
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
``` javascript
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
     * @spriteKey used to construct a Phaser.Gameobjects.Sprite object */
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
