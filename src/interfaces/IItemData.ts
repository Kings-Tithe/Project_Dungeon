/** This interface is used to store all the data used to make an item */
export interface IItemData {
    /** Signifying string telling us the items name */
    name: string,

    /** Description to the player what this item is or does */
    description: string,

    /** Used to signal to the system what type of item this will
     *  be used for things such as sorting and item activation. */
    type: string,

    /** Tells the worth of the item in in-game currency */
    value: number,

    /** Used to construct a graphical representation of this item */
    spriteKey: string,

    /** Used to specify various properties about the item, example key "poison" = "15"
     *  then this item does 15 poison damage.*/
    tags: {[key: string]: string}
}