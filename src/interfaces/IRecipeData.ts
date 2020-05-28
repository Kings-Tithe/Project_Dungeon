/** This interface is used to store all the data used to make an a recipe
 * which is basicaly a list of requirments needed to craft an item from
 * other items.
 */
export interface IRecipeData {
    /** Tells us what items are required to craft this item and how many of each
     * first number is the ingredients item id and the second is the amount */
    ingredients: {[key: number]: number},

    /** Tells us what item is crafted by this recipe */
    result: number
}