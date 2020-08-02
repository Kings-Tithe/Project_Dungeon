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
Interfaces are named exactly like classes but should start with the capital letter **I**.

Consider the following examples:

```js
interface ICharacterData{}
interface ITileData{}
interface IShopItem{}
```

### Internal IDs, Keys, Signals, etc...
Identifiers in the form of strings passed around internally, such as sprite keys, event identifiers, and item ids should utilize **kebab-case** naming conventions.

Consider the following examples:

```js
this.load.image('smiley-face', 'Smiley Face.png');
signals.on('evil-king-death', ()=>{
    signals.emit('quest-901-complete', data);
});
```

### Files & Folders
Source files have no particular naming convention though **camelCase** or **snake_case** are generally preferred. In addition, files in the same folder should preferably use the same naming convention.

For script files in the root directory, we prefer **dot.case** (dots separating words). Even still, in the root directory there are exceptions. For example, Node's `package-lock.json`. This file cannot be renamed and thus does not follow our conventions.

Folders also have no set convention, though we generally lean towards **kebab-case**.

## Comment Blocks
We utilize JSDoc for comment blocks. Here's a nice cheatsheet: https://devhints.io/jsdoc

## Things to keep in mind
- Remeber to keep track of all references to your varibles, especially when creating destroy functions.
- Shut down any additional processes/timers when changing scenes. It's easy to forget about calls to `setInterval()`