/** This interface is used to store all the data used to make an item */
export interface IItemData {
    /** Signifying string telling us the items name */
    name: string,

    /** Description to the player what this item is or does */
    description: string,

    /** used to signify what item this is using a number, useful for
     * both quickly passing data between client and server and telling
     * apart every similar items even possibly items with the same name. */
    id: string,

    /** Used to signal to the system what type of item this will
     *  be used for things such as sorting and item activation. */
    type: string,

    /** Tells the worth of the item in in-game currency */
    value: number,

    /** Used to construct a graphical representation of this item */
    spriteKey: string,

    /** Used to specify various properties about the item */
    tags: {[key: string]: string}
}