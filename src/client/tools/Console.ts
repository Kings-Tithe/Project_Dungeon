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

export class Console {
    constructor(scene: Phaser.Scene) {

    }

    htmlOutput(name, args: any[]) {
        let combinedOutput = args.reduce((previousValue, currentValue) => {
            let outputThisIteration = previousValue +
                "<span class=\"log-" + (typeof currentValue) + " log-" + name + "\">" +
                (typeof currentValue === "object" && (JSON || {}).stringify ? JSON.stringify(currentValue) : currentValue) +
                "</span>&nbsp;";
            return outputThisIteration;
        }, '');
        return combinedOutput;
    }
}