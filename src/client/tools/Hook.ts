/**
 * Creates a callback that runs after some method completes on a given
 * class prototype.
 * 
 * This method can be an arrow function ()=>{} to keep the scope of the
 * current block, or a normal anonymous function(){} in order to use the
 * context of the instance of the class.
 * 
 * Also keep in mind that arrow functions can't access the "arguments"
 * object, but should be able to still receive arguments through named
 * parameters.
 * 
 * @param prototype the class prototype which contains the methods
 * @param methodNameAsString the name of the method we are hooking onto
 * @param callback the function to run after the method completes
 * 
 * Credit:
 * The original version of this function came from Stack Overflow user Eric
 * Seastrand. I have modified it to accept "null" functions and to send
 * arguments to the new function unwrapped, instead of as an argument object.
 * Linked below is the question on Stack Overflow, and the user's profile.
 * https://stackoverflow.com/questions/10273309/need-to-hook-into-a-javascript-function-call-any-way-to-do-this
 * https://stackoverflow.com/users/884734/eric-seastrand
 */
export function hookToMethod(prototype, methodNameAsString, callback) {
    (function (originalFunction) {
        prototype[methodNameAsString] = function () {
            // Check if the original function exists. It seems odd to hook to
            // a non-existent function, but this has it's uses. For example,
            // when detecting keypresses you may want to hook to onkeypress
            // with multiple other functions, even though you never created a
            // default onkeypress funciton.
            if (originalFunction != null)
                // run the original function with it's arguments
                var returnValue = originalFunction.apply(this, arguments);
            else returnValue = null;

            // while arguments is array like, to use the "..." spread syntax,
            // we need a proper array, so we make one and name it "args"
            let args = Array.from(arguments);
            // run our new function, with the return value from the original
            // function as the first argument, followed by all of the original
            // arguments (unwrapped into individual values using spread syntax)
            callback.apply(this, [returnValue, ...args]);

            return returnValue;
        };
    }(prototype[methodNameAsString]));
}