/**
 * AsyncPriority
 *
 * Copyright (c) 2014 Renato de Pontes Pereira.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
**/

/**
 * @module Behavior3JS
 **/

// namespace:
this.b3 = this.b3 || {};

(function() {
"use strict";

/**
 * AsyncPriority ticks its children sequentially until one of them returns 
 * `SUCCESS`, `RUNNING` or `ERROR`. If all children return the failure state, 
 * the priority also returns `FAILURE`.
 *
 * @class AsyncPriority
 * @extends AsyncComposite
**/
var AsyncPriority = b3.Class(b3.AsyncComposite);

var p = AsyncPriority.prototype

    /**
     * Node name. Default to `AsyncPriority`.
     *
     * @property name
     * @type String
     * @readonly
    **/
    p.name = 'AsyncPriority';

    /**
     * Tick method.
     *
     * @method tick
     * @param {Tick} tick A tick instance.
     * @returns {Constant} A state constant.
    **/
    p.tick = function(tick) {

        var done = false;

        // executing asynchronous functions in sequence
        return this.children.reduce(function (curr, next) {

            // can't break out of reduce, so we're just passing along the end result
            if(done)
                return curr;

            return curr.then(function (status) {

                if (status !== b3.FAILURE) {
                    done = true;
                    return status;
                }

                if(next._isAsync)
                    return next._asyncExecute(tick);
                else
                    return next._execute(tick);
            });

        }, Promise.resolve(b3.FAILURE));
    }

b3.AsyncPriority = AsyncPriority;

})();