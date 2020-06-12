/**
 * In game console with output of error messages, feedback, and command inputs
 * for development (or cheating I guess)
 * Contains methods to manipulate the game console and rewire output from
 * the browser console to the game console.
 * 
 * Credit:
 * I used a solution made by Stack Overflow user Benny Bottema for redirecting
 * console output to HTML elements. Linked below is the question on
 * Stack Overflow, and the user's profile.
 * https://stackoverflow.com/questions/20256760/javascript-console-log-to-html
 * https://stackoverflow.com/users/441662/benny-bottema
 */
export class Console {

    // the scene this console object should be attached to
    scene: Phaser.Scene;

    /**
     * Constructs a Console object
     * @param scene the scene this console object should be attached to
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    /**
     * Redirects the output of all major console output functions to
     * HTML game console as well as browser debug console.
     * @param outputElement the <pre> output element which will contain console
     * output
     * @param outputContainerDiv the <div> which contains the output element,
     * handles scrolling, and determines the consoles size and stlying in game 
     */
    rewireAll(outputElement: HTMLPreElement, outputContainerDiv: HTMLDivElement) {
        this.rewireConsoleFunc('log', outputElement, outputContainerDiv);
        this.rewireConsoleFunc('debug', outputElement, outputContainerDiv);
        this.rewireConsoleFunc('warn', outputElement, outputContainerDiv);
        this.rewireConsoleFunc('error', outputElement, outputContainerDiv);
        this.rewireConsoleFunc('info', outputElement, outputContainerDiv);
    }

    /**
     * Redirects the output of some console function to appear both in the
     * browser console and some HTML elements which form the game's console
     * @param consoleFuncName the name of the console function to redirect to
     * HTML output
     * @param outputElement the <pre> output element which will contain console
     * output
     * @param outputContainerDiv the <div> which contains the output element,
     * handles scrolling, and determines the consoles size and stlying in game 
     */
    rewireConsoleFunc(consoleFuncName: string, outputElement: HTMLPreElement, outputContainerDiv: HTMLDivElement) {
        // store the old version of the console function
        console['_old_' + consoleFuncName] = console[consoleFuncName];

        /**
         * The new console function which outputs to both the browser console
         * and to the game console (in HTML)
         * @param args the objects to output as log, error, etc...
         */
        console[consoleFuncName] = function (...args: any[]) {
            // get HTML span tags of the objects
            const output = Console.htmlLog(consoleFuncName, args);
            // add the html <span> texts to the <pre> output element
            outputElement.innerHTML += output + "<br>";

            // determine if game console is currently scrolled to the bottom
            const isNotBottomed =
                outputContainerDiv.scrollHeight
                - outputContainerDiv.clientHeight
                <= outputContainerDiv.scrollTop + 1;
            // automatically scroll to the bottom when new console output
            // is created
            if (isNotBottomed) {
                outputContainerDiv.scrollTop =
                    outputContainerDiv.scrollHeight
                    - outputContainerDiv.clientHeight;
            }

            // run the old function too, to print to the console
            console['_old_' + name].apply(undefined, args);
        };

    };


    /**
     * Produces an HTML formatted string of tags containing logged objects
     * @param consoleFunc the console function this output is for (syntax
     * highlighting relies on this)
     * @param args a list of any loggable objects or values
     * @return an HTML formatted string of <span> tags
     */
    static htmlLog(consoleFuncName: string, args: any[]): String {
        // reduce runs a provided function on each element of an array, with
        // the intention that that function should return a merge of each of
        // the two.
        // ['a','b','c','d'] => ['ab','c','d'] => ['abc', 'd'] => 'abcd'
        let combinedOutput = args.reduce((previousValue, currentValue) => {
            // we are adding to the previous value passed in (the current
            // combined total)
            let outputThisIteration = previousValue +
                // span tag, class corresponding with the type of variable
                "<span class=\"log-" + (typeof currentValue)
                // and logging function (consoleFuncName)
                + " log-" + consoleFuncName + "\">" +
                // check if the value is an object or primitive data
                (typeof currentValue === "object" && (JSON || {}).stringify ?
                    // add either json strings of objects or directly add
                    // primitive data to the resulting html string
                    JSON.stringify(currentValue) : currentValue) +
                // close the tag and spaces are nice
                "</span>&nbsp;";
            // send this current total to the next iteration of the reduction
            return outputThisIteration;
        }, '');
        // return the final output, an html string of span tags
        return combinedOutput;
    }
}