/**
 * AsyncRunner
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
 * The AsyncRunner decorator executes an asynchronous child node (a node, whose 
 * `tick` function returns a promise). It returns `RUNNING` until the promise
 * has either resolved or rejected. It thus serves as a bridge between a 
 * synchronous tree and an asynchronous subtree.
 *
 * The AsyncRunner will throw an exception for a rejected promise.
 *
 * @class AsyncRunner
 * @extends Decorator
**/
var AsyncRunner = b3.Class(b3.Decorator);

var p = AsyncRunner.prototype;

    /**
     * Node name. Default to `AsyncRunner`.
     *
     * @property name
     * @type {String}
     * @readonly
    **/
    p.name = 'AsyncRunner';

    /**
     * Open method.
     *
     * @method open
     * @param {Tick} tick A tick instance.
    **/
    p.open = function() {
        this.status = 0;
        this.error = null;
    };

    /**
     * Tick method.
     *
     * @method tick
     * @param {Tick} tick A tick instance.
     * @returns {Constant} A state constant.
    **/
    p.tick = function(tick) {
        if (!this.child) {
            return b3.ERROR;
        }

        if (this.status === 0) {
            var self = this;
            this.child._asyncExecute(tick).then(function(result) {
                self.status = result;
            }, function(err) {
                self.status = b3.ERROR;
                self.error = err;
            });

            this.status = b3.RUNNING;
        } else if (this.status === b3.ERROR) {
            throw this.error;
        }

        return this.status;
    };

b3.AsyncRunner = AsyncRunner;

})();