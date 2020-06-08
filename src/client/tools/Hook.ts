/**
 * Creates a callback that runs after some method completes on a given
 * class prototype. This method can be an arrow function ()=>{}  to keep
 * the scope of the current block, or a normal anonymous function(){} in
 * order to use the context of the instance of the class.
 * 
 * @param prototype the class prototype which contains the methods
 * @param methodNameAsString the name of the method we are hooking onto
 * @param callback the function to run after the method completes
 * 
 * Credit: Eric Seastrand, Stack Overflow User, 2015
 * https://stackoverflow.com/questions/10273309/need-to-hook-into-a-javascript-function-call-any-way-to-do-this
 */
export function hookToMethod(prototype, methodNameAsString, callback) {
    (function (originalFunction) {
        prototype[methodNameAsString] = function () {
            var returnValue = originalFunction.apply(this, arguments);

            callback.apply(this, [returnValue, originalFunction, arguments]);

            return returnValue;
        };
    }(prototype[methodNameAsString]));
}