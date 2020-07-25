/** This interface is used to store all the data used to make an item */
export interface ICharacterData {
    /**The name of the character */
    name: string,

    /*Base Stats: these are the 4 basic stats most the games calculations
      for characters is based on */

    /**Represents mental & focus based abilities, a character's wit, smarts
     *  steady hand and rationale. */
    focus: number,

    /**Represents a characters survivability, their pain thresholds, poison
     *  resistance, metabolism and strength of spirit. */
    endurance: number,

    /**Represents a character's momentum and mental pacing, their reflexes,
     *  rate of action and defensive capability. */
    speed: number,

    /**Represents Physical power, a character's ability to crush, grapple, 
     * slash, and generally exert force */
    might: number,


    /*Indirect Stats: these are useful stats that are stored instead
      of constantly recalculate that are based on the above base stats */
    
    /**The number of spaces this character can move in battle, based on speed stat */
    battleSpeed: number,

    /**A measure of how healthy or close to death depending a character is. slightly
     * affected by might and focus, greatly affected by endurance. */
    life: number,

    /**determines your changes of an attack being critical, greatly affected 
     * by focus and speed */
    criticalChance: number,

    /**used as a cost for abilities and skills, increases with endurance, minor cost
     * reduction with focus */
    energy: number,

    /**How much a character can carry, this is added to the party's carry capacity*/
    carryCapacity: number,

    //Other Stats

    /**Used to track battle xp */
    exp: number,
    /**Used to keep track of the characters level */
    level: number
}