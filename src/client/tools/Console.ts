/**
 * Redirects the console's logging outputs to an HTML element.
 * @param eleLocator function to get the output element
 *   The following styling classes should exist on the output element:
 *     log-warn, log-error, log-info, log-log
 *   Examples:
 *     .log-warn { color: orange }
 *     .log-error { color: red }
 *     .log-info { color: skyblue }
 *     .log-log { color: silver }
 *     .log-warn, .log-error { font-weight: bold; }
 * @param eleOverflowLocator function to get the overflow element (container)
 *   The container element needs a style property for overflow and height.
 *   This helps us define how tall the output should be and whether we should
 *   make it scrollable. Example:
 *   #log-container { overflow: auto; height: 150px; }
 * @param autoScroll whether or not to automatically scroll to the bottom
 * 
 * Credit:
 * Benny Bottema
 * https://stackoverflow.com/questions/20256760/javascript-console-log-to-html 
 */
export function rewireLoggingToElement(eleLocator: Function, eleOverflowLocator: Function, autoScroll: Boolean) {
    fixLoggingFunc('log');
    fixLoggingFunc('debug');
    fixLoggingFunc('warn');
    fixLoggingFunc('error');
    fixLoggingFunc('info');

    // Nested function used to fix individual logging commands
    function fixLoggingFunc(name) {
        console['old' + name] = console[name];
        console[name] = function (...args: any[]) {
            const output = produceOutput(name, args);
            const eleLog = eleLocator();

            if (autoScroll) {
                const eleContainerLog = eleOverflowLocator();
                const isScrolledToBottom = eleContainerLog.scrollHeight - eleContainerLog.clientHeight <= eleContainerLog.scrollTop + 1;
                eleLog.innerHTML += output + "<br>";
                if (isScrolledToBottom) {
                    eleContainerLog.scrollTop = eleContainerLog.scrollHeight - eleContainerLog.clientHeight;
                }
            } else {
                eleLog.innerHTML += output + "<br>";
            }

            console['old' + name].apply(undefined, args);
        };
    }

    // Nested function used to add output elements to the console element
    function produceOutput(name, args) {
        return args.reduce((output, arg) => {
            return output +
                "<span class=\"log-" + (typeof arg) + " log-" + name + "\">" +
                (typeof arg === "object" && (JSON || {}).stringify ? JSON.stringify(arg) : arg) +
                "</span>&nbsp;";
        }, '');
    }
}

/**
 * In game console with output of error messages, feedback, and command inputs
 * for development (or cheating I guess)
 * Contains methods to manipulate the game console and rewire output from
 * the browser console to the game console.
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
    static htmlLog(consoleFuncName: string, args: any[]) {
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