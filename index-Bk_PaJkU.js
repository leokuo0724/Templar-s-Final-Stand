/**
 * @preserve
 * Kontra.js v10.0.0
 */
/**
 * A group of helpful functions that are commonly used for game development. Includes things such as converting between radians and degrees and getting random integers.
 *
 * ```js
 * import { degToRad } from 'kontra';
 *
 * let radians = degToRad(180);  // => 3.14
 * ```
 * @sectionName Helpers
 */


/**
 * Rotate a point by an angle.
 * @function rotatePoint
 *
 * @param {{x: Number, y: Number}} point - The {x,y} point to rotate.
 * @param {Number} angle - Angle (in radians) to rotate.
 *
 * @returns {{x: Number, y: Number}} The new x and y coordinates after rotation.
 */
function rotatePoint(point, angle) {
  let sin = Math.sin(angle);
  let cos = Math.cos(angle);

  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos
  };
}

/**
 * Clamp a number between two values, preventing it from going below or above the minimum and maximum values.
 * @function clamp
 *
 * @param {Number} min - Min value.
 * @param {Number} max - Max value.
 * @param {Number} value - Value to clamp.
 *
 * @returns {Number} Value clamped between min and max.
 */
function clamp(min, max, value) {
  return Math.min(Math.max(min, value), max);
}

let noop = () => {};

/**
 * Remove an item from an array.
 *
 * @param {*[]} array - Array to remove from.
 * @param {*} item - Item to remove.
 *
 * @returns {Boolean|undefined} True if the item was removed.
 */
function removeFromArray(array, item) {
  let index = array.indexOf(item);
  if (index != -1) {
    array.splice(index, 1);
    return true;
  }
}

/**
 * A simple event system. Allows you to hook into Kontra lifecycle events or create your own, such as for [Plugins](api/plugin).
 *
 * ```js
 * import { on, off, emit } from 'kontra';
 *
 * function callback(a, b, c) {
 *   console.log({a, b, c});
 * });
 *
 * on('myEvent', callback);
 * emit('myEvent', 1, 2, 3);  //=> {a: 1, b: 2, c: 3}
 * off('myEvent', callback);
 * ```
 * @sectionName Events
 */

// expose for testing
let callbacks$2 = {};

/**
 * There are currently only three lifecycle events:
 * - `init` - Emitted after `kontra.init()` is called.
 * - `tick` - Emitted every frame of [GameLoop](api/gameLoop) before the loops `update()` and `render()` functions are called.
 * - `assetLoaded` - Emitted after an asset has fully loaded using the asset loader. The callback function is passed the asset and the url of the asset as parameters.
 * @sectionName Lifecycle Events
 */

/**
 * Register a callback for an event to be called whenever the event is emitted. The callback will be passed all arguments used in the `emit` call.
 * @function on
 *
 * @param {String} event - Name of the event.
 * @param {Function} callback - Function that will be called when the event is emitted.
 */
function on(event, callback) {
  callbacks$2[event] = callbacks$2[event] || [];
  callbacks$2[event].push(callback);
}

/**
 * Call all callback functions for the event. All arguments will be passed to the callback functions.
 * @function emit
 *
 * @param {String} event - Name of the event.
 * @param {...*} args - Comma separated list of arguments passed to all callbacks.
 */
function emit(event, ...args) {
  (callbacks$2[event] || []).map(fn => fn(...args));
}

/**
 * Functions for initializing the Kontra library and getting the canvas and context
 * objects.
 *
 * ```js
 * import { getCanvas, getContext, init } from 'kontra';
 *
 * let { canvas, context } = init();
 *
 * // or can get canvas and context through functions
 * canvas = getCanvas();
 * context = getContext();
 * ```
 * @sectionName Core
 */

let canvasEl, context;

// allow contextless environments, such as using ThreeJS as the main
// canvas, by proxying all canvas context calls
let handler$1 = {
  // by using noop we can proxy both property and function calls
  // so neither will throw errors
  get(target, key) {
    // export for testing
    if (key == '_proxy') return true;
    return noop;
  }
};

/**
 * Return the canvas element.
 * @function getCanvas
 *
 * @returns {HTMLCanvasElement} The canvas element for the game.
 */
function getCanvas() {
  return canvasEl;
}

/**
 * Return the context object.
 * @function getContext
 *
 * @returns {CanvasRenderingContext2D} The context object the game draws to.
 */
function getContext() {
  return context;
}

/**
 * Initialize the library and set up the canvas. Typically you will call `init()` as the first thing and give it the canvas to use. This will allow all Kontra objects to reference the canvas when created.
 *
 * ```js
 * import { init } from 'kontra';
 *
 * let { canvas, context } = init('game');
 * ```
 * @function init
 *
 * @param {String|HTMLCanvasElement} [canvas] - The canvas for Kontra to use. Can either be the ID of the canvas element or the canvas element itself. Defaults to using the first canvas element on the page.
 * @param {Object} [options] - Game options.
 * @param {Boolean} [options.contextless=false] - If the game will run in an contextless environment. A contextless environment uses a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) for the `canvas` and `context` so all property and function calls will noop.
 *
 * @returns {{canvas: HTMLCanvasElement, context: CanvasRenderingContext2D}} An object with properties `canvas` and `context`. `canvas` it the canvas element for the game and `context` is the context object the game draws to.
 */
function init$1(canvas, { contextless = false } = {}) {
  // check if canvas is a string first, an element next, or default to
  // getting first canvas on page
  canvasEl =
    document.getElementById(canvas) ||
    canvas ||
    document.querySelector('canvas');

  if (contextless) {
    canvasEl = canvasEl || new Proxy({}, handler$1);
  }


  context = canvasEl.getContext('2d') || new Proxy({}, handler$1);
  context.imageSmoothingEnabled = false;

  emit('init');

  return { canvas: canvasEl, context };
}

/**
 * A simple 2d vector object. Takes either separate `x` and `y` coordinates or a Vector-like object.
 *
 * ```js
 * import { Vector } from 'kontra';
 *
 * let vector = Vector(100, 200);
 * let vector2 = Vector({x: 100, y: 200});
 * ```
 * @class Vector
 *
 * @param {Number|{x: number, y: number}} [x=0] - X coordinate of the vector or a Vector-like object. If passing an object, the `y` param is ignored.
 * @param {Number} [y=0] - Y coordinate of the vector.
 */
class Vector {
  constructor(x = 0, y = 0, vec = {}) {
    if (x.x != undefined) {
      this.x = x.x;
      this.y = x.y;
    }
    else {
      this.x = x;
      this.y = y;
    }

  }

  /**
   * Set the x and y coordinate of the vector.
   * @memberof Vector
   * @function set
   *
   * @param {Vector|{x: number, y: number}} vector - Vector to set coordinates from.
   */
  set(vec) {
    this.x = vec.x;
    this.y = vec.y;
  }

  /**
   * Calculate the addition of the current vector with the given vector.
   * @memberof Vector
   * @function add
   *
   * @param {Vector|{x: number, y: number}} vector - Vector to add to the current Vector.
   *
   * @returns {Vector} A new Vector instance whose value is the addition of the two vectors.
   */
  add(vec) {
    return new Vector(this.x + vec.x, this.y + vec.y, this);
  }









}

function factory$a() {
  return new Vector(...arguments);
}

/**
 * This is a private class that is used just to help make the GameObject class more manageable and smaller.
 *
 * It maintains everything that can be changed in the update function:
 * position
 * velocity
 * acceleration
 * ttl
 */
class Updatable {
  constructor(properties) {
    return this.init(properties);
  }

  init(properties = {}) {
    // --------------------------------------------------
    // defaults
    // --------------------------------------------------

    /**
     * The game objects position vector. Represents the local position of the object as opposed to the [world](api/gameObject#world) position.
     * @property {Vector} position
     * @memberof GameObject
     * @page GameObject
     */
    this.position = factory$a();

    // --------------------------------------------------
    // optionals
    // --------------------------------------------------




    // add all properties to the object, overriding any defaults
    Object.assign(this, properties);
  }

  /**
   * Update the position of the game object and all children using their velocity and acceleration. Calls the game objects [advance()](api/gameObject#advance) function.
   * @memberof GameObject
   * @function update
   * @page GameObject
   *
   * @param {Number} [dt] - Time since last update.
   */
  update(dt) {
    this.advance(dt);
  }

  /**
   * Move the game object by its acceleration and velocity. If you pass `dt` it will multiply the vector and acceleration by that number. This means the `dx`, `dy`, `ddx` and `ddy` should be how far you want the object to move in 1 second rather than in 1 frame.
   *
   * If you override the game objects [update()](api/gameObject#update) function with your own update function, you can call this function to move the game object normally.
   *
   * ```js
   * import { GameObject } from 'kontra';
   *
   * let gameObject = GameObject({
   *   x: 100,
   *   y: 200,
   *   width: 20,
   *   height: 40,
   *   dx: 5,
   *   dy: 2,
   *   update: function() {
   *     // move the game object normally
   *     this.advance();
   *
   *     // change the velocity at the edges of the canvas
   *     if (this.x < 0 ||
   *         this.x + this.width > this.context.canvas.width) {
   *       this.dx = -this.dx;
   *     }
   *     if (this.y < 0 ||
   *         this.y + this.height > this.context.canvas.height) {
   *       this.dy = -this.dy;
   *     }
   *   }
   * });
   * ```
   * @memberof GameObject
   * @function advance
   * @page GameObject
   *
   * @param {Number} [dt] - Time since last update.
   *
   */
  advance(dt) {


  }

  // --------------------------------------------------
  // velocity
  // --------------------------------------------------


  // --------------------------------------------------
  // acceleration
  // --------------------------------------------------


  // --------------------------------------------------
  // ttl
  // --------------------------------------------------


  _pc() {}
}

/**
 * The base class of most renderable classes. Handles things such as position, rotation, anchor, and the update and render life cycle.
 *
 * Typically you don't create a GameObject directly, but rather extend it for new classes.
 * @class GameObject
 *
 * @param {Object} [properties] - Properties of the game object.
 * @param {Number} [properties.x] - X coordinate of the position vector.
 * @param {Number} [properties.y] - Y coordinate of the position vector.
 * @param {Number} [properties.width] - Width of the game object.
 * @param {Number} [properties.height] - Height of the game object.
 * @param {Number} [properties.radius] - Radius of the game object. **Note:** radius is mutually exclusive with `width` and `height` as the GameObject will always use `radius` over `width` and `height` for any logic.
 *
 * @param {CanvasRenderingContext2D} [properties.context] - The context the game object should draw to. Defaults to [core.getContext()](api/core#getContext).
 *
 * @param {Number} [properties.dx] - X coordinate of the velocity vector.
 * @param {Number} [properties.dy] - Y coordinate of the velocity vector.
 * @param {Number} [properties.ddx] - X coordinate of the acceleration vector.
 * @param {Number} [properties.ddy] - Y coordinate of the acceleration vector.
 * @param {Number} [properties.ttl=Infinity] - How many frames the game object should be alive. Used by [Pool](api/pool).
 *
 * @param {{x: Number, y: Number}} [properties.anchor={x:0,y:0}] - The x and y origin of the game object. {x:0, y:0} is the top left corner of the game object, {x:1, y:1} is the bottom right corner.
 * @param {GameObject[]} [properties.children] - Children to add to the game object.
 * @param {Number} [properties.opacity=1] - The opacity of the game object.
 * @param {Number} [properties.rotation=0] - The rotation around the anchor in radians.
 * @param {Number} [properties.drotation=0] - The angular velocity of the rotation in radians.
 * @param {Number} [properties.ddrotation=0] - The angular acceleration of the rotation in radians.
 * @param {Number} [properties.scaleX=1] - The x scale of the game object.
 * @param {Number} [properties.scaleY=1] - The y scale of the game object.
 *
 * @param {(dt?: Number) => void} [properties.update] - Function called every frame to update the game object.
 * @param {Function} [properties.render] - Function called every frame to render the game object.
 *
 * @param {...*} properties.props - Any additional properties you need added to the game object. For example, if you pass `gameObject({type: 'player'})` then the game object will also have a property of the same name and value. You can pass as many additional properties as you want.
 */
class GameObject extends Updatable {
  /**
   * @docs docs/api_docs/gameObject.js
   */

  /**
   * Use this function to reinitialize a game object. It takes the same properties object as the constructor. Useful it you want to repurpose a game object.
   * @memberof GameObject
   * @function init
   *
   * @param {Object} properties - Properties of the game object.
   */
  init({
    // --------------------------------------------------
    // defaults
    // --------------------------------------------------

    /**
     * The width of the game object. Represents the local width of the object as opposed to the [world](api/gameObject#world) width.
     * @memberof GameObject
     * @property {Number} width
     */
    width = 0,

    /**
     * The height of the game object. Represents the local height of the object as opposed to the [world](api/gameObject#world) height.
     * @memberof GameObject
     * @property {Number} height
     */
    height = 0,

    /**
     * The context the game object will draw to.
     * @memberof GameObject
     * @property {CanvasRenderingContext2D} context
     */
    context = getContext(),

    render = this.draw,
    update = this.advance,

    // --------------------------------------------------
    // optionals
    // --------------------------------------------------

    /**
     * The radius of the game object. Represents the local radius of the object as opposed to the [world](api/gameObject#world) radius.
     * @memberof GameObject
     * @property {Number} radius
     */

    /**
     * The game objects parent object.
     * @memberof GameObject
     * @property {GameObject|null} parent
     */

    /**
     * The game objects children objects.
     * @memberof GameObject
     * @property {GameObject[]} children
     */
    children = [],

    /**
     * The x and y origin of the game object. {x:0, y:0} is the top left corner of the game object, {x:1, y:1} is the bottom right corner.
     * @memberof GameObject
     * @property {{x: Number, y: Number}} anchor
     *
     * @example
     * // exclude-code:start
     * let { GameObject } = kontra;
     * // exclude-code:end
     * // exclude-script:start
     * import { GameObject } from 'kontra';
     * // exclude-script:end
     *
     * let gameObject = GameObject({
     *   x: 150,
     *   y: 100,
     *   width: 50,
     *   height: 50,
     *   color: 'red',
     *   // exclude-code:start
     *   context: context,
     *   // exclude-code:end
     *   render: function() {
     *     this.context.fillStyle = this.color;
     *     this.context.fillRect(0, 0, this.height, this.width);
     *   }
     * });
     *
     * function drawOrigin(gameObject) {
     *   gameObject.context.fillStyle = 'yellow';
     *   gameObject.context.beginPath();
     *   gameObject.context.arc(gameObject.x, gameObject.y, 3, 0, 2*Math.PI);
     *   gameObject.context.fill();
     * }
     *
     * gameObject.render();
     * drawOrigin(gameObject);
     *
     * gameObject.anchor = {x: 0.5, y: 0.5};
     * gameObject.x = 300;
     * gameObject.render();
     * drawOrigin(gameObject);
     *
     * gameObject.anchor = {x: 1, y: 1};
     * gameObject.x = 450;
     * gameObject.render();
     * drawOrigin(gameObject);
     */
    anchor = { x: 0, y: 0 },

    /**
     * The opacity of the object. Represents the local opacity of the object as opposed to the [world](api/gameObject#world) opacity.
     * @memberof GameObject
     * @property {Number} opacity
     */
    opacity = 1,

    /**
     * The rotation of the game object around the anchor in radians. Represents the local rotation of the object as opposed to the [world](api/gameObject#world) rotation.
     * @memberof GameObject
     * @property {Number} rotation
     */
    rotation = 0,



    /**
     * The x scale of the object. Represents the local x scale of the object as opposed to the [world](api/gameObject#world) x scale.
     * @memberof GameObject
     * @property {Number} scaleX
     */
    scaleX = 1,

    /**
     * The y scale of the object. Represents the local y scale of the object as opposed to the [world](api/gameObject#world) y scale.
     * @memberof GameObject
     * @property {Number} scaleY
     */
    scaleY = 1,

    ...props
  } = {}) {
    this._c = [];

    // by setting defaults to the parameters and passing them into
    // the init, we can ensure that a parent class can set overriding
    // defaults and the GameObject won't undo it (if we set
    // `this.width` then no parent could provide a default value for
    // width)
    super.init({
      width,
      height,
      context,

      anchor,

      opacity,

      rotation,



      scaleX,
      scaleY,

      ...props
    });

    // di = done init
    this._di = true;
    this._uw();

    this.addChild(children);

    // rf = render function
    this._rf = render;

    // uf = update function
    this._uf = update;

    on('init', () => {
      this.context ??= getContext();
    });
  }

  /**
   * Update all children
   */
  update(dt) {
    this._uf(dt);

    this.children.map(child => child.update && child.update(dt));
  }

  /**
   * Render the game object and all children. Calls the game objects [draw()](api/gameObject#draw) function.
   * @memberof GameObject
   * @function render
   */
  render() {
    let context = this.context;
    context.save();

    // 1) translate to position
    //
    // it's faster to only translate if one of the values is non-zero
    // rather than always translating
    // @see https://jsperf.com/translate-or-if-statement/2
    if (this.x || this.y) {
      context.translate(this.x, this.y);
    }

    // 3) rotate around the anchor
    //
    // it's faster to only rotate when set rather than always rotating
    // @see https://jsperf.com/rotate-or-if-statement/2
    if (this.rotation) {
      context.rotate(this.rotation);
    }

    // 4) scale after translation to position so object can be
    // scaled in place (rather than scaling position as well).
    //
    // it's faster to only scale if one of the values is not 1
    // rather than always scaling
    // @see https://jsperf.com/scale-or-if-statement/4
    if (this.scaleX != 1 || this.scaleY != 1) {
      context.scale(this.scaleX, this.scaleY);
    }

    // 5) translate to the anchor so (0,0) is the top left corner
    // for the render function
    let width = this.width;
    let height = this.height;

    if (this.radius) {
      width = height = this.radius * 2;
    }

    let anchorX = -width * this.anchor.x;
    let anchorY = -height * this.anchor.y;

    if (anchorX || anchorY) {
      context.translate(anchorX, anchorY);
    }

    // it's not really any faster to gate the global alpha
    // @see https://jsperf.com/global-alpha-or-if-statement/1
    this.context.globalAlpha = this.opacity;

    this._rf();

    // 7) translate back to the anchor so children use the correct
    // x/y value from the anchor
    if (anchorX || anchorY) {
      context.translate(-anchorX, -anchorY);
    }

    // perform all transforms on the parent before rendering the
    // children
    let children = this.children;
    children.map(child => child.render && child.render());

    context.restore();
  }

  /**
   * Draw the game object at its X and Y position, taking into account rotation, scale, and anchor.
   *
   * Do note that the canvas has been rotated and translated to the objects position (taking into account anchor), so {0,0} will be the top-left corner of the game object when drawing.
   *
   * If you override the game objects `render()` function with your own render function, you can call this function to draw the game object normally.
   *
   * ```js
   * let { GameObject } = kontra;
   *
   * let gameObject = GameObject({
   *  x: 290,
   *  y: 80,
   *  width: 20,
   *  height: 40,
   *
   *  render: function() {
   *    // draw the game object normally (perform rotation and other transforms)
   *    this.draw();
   *
   *    // outline the game object
   *    this.context.strokeStyle = 'yellow';
   *    this.context.lineWidth = 2;
   *    this.context.strokeRect(0, 0, this.width, this.height);
   *  }
   * });
   *
   * gameObject.render();
   * ```
   * @memberof GameObject
   * @function draw
   */
  draw() {}

  /**
   * Sync property changes from the parent to the child
   */
  _pc() {
    this._uw();

    this.children.map(child => child._pc());
  }

  /**
   * X coordinate of the position vector.
   * @memberof GameObject
   * @property {Number} x
   */
  get x() {
    return this.position.x;
  }

  /**
   * Y coordinate of the position vector.
   * @memberof GameObject
   * @property {Number} y
   */
  get y() {
    return this.position.y;
  }

  set x(value) {
    this.position.x = value;

    // pc = property changed
    this._pc();
  }

  set y(value) {
    this.position.y = value;
    this._pc();
  }

  get width() {
    // w = width
    return this._w;
  }

  set width(value) {
    this._w = value;
    this._pc();
  }

  get height() {
    // h = height
    return this._h;
  }

  set height(value) {
    this._h = value;
    this._pc();
  }

  /**
   * Update world properties
   */
  _uw() {
    // don't update world properties until after the init has finished
    if (!this._di) return;

    let {
      _wx = 0,
      _wy = 0,

      _wo = 1,

      _wrot = 0,

      _wsx = 1,
      _wsy = 1
    } = this.parent || {};

    // wx = world x, wy = world y
    this._wx = this.x;
    this._wy = this.y;

    // ww = world width, wh = world height
    this._ww = this.width;
    this._wh = this.height;

    // wrx = world radius x, wry = world radius y
    if (this.radius) {
      this._wrx = this.radius;
      this._wry = this.radius;
    }

    // wo = world opacity
    this._wo = _wo * this.opacity;

    // wsx = world scale x, wsy = world scale y
    this._wsx = _wsx * this.scaleX;
    this._wsy = _wsy * this.scaleY;

    this._wx = this._wx * _wsx;
    this._wy = this._wy * _wsy;
    this._ww = this.width * this._wsx;
    this._wh = this.height * this._wsy;

    if (this.radius) {
      this._wrx = this.radius * this._wsx;
      this._wry = this.radius * this._wsy;
    }

    // wrot = world rotation
    this._wrot = _wrot + this.rotation;

    let { x, y } = rotatePoint({ x: this._wx, y: this._wy }, _wrot);
    this._wx = x;
    this._wy = y;

    this._wx += _wx;
    this._wy += _wy;
  }

  /**
   * The world position, width, height, opacity, rotation, and scale. The world property is the true position, width, height, etc. of the object, taking into account all parents.
   *
   * The world property does not adjust for anchor or scale, so if you set a negative scale the world width or height could be negative. Use [getWorldRect](api/helpers#getWorldRect) to get the world position and size adjusted for anchor and scale.
   * @property {{x: Number, y: Number, width: Number, height: Number, opacity: Number, rotation: Number, scaleX: Number, scaleY: Number}} world
   * @memberof GameObject
   */
  get world() {
    return {
      x: this._wx,
      y: this._wy,
      width: this._ww,
      height: this._wh,

      radius: this.radius
        ? { x: this._wrx, y: this._wry }
        : undefined,

      opacity: this._wo,

      rotation: this._wrot,

      scaleX: this._wsx,
      scaleY: this._wsy
    };
  }

  // --------------------------------------------------
  // group
  // --------------------------------------------------

  set children(value) {
    this.removeChild(this._c);
    this.addChild(value);
  }

  get children() {
    return this._c;
  }

  /**
   * Add an object as a child to this object. The objects position, size, and rotation will be relative to the parents position, size, and rotation. The childs [world](api/gameObject#world) property will be updated to take into account this object and all of its parents.
   * @memberof GameObject
   * @function addChild
   *
   * @param {...(GameObject|GameObject[])[]} objects - Object to add as a child. Can be a single object, an array of objects, or a comma-separated list of objects.
   *
   * @example
   * // exclude-code:start
   * let { GameObject } = kontra;
   * // exclude-code:end
   * // exclude-script:start
   * import { GameObject } from 'kontra';
   * // exclude-script:end
   *
   * function createObject(x, y, color, size = 1) {
   *   return GameObject({
   *     x,
   *     y,
   *     width: 50 / size,
   *     height: 50 / size,
   *     anchor: {x: 0.5, y: 0.5},
   *     color,
   *     // exclude-code:start
   *     context: context,
   *     // exclude-code:end
   *     render: function() {
   *       this.context.fillStyle = this.color;
   *       this.context.fillRect(0, 0, this.height, this.width);
   *     }
   *   });
   * }
   *
   * let parent = createObject(300, 100, 'red');
   *
   * // create a child that is 25px to the right and
   * // down from the parents position
   * let child = createObject(25, 25, 'yellow', 2);
   *
   * parent.addChild(child);
   *
   * parent.render();
   */
  addChild(...objects) {
    objects.flat().map(child => {
      this.children.push(child);
      child.parent = this;
      child._pc = child._pc || noop;
      child._pc();
    });
  }

  /**
   * Remove an object as a child of this object. The removed objects [world](api/gameObject#world) property will be updated to not take into account this object and all of its parents.
   * @memberof GameObject
   * @function removeChild
   *
   * @param {...(GameObject|GameObject[])[]} objects - Object to remove as a child. Can be a single object, an array of objects, or a comma-separated list of objects.
   */
  removeChild(...objects) {
    objects.flat().map(child => {
      if (removeFromArray(this.children, child)) {
        child.parent = null;
        child._pc();
      }
    });
  }

  // --------------------------------------------------
  // radius
  // --------------------------------------------------

  get radius() {
    // r = radius
    return this._r;
  }

  set radius(value) {
    this._r = value;
    this._pc();
  }

  // --------------------------------------------------
  // opacity
  // --------------------------------------------------

  get opacity() {
    return this._opa;
  }

  set opacity(value) {
    this._opa = clamp(0, 1, value);
    this._pc();
  }

  // --------------------------------------------------
  // rotation
  // --------------------------------------------------

  get rotation() {
    return this._rot;
  }

  set rotation(value) {
    this._rot = value;
    this._pc();
  }



  // --------------------------------------------------
  // scale
  // --------------------------------------------------

  /**
   * Set the x and y scale of the object. If only one value is passed, both are set to the same value.
   * @memberof GameObject
   * @function setScale
   *
   * @param {Number} x - X scale value.
   * @param {Number} [y=x] - Y scale value.
   */
  setScale(x, y = x) {
    this.scaleX = x;
    this.scaleY = y;
  }

  get scaleX() {
    return this._scx;
  }

  set scaleX(value) {
    this._scx = value;
    this._pc();
  }

  get scaleY() {
    return this._scy;
  }

  set scaleY(value) {
    this._scy = value;
    this._pc();
  }
}

/**
 * A versatile way to update and draw your sprites. It can handle simple rectangles, images, and sprite sheet animations. It can be used for your main player object as well as tiny particles in a particle engine.
 * @class Sprite
 * @extends GameObject
 *
 * @param {Object} [properties] - Properties of the sprite.
 * @param {String} [properties.color] - Fill color for the game object if no image or animation is provided.
 * @param {HTMLImageElement|HTMLCanvasElement} [properties.image] - Use an image to draw the sprite.
 * @param {{[name: String] : Animation}} [properties.animations] - An object of [Animations](api/animation) from a [Spritesheet](api/spriteSheet) to animate the sprite.
 */
class Sprite extends GameObject {
  /**
   * @docs docs/api_docs/sprite.js
   */

  init({
    /**
     * The color of the game object if it was passed as an argument.
     * @memberof Sprite
     * @property {String} color
     */


    ...props
  } = {}) {
    super.init({
      ...props
    });
  }


  draw() {


    if (this.color) {
      this.context.fillStyle = this.color;

      if (this.radius) {
        this.context.beginPath();
        this.context.arc(
          this.radius,
          this.radius,
          this.radius,
          0,
          Math.PI * 2
        );
        this.context.fill();
        return;
      }

      this.context.fillRect(0, 0, this.width, this.height);
    }
  }
}

function factory$8() {
  return new Sprite(...arguments);
}

let fontSizeRegex = /(\d+)(\w+)/;

function parseFont(font) {
  if (!font) return { computed: 0 };

  let match = font.match(fontSizeRegex);

  // coerce string to number
  // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#coercion-to-test-for-types
  let size = +match[1];
  let unit = match[2];
  let computed = size;

  return {
    size,
    unit,
    computed
  };
}

/**
 * An object for drawing text to the screen. Supports newline characters as well as automatic new lines when setting the `width` property.
 *
 * You can also display RTL languages by setting the attribute `dir="rtl"` on the main canvas element. Due to the limited browser support for individual text to have RTL settings, it must be set globally for the entire game.
 *
 * @example
 * // exclude-code:start
 * let { Text } = kontra;
 * // exclude-code:end
 * // exclude-script:start
 * import { Text } from 'kontra';
 * // exclude-script:end
 *
 * let text = Text({
 *   text: 'Hello World!\nI can even be multiline!',
 *   font: '32px Arial',
 *   color: 'white',
 *   x: 300,
 *   y: 100,
 *   anchor: {x: 0.5, y: 0.5},
 *   textAlign: 'center'
 * });
 * // exclude-code:start
 * text.context = context;
 * // exclude-code:end
 *
 * text.render();
 * @class Text
 * @extends GameObject
 *
 * @param {Object} properties - Properties of the text.
 * @param {String} properties.text - The text to display.
 * @param {String} [properties.font] - The [font](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font) style. Defaults to the main context font.
 * @param {String} [properties.color] - Fill color for the text. Defaults to the main context fillStyle.
 * @param {Number} [properties.width] - Set a fixed width for the text. If set, the text will automatically be split into new lines that will fit the size when possible.
 * @param {String} [properties.textAlign='left'] - The [textAlign](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign) for the context. If the `dir` attribute is set to `rtl` on the main canvas, the text will automatically be aligned to the right, but you can override that by setting this property.
 * @param {Number} [properties.lineHeight=1] - The distance between two lines of text.
 * @param {String} [properties.strokeColor] - Stroke color for the text.
 * @param {number} [properties.lineWidth] - Stroke line width for the text.
 */
class Text extends GameObject {
  init({
    // --------------------------------------------------
    // defaults
    // --------------------------------------------------

    /**
     * The string of text. Use newline characters to create multi-line strings.
     * @memberof Text
     * @property {String} text
     */
    text = '',

    /**
     * The text alignment.
     * @memberof Text
     * @property {String} textAlign
     */
    textAlign = '',

    /**
     * The distance between two lines of text. The value is multiplied by the texts font size.
     * @memberof Text
     * @property {Number} lineHeight
     */
    lineHeight = 1,

    /**
     * The font style.
     * @memberof Text
     * @property {String} font
     */
    font = getContext()?.font,

    /**
     * The color of the text.
     * @memberof Text
     * @property {String} color
     */

    ...props
  } = {}) {
    // cast to string
    text = '' + text;

    super.init({
      text,
      textAlign,
      lineHeight,
      font,
      ...props
    });

    // p = prerender
    if (this.context) {
      this._p();
    }

    on('init', () => {
      this.font ??= getContext().font;
      this._p();
    });
  }

  // keep width and height getters/settings so we can set _w and _h
  // and not trigger infinite call loops
  get width() {
    // w = width
    return this._w;
  }

  set width(value) {
    // d = dirty
    this._d = true;
    this._w = value;

    // fw = fixed width
    this._fw = value;
  }

  get text() {
    return this._t;
  }

  set text(value) {
    this._d = true;
    this._t = '' + value;
  }

  get font() {
    return this._f;
  }

  set font(value) {
    this._d = true;
    this._f = value;
    this._fs = parseFont(value).computed;
  }

  get lineHeight() {
    // lh = line height
    return this._lh;
  }

  set lineHeight(value) {
    this._d = true;
    this._lh = value;
  }

  render() {
    if (this._d) {
      this._p();
    }
    super.render();
  }

  /**
   * Calculate the font width, height, and text strings before rendering.
   */
  _p() {
    // s = strings
    this._s = [];
    this._d = false;
    let context = this.context;
    let text = [this.text];

    context.font = this.font;

    text = this.text.split('\n');


    if (!this._s.length && this.text.includes('\n')) {
      let width = 0;
      text.map(str => {
        this._s.push(str);
        width = Math.max(width, context.measureText(str).width);
      });

      this._w = this._fw || width;
    }

    if (!this._s.length) {
      this._s.push(this.text);
      this._w = this._fw || context.measureText(this.text).width;
    }

    this.height =
      this._fs + (this._s.length - 1) * this._fs * this.lineHeight;
    this._uw();
  }

  draw() {
    let alignX = 0;
    let textAlign = this.textAlign;
    let context = this.context;


    alignX =
      textAlign == 'right'
        ? this.width
        : textAlign == 'center'
        ? (this.width / 2) | 0
        : 0;

    this._s.map((str, index) => {
      context.textBaseline = 'top';
      context.textAlign = textAlign;
      context.fillStyle = this.color;
      context.font = this.font;



      context.fillText(
        str,
        alignX,
        this._fs * this.lineHeight * index
      );
    });
  }
}

function factory$7() {
  return new Text(...arguments);
}

/**
 * Register a function to be called on pointer events. Is passed the original Event and the target object (if there is one).
 *
 * ```js
 * import { initPointer, onPointer } from 'kontra';
 *
 * initPointer();
 *
 * onPointer('down', function(e, object) {
 *   // handle pointer down
 * });
 * ```
 * @function onPointer
 *
 * @param {'down'|'up'} direction - Direction of the pointer event.
 * @param {(evt: MouseEvent|TouchEvent, object?: Object) => void} callback - Function to call on pointer event.
 */
function onPointer(direction, callback) {
  direction[0].toUpperCase() + direction.substr(1);
}

/**
 * Clear the canvas.
 */
function clear(context) {
  let canvas = context.canvas;
  context.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * The game loop updates and renders the game every frame. The game loop is stopped by default and will not start until the loops `start()` function is called.
 *
 * The game loop uses a time-based animation with a fixed `dt` to [avoid frame rate issues](http://blog.sklambert.com/using-time-based-animation-implement/). Each update call is guaranteed to equal 1/60 of a second.
 *
 * This means that you can avoid having to do time based calculations in your update functions and instead do fixed updates.
 *
 * ```js
 * import { Sprite, GameLoop } from 'kontra';
 *
 * let sprite = Sprite({
 *   x: 100,
 *   y: 200,
 *   width: 20,
 *   height: 40,
 *   color: 'red'
 * });
 *
 * let loop = GameLoop({
 *   update: function(dt) {
 *     // no need to determine how many pixels you want to
 *     // move every second and multiple by dt
 *     // sprite.x += 180 * dt;
 *
 *     // instead just update by how many pixels you want
 *     // to move every frame and the loop will ensure 60FPS
 *     sprite.x += 3;
 *   },
 *   render: function() {
 *     sprite.render();
 *   }
 * });
 *
 * loop.start();
 * ```
 * @class GameLoop
 *
 * @param {Object} properties - Properties of the game loop.
 * @param {(dt: Number) => void} [properties.update] - Function called every frame to update the game. Is passed the fixed `dt` as a parameter.
 * @param {Function} properties.render - Function called every frame to render the game.
 * @param {Number}   [properties.fps=60] - Desired frame rate.
 * @param {Boolean}  [properties.clearCanvas=true] - Clear the canvas every frame before the `render()` function is called.
 * @param {CanvasRenderingContext2D} [properties.context] - The context that should be cleared each frame if `clearContext` is not set to `false`. Defaults to [core.getContext()](api/core#getContext).
 * @param {Boolean} [properties.blur=false] - If the loop should still update and render if the page does not have focus.
 */
function GameLoop({
  fps = 60,
  clearCanvas = true,
  update = noop,
  render,
  context = getContext(),
  blur = false
} = {}) {
  // check for required functions

  // animation variables
  let accumulator = 0;
  let delta = 1e3 / fps; // delta between performance.now timings (in ms)
  let step = 1 / fps;
  let clearFn = clearCanvas ? clear : noop;
  let last, rAF, now, dt, loop;
  let focused = true;

  if (!blur) {
    window.addEventListener('focus', () => {
      focused = true;
    });
    window.addEventListener('blur', () => {
      focused = false;
    });
  }

  on('init', () => {
    loop.context ??= getContext();
  });

  /**
   * Called every frame of the game loop.
   */
  function frame() {
    rAF = requestAnimationFrame(frame);

    // don't update the frame if tab isn't focused
    if (!focused) return;

    now = performance.now();
    dt = now - last;
    last = now;

    // prevent updating the game with a very large dt if the game
    // were to lose focus and then regain focus later
    if (dt > 1e3) {
      return;
    }

    accumulator += dt;

    while (accumulator >= delta) {
      emit('tick');
      loop.update(step);

      accumulator -= delta;
    }

    clearFn(loop.context);
    loop.render();
  }

  // game loop object
  loop = {
    /**
     * Called every frame to update the game. Put all of your games update logic here.
     * @memberof GameLoop
     * @function update
     *
     * @param {Number} [dt] - The fixed dt time of 1/60 of a frame.
     */
    update,

    /**
     * Called every frame to render the game. Put all of your games render logic here.
     * @memberof GameLoop
     * @function render
     */
    render,

    /**
     * If the game loop is currently stopped.
     *
     * ```js
     * import { GameLoop } from 'kontra';
     *
     * let loop = GameLoop({
     *   // ...
     * });
     * console.log(loop.isStopped);  //=> true
     *
     * loop.start();
     * console.log(loop.isStopped);  //=> false
     *
     * loop.stop();
     * console.log(loop.isStopped);  //=> true
     * ```
     * @memberof GameLoop
     * @property {Boolean} isStopped
     */
    isStopped: true,

    /**
     * The context the game loop will clear. Defaults to [core.getContext()](api/core#getCcontext).
     *
     * @memberof GameLoop
     * @property {CanvasRenderingContext2D} context
     */
    context,

    /**
     * Start the game loop.
     * @memberof GameLoop
     * @function start
     */
    start() {
      if (this.isStopped) {
        last = performance.now();
        this.isStopped = false;
        requestAnimationFrame(frame);
      }
    },

    /**
     * Stop the game loop.
     * @memberof GameLoop
     * @function stop
     */
    stop() {
      this.isStopped = true;
      cancelAnimationFrame(rAF);
    },

    // expose properties for testing
  };

  return loop;
}
let gamepaddownCallbacks = {};
let gamepadupCallbacks = {};

/**
 * A map of Gamepad button indices to button names. Modify this object to expand the list of [available buttons](api/gamepad#available-buttons). By default, the map uses the Xbox and PS4 controller button indicies.
 *
 * ```js
 * import { gamepadMap, gamepadPressed } from 'kontra';
 *
 * gamepadMap[2] = 'buttonWest';
 *
 * if (gamepadPressed('buttonWest')) {
 *   // handle west face button
 * }
 * ```
 * @property {{[key: Number]: String}} gamepadMap
 */
let gamepadMap = {
  0: 'south',
  1: 'east',
  2: 'west',
  3: 'north',
  4: 'leftshoulder',
  5: 'rightshoulder',
  6: 'lefttrigger',
  7: 'righttrigger',
  8: 'select',
  9: 'start',
  10: 'leftstick',
  11: 'rightstick',
  12: 'dpadup',
  13: 'dpaddown',
  14: 'dpadleft',
  15: 'dpadright'
};

/**
 * Register a function to be called when a gamepad button is pressed. Takes a single button or an array of buttons. Is passed the [Gamepad](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad) and the [GamepadButton](https://developer.mozilla.org/en-US/docs/Web/API/GamepadButton), and the buttonName that was pressed as parameters.
 *
 * When registering the function, you have the choice of registering to a specific gamepad or to all gamepads. To register to a specific gamepad, pass the desired gamepad index as the `gamepad` option. If the `gamepad` option is ommited the callback is bound to all gamepads instead of a specific one.
 *
 * You can register a callback for both a specific gamepad and for all gamepads in two different calls. When this happens, the specific gamepad callback will be called first and then the global one.
 *
 * ```js
 * import { initGamepad, onGamepad } from 'kontra';
 *
 * initGamepad();
 *
 * onGamepad('start', function(gamepad, button, buttonName) {
 *   // pause the game
 * });
 * onGamepad(['south', 'rightstick'], function(gamepad, button, buttonName) {
 *   // fire gun
 * });
 *
 * onGamepad('south', function() {
 *   // handle south button
 * }, {
 *   gamepad: 0  // register just for the gamepad at index 0
 * });
 * ```
 * @function onGamepad
 *
 * @param {String|String[]} buttons - Button or buttons to register callback for.
 * @param {(gamepad: Gamepad, button: GamepadButton, buttonName: string) => void} callback - The function to be called when the button is pressed.
 * @param {Object} [options] - Register options.
 * @param {Number} [options.gamepad] - Gamepad index. Defaults to registerting for all gamepads.
 * @param {'gamepaddown'|'gamepadup'} [options.handler='gamepaddown'] - Whether to register to the gamepaddown or gamepadup event.
 */
function onGamepad(
  buttons,
  callback,
  { gamepad, handler = 'gamepaddown' } = {}
) {
  let callbacks =
    handler == 'gamepaddown'
      ? gamepaddownCallbacks
      : gamepadupCallbacks;

  // smaller than doing `Array.isArray(buttons) ? buttons : [buttons]`
  [].concat(buttons).map(button => {
    if (isNaN(gamepad)) {
      callbacks[button] = callback;
    } else {
      callbacks[gamepad] = callbacks[gamepad] || {};
      callbacks[gamepad][button] = callback;
    }
  });
}

/**
 * A map of gesture objects to gesture names. Add to this object to expand the list of [available gestures](api/gesture#available-gestures).
 *
 * The gesture name should be the overall name of the gesture (e.g. swipe, pinch) and not include any directional information (e.g. left, in).
 *
 * A gesture object should have a `touches` property and at least one touch event function. The provided gestures also have a `threshold` property which is the minimum distance before the gesture is recognized.
 *
 * The `touches` property is a number that indicates how many touch points are required for the gesture. A touch event function is a function whose name should match the touch event name it triggers on (e.g. touchstart, touchmove). A touch event function is passed a touch object.
 *
 * A gesture can have multiple touch event functions, but one of them must return the direction of the gesture (e.g. left, in). The gesture name and the gesture direction are combined together as the callback name for [onGesture](api/gesture#onGesture) (e.g. swipeleft, pinchin).
 *
 * A touch object is an array-like object where each index is a touch. A touch has the current `x` and `y` position of the touch and a `start` property which has the initial start `x` and `y` position.
 *
 * ```js
 * import { gestureMap, onGesture } from 'kontra';
 *
 * // pan is the name of the gesture
 * gestureMap.pan = {
 *   // panning uses 1 touch
 *   touches: 1,
 *   // panning is triggered on touchmove
 *   touchmove({ 0: touch }) {
 *     let x = touch.x - touch.start.x;
 *     let y = touch.y - touch.start.y;
 *     let absX = Math.abs(x);
 *     let absY = Math.abs(y);
 *
 *     // return the direction the pan
 *     return absX > absY
 *       ? x < 0 ? 'left' : 'right'
 *       : y < 0 ? 'up' : 'down'
 *   }
 * };
 *
 * // the gesture name and direction are combined as the callback name
 * onGesture('panleft', function(e, touches) {
 *   // handle panleft gesture
 * });
 * ```
 * @property {{[name: String]: {touches: Number, touchstart?: Function, touchmove?: Function, touchend?: Function, [prop: String]: any}}} gestureMap
 */
let gestureMap = {
  swipe: {
    touches: 1,
    threshold: 10,
    touchend({ 0: touch }) {
      let x = touch.x - touch.start.x;
      let y = touch.y - touch.start.y;
      let absX = Math.abs(x);
      let absY = Math.abs(y);
      if (absX < this.threshold && absY < this.threshold) return;

      return absX > absY
        ? x < 0
          ? 'left'
          : 'right'
        : y < 0
        ? 'up'
        : 'down';
    }
  },
  pinch: {
    touches: 2,
    threshold: 2,
    touchstart({ 0: touch0, 1: touch1 }) {
      this.prevDist = Math.hypot(
        touch0.x - touch1.x,
        touch0.y - touch1.y
      );
    },
    touchmove({ 0: touch0, 1: touch1 }) {
      let dist = Math.hypot(touch0.x - touch1.x, touch0.y - touch1.y);
      if (Math.abs(dist - this.prevDist) < this.threshold) return;

      let dir = dist > this.prevDist ? 'out' : 'in';
      this.prevDist = dist;
      return dir;
    }
  }
};

/**
 * A simple keyboard API. You can use it move the main sprite or respond to a key press.
 *
 * ```js
 * import { initKeys, keyPressed } from 'kontra';
 *
 * // this function must be called first before keyboard
 * // functions will work
 * initKeys();
 *
 * function update() {
 *   if (keyPressed('arrowleft')) {
 *     // move left
 *   }
 * }
 * ```
 * @sectionName Keyboard
 */

/**
 * Below is a list of keys that are provided by default. If you need to extend this list, you can use the [keyMap](api/keyboard#keyMap) property.
 *
 * - a-z
 * - 0-9
 * - enter, esc, space, arrowleft, arrowup, arrowright, arrowdown
 * @sectionName Available Keys
 */

let keydownCallbacks = {};
let keyupCallbacks = {};
let pressedKeys = {};

/**
 * A map of [KeyboardEvent code values](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values) to key names. Add to this object to expand the list of [available keys](api/keyboard#available-keys).
 *
 * ```js
 * import { keyMap, onKey } from 'kontra';
 *
 * keyMap['ControlRight'] = 'ctrl';
 *
 * onKey('ctrl', function(e) {
 *   // handle ctrl key
 * });
 * ```
 * @property {{[key in (String|Number)]: String}} keyMap
 */
let keyMap = {
  // named keys
  Enter: 'enter',
  Escape: 'esc',
  Space: 'space',
  ArrowLeft: 'arrowleft',
  ArrowUp: 'arrowup',
  ArrowRight: 'arrowright',
  ArrowDown: 'arrowdown'
};

/**
 * Call the callback handler of an event.
 * @param {Function} callback
 * @param {KeyboardEvent} evt
 */
function call(callback = noop, evt) {
  if (callback._pd) {
    evt.preventDefault();
  }
  callback(evt);
}

/**
 * Execute a function that corresponds to a keyboard key.
 *
 * @param {KeyboardEvent} evt
 */
function keydownEventHandler(evt) {
  let key = keyMap[evt.code];
  let callback = keydownCallbacks[key];
  pressedKeys[key] = true;
  call(callback, evt);
}

/**
 * Set the released key to not being pressed.
 *
 * @param {KeyboardEvent} evt
 */
function keyupEventHandler(evt) {
  let key = keyMap[evt.code];
  let callback = keyupCallbacks[key];
  pressedKeys[key] = false;
  call(callback, evt);
}

/**
 * Reset pressed keys.
 */
function blurEventHandler() {
  pressedKeys = {};
}

/**
 * Initialize keyboard event listeners. This function must be called before using other keyboard functions.
 * @function initKeys
 */
function initKeys() {
  let i;

  // alpha keys
  // @see https://stackoverflow.com/a/43095772/2124254
  for (i = 0; i < 26; i++) {
    // rollupjs considers this a side-effect (for now), so we'll do it
    // in the initKeys function
    keyMap['Key' + String.fromCharCode(i + 65)] = String.fromCharCode(
      i + 97
    );
  }

  // numeric keys
  for (i = 0; i < 10; i++) {
    keyMap['Digit' + i] = keyMap['Numpad' + i] = '' + i;
  }

  window.addEventListener('keydown', keydownEventHandler);
  window.addEventListener('keyup', keyupEventHandler);
  window.addEventListener('blur', blurEventHandler);
}

/**
 * Register a function to be called when a key is pressed. Takes a single key or an array of keys. Is passed the original [KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) as a parameter.
 *
 * By default, the default action will be prevented for any bound key. To not do this, pass the `preventDefault` option.
 *
 * ```js
 * import { initKeys, onKey } from 'kontra';
 *
 * initKeys();
 *
 * onKey('p', function(e) {
 *   // pause the game
 * });
 * onKey(['enter', 'space'], function(e) {
 *   // fire gun
 * });
 * ```
 * @function onKey
 *
 * @param {String|String[]} keys - Key or keys to register.
 * @param {(evt: KeyboardEvent) => void} callback - The function to be called when the key is pressed.
 * @param {Object} [options] - Register options.
 * @param {'keydown'|'keyup'} [options.handler=keydown] - Whether to register to keydown or keyup events.
 * @param {Boolean} [options.preventDefault=true] - Call `event. preventDefault()` when the key is activated.
 */
function onKey(
  keys,
  callback,
  { handler = 'keydown', preventDefault = true } = {}
) {
  let callbacks =
    handler == 'keydown' ? keydownCallbacks : keyupCallbacks;
  // pd = preventDefault
  callback._pd = preventDefault;
  // smaller than doing `Array.isArray(keys) ? keys : [keys]`
  [].concat(keys).map(key => (callbacks[key] = callback));
}

/**
 * A wrapper for initializing and handling multiple inputs at once (keyboard, gamepad, gesture, pointer).
 *
 * ```js
 * import { initInput, onInput } from 'kontra';
 *
 * // this function must be called first before input
 * // functions will work
 * initInput();
 *
 * onInput(['arrowleft', 'swipeleft', 'dpadleft'], () => {
 *   // move left
 * });
 * ```
 * @sectionName Input
 */

/**
 * Check if string is a value of an object.
 * @param {String} value - Value to look for.
 * @param {Object} map - Object to look in.
 *
 * @returns {Boolean} True if the object contains the value, false otherwise.
 */
function contains(value, map) {
  return Object.values(map).includes(value);
}

/**
 * Check to see if input name is a gesture input.
 * @param {String} value - Value to look for.
 *
 * @returns {Boolean} True if value is a gesture input, false otherwise.
 */
function isGesture(value) {
  return Object.keys(gestureMap).some(name => value.startsWith(name));
}

/**
 * Register a function to be called on an input event. Takes a single input or an array of inputs. See the [keyboard](api/keyboard#available-keys), [gamepad](api/gamepad#available-buttons), [gesture](api/gesture#available-gestures), and [pointer](api/pointer#onPointer) docs for the lists of available input names.
 *
 * ```js
 * import { initInput, onInput } from 'kontra';
 *
 * initInput();
 *
 * onInput('p', function(e) {
 *   // pause the game
 * });
 * onInput(['enter', 'down', 'south'], function(e) {
 *   // fire gun on enter key, mouse down, or gamepad south button
 * });
 * ```
 * @function onInput
 *
 * @param {String|String[]} inputs - Inputs or inputs to register callback for.
 * @param {Function} callback -  The function to be called on the input event.
 * @param {Object} [options] - Input options.
 * @param {Object} [options.gamepad] - [onGamepad options](api/gamepad#onGamepad).
 * @param {Object} [options.key] - [onKey options](api/keyboard#onKey).
 */
function onInput(inputs, callback, { gamepad, key } = {}) {
  [].concat(inputs).map(input => {
    if (contains(input, gamepadMap)) {
      onGamepad(input, callback, gamepad);
    } else if (isGesture(input)) ; else if (contains(input, keyMap)) {
      onKey(input, callback, key);
    } else if (['down', 'up'].includes(input)) {
      onPointer(input);
    }
  });
}

let COLOR = {
    RED_6: "#AD5F52",
    RED_7: "#913636",
    YELLOW_6: "#E1C584",
    YELLOW_7: "#C89660",
    GREEN_5: "#B0B17C",
    GREEN_6: "#6B7F5C",
    BROWN_6: "#A17D5E",
    BROWN_7: "#89542F",
    BROWN_8: "#692F11",
    BLUE_6: "#64988e",
    BLUE_7: "#3d7085",
    GRAY_6: "#B4A18F",
    GRAY_7: "#796E63",
    DARK_6: "#0F2C2E",
    WHITE_6: "#ECDDBA",
};

function drawPolygon(ctx, points, fill, offsetX, offsetY) {
    let pointArray = points.split(" ").reduce((acc, cur, i, arr) => {
        if (i % 2 === 0) {
            acc.push({
                x: parseFloat(cur),
                y: parseFloat(arr[i + 1]),
            });
        }
        return acc;
    }, []);
    ctx.beginPath();
    ctx.moveTo(pointArray[0].x + (offsetX ?? 0), pointArray[0].y + (offsetY ?? 0));
    for (let i = 1; i < pointArray.length; i++) {
        ctx.lineTo(pointArray[i].x + (offsetX ?? 0), pointArray[i].y + (offsetY ?? 0));
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.closePath();
}
function drawRect(ctx, x, y, width, height, fill, offsetX, offsetY) {
    ctx.beginPath();
    ctx.rect(x + (0), y + (0), width, height);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.closePath();
}

class Templar extends GameObject {
    constructor({ x, y, scale = 1, withWeapon = false }) {
        super({ x, y });
        this.setScale(scale);
        this.withWeapon = withWeapon;
    }
    draw() {
        if (this.withWeapon) {
            drawPolygon(this.context, "30 0 0 9 0 45 6 57 30 69 54 57 57 45 57 9 30 0", COLOR.BROWN_7, 36, 30);
        }
        drawPolygon(this.context, "9 0 17 0 16 9 10 12 0 12 9 0", COLOR.RED_7, 55, 61);
        drawPolygon(this.context, "54 43 56 41 64 28 52 0 19 0 0 33 16 41 16 74 26 74 27 71 43 62 55 74 66 74 54 43", COLOR.GRAY_7, 0, 34);
        drawPolygon(this.context, "0 12 7 12 10 0 0 0 0 12", COLOR.RED_7, 16, 108);
        drawPolygon(this.context, "0 0 5 6 5 12 12 12 12 1 11 0 0 0", COLOR.RED_7, 55, 108);
        drawPolygon(this.context, "42 49 41 12 39 0 33 0 36 12 9 12 9 0 3 0 1 49 0 64 47 64 42 49", COLOR.YELLOW_7, 15, 34);
        drawPolygon(this.context, "42 7 33 0 7 0 0 8 0 36 14 42 38 42 42 38 42 7", COLOR.GRAY_6, 18, 0);
        drawPolygon(this.context, "0 0 13 0 19 0 23 0 23 5 19 5 19 22 13 22 13 5 0 5 0 0", COLOR.BROWN_8, 37, 14);
        drawPolygon(this.context, "12 4 8 4 8 0 4 0 4 4 0 4 0 7 4 7 4 17 8 17 8 7 12 7 12 4", COLOR.RED_7, 38, 51);
        drawRect(this.context, 16, 75, 40, 7, "#ae5d40");
        if (this.withWeapon) {
            drawPolygon(this.context, "5 0 0 15 1 74 5 74 8 74 10 15 5 0", COLOR.WHITE_6, 16, -16);
        }
        drawPolygon(this.context, "2 3 0 11 14 13 20 8 18 1 10 0 2 3", COLOR.RED_7, 7, 59);
    }
}

let FONT = "Trebuchet MS";
let COMMON_TEXT_CONFIG = {
    color: COLOR.WHITE_6,
    font: `12px ${FONT}`,
    anchor: { x: 0.5, y: 0.5 },
};
let INFO_TEXT_CONFIG = {
    color: COLOR.BROWN_7,
    font: `12px ${FONT}`,
};

let EVENT = {
    SWIPE: "s",
    SWIPE_FINISH: "s_f",
    ITEMS_UPDATED: "i_u",
    ENEMY_DEAD: "e_d",
    REMOVE_ENEMY_DEAD: "r_e_d",
    UPDATE_TEMPLAR_CLASS: "u_t_c",
    UPDATE_TEMPLAR_INFO: "u_t_i",
    UPDATE_TEMPLAR_WEIGHT: "u_t_w",
    GAME_OVER: "g_o",
};

var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
})(Direction || (Direction = {}));

// @ts-nocheck
// zzfx() - the universal entry point -- returns a AudioBufferSourceNode
let zzfx = (...t) => zzfxP(zzfxG(...t));
// zzfxP() - the sound player -- returns a AudioBufferSourceNode
let zzfxP = (...t) => {
    let e = zzfxX.createBufferSource(), f = zzfxX.createBuffer(t.length, t[0].length, zzfxR);
    t.map((d, i) => f.getChannelData(i).set(d)),
        (e.buffer = f),
        e.connect(zzfxX.destination),
        e.start();
    return e;
};
// zzfxG() - the sound generator -- returns an array of sample data
let zzfxG = (q = 1, k = 0.05, c = 220, e = 0, t = 0, u = 0.1, r = 0, F = 1, v = 0, z = 0, w = 0, A = 0, l = 0, B = 0, x = 0, G = 0, d = 0, y = 1, m = 0, C = 0) => {
    let b = 2 * Math.PI, H = (v *= (500 * b) / zzfxR ** 2), I = ((0 < x ? 1 : -1) * b) / 4, D = (c *= ((1 + 2 * k * Math.random() - k) * b) / zzfxR), Z = [], g = 0, E = 0, a = 0, n = 1, J = 0, K = 0, f = 0, p, h;
    e = 99 + zzfxR * e;
    m *= zzfxR;
    t *= zzfxR;
    u *= zzfxR;
    d *= zzfxR;
    z *= (500 * b) / zzfxR ** 3;
    x *= b / zzfxR;
    w *= b / zzfxR;
    A *= zzfxR;
    l = (zzfxR * l) | 0;
    for (h = (e + m + t + u + d) | 0; a < h; Z[a++] = f)
        ++K % ((100 * G) | 0) ||
            ((f = r
                ? 1 < r
                    ? 2 < r
                        ? 3 < r
                            ? Math.sin((g % b) ** 3)
                            : Math.max(Math.min(Math.tan(g), 1), -1)
                        : 1 - (((((2 * g) / b) % 2) + 2) % 2)
                    : 1 - 4 * Math.abs(Math.round(g / b) - g / b)
                : Math.sin(g)),
                (f =
                    (l ? 1 - C + C * Math.sin((2 * Math.PI * a) / l) : 1) *
                        (0 < f ? 1 : -1) *
                        Math.abs(f) ** F *
                        q *
                        zzfxV *
                        (a < e
                            ? a / e
                            : a < e + m
                                ? 1 - ((a - e) / m) * (1 - y)
                                : a < e + m + t
                                    ? y
                                    : a < h - d
                                        ? ((h - a - d) / u) * y
                                        : 0)),
                (f = d
                    ? f / 2 +
                        (d > a ? 0 : ((a < h - d ? 1 : (h - a) / d) * Z[(a - d) | 0]) / 2)
                    : f)),
            (p = (c += v += z) * Math.sin(E * x - I)),
            (g += p - p * B * (1 - ((1e9 * (Math.sin(a) + 1)) % 2))),
            (E += p - p * B * (1 - ((1e9 * (Math.sin(a) ** 2 + 1)) % 2))),
            n && ++n > A && ((c += w), (D += w), (n = 0)),
            !l || ++J % l || ((c = D), (v = H), (n = n || 1));
    return Z;
};
// zzfxV - global volume
let zzfxV = 0.3;
// zzfxR - global sample rate
let zzfxR = 44100;
// zzfxX - the common audio context
let zzfxX = new (window.AudioContext || webkitAudioContext)();
//! ZzFXM (v2.0.3) | (C) Keith Clark | MIT | https://github.com/keithclark/ZzFXM
let zzfxM = (n, f, t, e = 125) => {
    let l, o, z, r, g, h, x, a, u, c, i, m, p, G, M = 0, R = [], b = [], j = [], k = 0, q = 0, s = 1, v = {}, w = ((zzfxR / e) * 60) >> 2;
    for (; s; k++)
        (R = [(s = a = m = 0)]),
            t.map((e, d) => {
                for (x = f[e][k] || [0, 0, 0],
                    s |= !!f[e][k],
                    G = m + (f[e][0].length - 2 - !a) * w,
                    p = d == t.length - 1,
                    o = 2,
                    r = m; o < x.length + p; a = ++o) {
                    for (g = x[o],
                        u = (o == x.length + p - 1 && p) || (c != (x[0] || 0)) | g | 0,
                        z = 0; z < w && a; z++ > w - 99 && u ? (i += (i < 1) / 99) : 0)
                        (h = ((1 - i) * R[M++]) / 2 || 0),
                            (b[r] = (b[r] || 0) - h * q + h),
                            (j[r] = (j[r++] || 0) + h * q + h);
                    g &&
                        ((i = g % 1),
                            (q = x[1] || 0),
                            (g |= 0) &&
                                (R = v[[(c = x[(M = 0)] || 0), g]] =
                                    v[[c, g]] ||
                                        ((l = [...n[c]]),
                                            (l[2] *= 2 ** ((g - 12) / 12)),
                                            g > 0 ? zzfxG(...l) : [])));
                }
                m = G;
            });
    return [b, j];
};

let bgm = [
    [
        [1, 0, 400],
        [1, 0, 4e3, , , 0.03, 2, 1.25, , , , , 0.02, 6.8, -0.3, , 0.5],
        [1, 0, 360, , , 0.12, 2, 2, , , , , , 9, , 0.1],
    ],
    [
        [
            [
                2,
                -1,
                ,
                ,
                ,
                20,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                20,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                20,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                20,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                20,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                20,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                20,
                ,
                ,
                ,
                ,
                ,
                ,
                ,
                20,
                ,
                ,
                ,
                ,
                ,
                ,
            ],
            [
                1,
                1,
                ,
                ,
                ,
                ,
                ,
                20,
                ,
                20,
                ,
                ,
                ,
                ,
                ,
                20,
                ,
                20,
                ,
                ,
                ,
                ,
                ,
                20,
                ,
                20,
                ,
                ,
                ,
                ,
                ,
                20,
                ,
                20,
                ,
                ,
                ,
                ,
                ,
                20,
                ,
                20,
                ,
                ,
                ,
                ,
                ,
                20,
                ,
                20,
                ,
                ,
                ,
                ,
                ,
                20,
                ,
                20,
                ,
                ,
                ,
                ,
                ,
                20,
                ,
                20,
                ,
                ,
            ],
            [
                ,
                ,
                ,
                ,
                ,
                12,
                ,
                12,
                12,
                15,
                ,
                15,
                15,
                8,
                ,
                8,
                8,
                10,
                12,
                13,
                12,
                12,
                ,
                12,
                12,
                15,
                ,
                15,
                17,
                8,
                ,
                8,
                8,
                10,
                11,
                13,
                12,
                12,
                ,
                12,
                12,
                15,
                ,
                15,
                15,
                8,
                ,
                8,
                8,
                10,
                12,
                13,
                12,
                12,
                ,
                12,
                12,
                15,
                ,
                15,
                15,
                20,
                ,
                ,
                ,
                ,
                ,
                ,
            ],
        ],
    ],
    [0],
    84,
];

class SwipeDetector {
    constructor(options) {
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: options
        });
        Object.defineProperty(this, "startX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "startY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "threshold", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 50
        });
        this.addEventListeners();
    }
    addEventListeners() {
        window.addEventListener("touchstart", this.onStart.bind(this));
        window.addEventListener("touchend", this.onEnd.bind(this));
        window.addEventListener("touchmove", this.preventDefault.bind(this));
    }
    onStart(event) {
        let point = this.getPoint(event);
        this.startX = point.clientX;
        this.startY = point.clientY;
    }
    onEnd(event) {
        let point = this.getPoint(event);
        let diffX = point.clientX - this.startX;
        let diffY = point.clientY - this.startY;
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.threshold) {
            diffX > 0 ? this.options.onSwipeRight?.() : this.options.onSwipeLeft?.();
        }
        else if (Math.abs(diffY) > this.threshold) {
            diffY > 0 ? this.options.onSwipeDown?.() : this.options.onSwipeUp?.();
        }
    }
    getPoint(event) {
        return event instanceof TouchEvent ? event.changedTouches[0] : event;
    }
    preventDefault(event) {
        event.preventDefault();
    }
}

var GameState;
(function (GameState) {
    GameState[GameState["INIT"] = 0] = "INIT";
    GameState[GameState["IDLE"] = 1] = "IDLE";
    GameState[GameState["SWIPING"] = 2] = "SWIPING";
    GameState[GameState["GAME_OVER"] = 3] = "GAME_OVER";
})(GameState || (GameState = {}));
var TemplarClass;
(function (TemplarClass) {
    TemplarClass[TemplarClass["KNIGHT"] = 0] = "KNIGHT";
    TemplarClass[TemplarClass["WIZARD"] = 1] = "WIZARD";
    TemplarClass[TemplarClass["DEFENDER"] = 2] = "DEFENDER";
})(TemplarClass || (TemplarClass = {}));
class GameManager {
    get level() {
        return Math.floor(this.moveCount / 5);
    }
    constructor() {
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: GameState.INIT
        });
        Object.defineProperty(this, "moveCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "currentItems", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "reusableEnemyCards", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "cls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        new SwipeDetector({
            onSwipeLeft: this.swipe.bind(this, Direction.LEFT),
            onSwipeRight: this.swipe.bind(this, Direction.RIGHT),
            onSwipeUp: this.swipe.bind(this, Direction.UP),
            onSwipeDown: this.swipe.bind(this, Direction.DOWN),
        });
        onInput(["arrowleft", "a"], this.swipe.bind(this, Direction.LEFT));
        onInput(["arrowright", "d"], this.swipe.bind(this, Direction.RIGHT));
        onInput(["arrowup", "w"], this.swipe.bind(this, Direction.UP));
        onInput(["arrowdown", "s"], this.swipe.bind(this, Direction.DOWN));
        on(EVENT.SWIPE_FINISH, () => {
            if (this.state === GameState.GAME_OVER)
                return;
            this.state = GameState.IDLE;
        });
        on(EVENT.ENEMY_DEAD, this.onEnemyDead.bind(this));
    }
    static getInstance() {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }
    setClass(cls) {
        this.cls = cls;
        this.playBGM();
        emit(EVENT.UPDATE_TEMPLAR_CLASS, cls);
        this.state = GameState.IDLE;
    }
    playBGM() {
        // TODO: click to play music
        // @ts-ignore
        let music = zzfxP(...zzfxM(...bgm));
        music.loop = true;
    }
    swipe(direction) {
        if (this.state !== GameState.IDLE)
            return;
        this.moveCount++;
        this.state = GameState.SWIPING;
        zzfx(...[3, , 576, , , 0.007, 1, 0.6, , , -273, , , , , , , 0.64]);
        emit(EVENT.SWIPE, direction);
    }
    addItems(itemCards) {
        itemCards.forEach((item) => {
            if (this.cls === TemplarClass.DEFENDER)
                item.duration = Math.min(4, item.duration);
            this.currentItems.push(item);
        });
        emit(EVENT.ITEMS_UPDATED, itemCards, []);
    }
    removeItems(itemCards) {
        // remove from current items
        let newCurrentItem = this.currentItems.filter((item) => !itemCards.includes(item));
        this.currentItems = newCurrentItem;
        emit(EVENT.ITEMS_UPDATED, [], itemCards);
    }
    onEnemyDead(card) {
        this.reusableEnemyCards.push(card);
        emit(EVENT.REMOVE_ENEMY_DEAD, card);
    }
    gameOver() {
        this.state = GameState.GAME_OVER;
        emit(EVENT.GAME_OVER);
    }
}

let GRID_SIZE = 100;

let ITEM_PER_PAGE = 4;
class ItemPanel extends Sprite {
    // private pageIdx = 0;
    constructor(x, y) {
        super({
            x,
            y,
            width: 462,
            height: 136,
            color: COLOR.YELLOW_7,
        });
        let titleText = factory$7({
            text: "Items",
            x: 12,
            y: 9,
            ...INFO_TEXT_CONFIG,
        });
        this.addChild([titleText]);
        on(EVENT.ITEMS_UPDATED, this.onItemsUpdated.bind(this));
    }
    onItemsUpdated(added, removed) {
        if (added.length > 0)
            this.addChild(added);
        if (removed.length > 0)
            this.removeChild(removed);
        // this.pageIdx = 0;
        let gm = GameManager.getInstance();
        // mark all items as invisible
        gm.currentItems.forEach((item) => item.setInactive(0));
        // show first 4 items
        gm.currentItems
            .sort((a, b) => a.duration - b.duration)
            .slice(0, ITEM_PER_PAGE)
            .forEach((item, index) => item.setActive(60 + index * (GRID_SIZE + 4), 76));
    }
}

let INFO_PANEL_HEIGHT = 200;
class InfoPanel extends GameObject {
    constructor(x, y) {
        super({ x, y });
        Object.defineProperty(this, "classText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "infoText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "overweightText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        let bg = factory$8({
            x: 0,
            y: 0,
            color: COLOR.YELLOW_6,
            width: this.context.canvas.width,
            height: INFO_PANEL_HEIGHT,
        });
        let textProps = {
            text: "",
            font: `12px ${FONT}`,
            color: COLOR.BROWN_7,
        };
        this.classText = factory$7({
            x: 120,
            y: 10,
            ...textProps,
        });
        this.infoText = factory$7({
            x: 120,
            y: 28,
            ...textProps,
        });
        this.overweightText = factory$7({
            x: 56,
            y: 34,
            anchor: { x: 0.5, y: 0.5 },
            ...textProps,
            color: COLOR.BROWN_8,
        });
        this.addChild([
            bg,
            new Templar({ x: 8, y: 62, withWeapon: true }),
            new ItemPanel(120, 46),
            this.classText,
            this.infoText,
            this.overweightText,
        ]);
        on(EVENT.UPDATE_TEMPLAR_CLASS, this.updateClassText.bind(this));
        on(EVENT.UPDATE_TEMPLAR_INFO, this.updateTemplarInfo.bind(this));
        on(EVENT.UPDATE_TEMPLAR_WEIGHT, this.updateOverweightText.bind(this));
    }
    updateClassText(cls) {
        switch (cls) {
            case TemplarClass.WIZARD:
                this.classText.text =
                    "Wizard: low attack, equip potion to attack all enemies";
                break;
            case TemplarClass.KNIGHT:
                this.classText.text = "Knight: everything is normal but balanced";
                break;
            case TemplarClass.DEFENDER:
                this.classText.text =
                    "Defender: low attack, attack around, hit back with shield";
                break;
        }
    }
    updateTemplarInfo(templarCard) {
        let texts = [
            `Attack: ${templarCard.attackType}`,
            `Range: ${templarCard.attackDirection}`,
            `Hit Rate: ${(templarCard.hitRate * 100).toFixed()}%`,
            `Critical Rate: ${(templarCard.criticalRate * 100).toFixed()}%`,
            `Hit Back: ${templarCard.hitBackAttack}`,
        ];
        this.infoText.text = texts.join(" | ");
    }
    updateOverweightText(isOverweight) {
        this.overweightText.text = isOverweight ? "Overweight!!!" : "";
    }
}

class Grid extends Sprite {
    constructor({ x, y, coord }) {
        super({
            x,
            y,
            width: GRID_SIZE,
            height: GRID_SIZE,
            color: COLOR.GRAY_6,
            anchor: { x: 0.5, y: 0.5 },
        });
        Object.defineProperty(this, "coord", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.coord = coord;
    }
}

var CardType;
(function (CardType) {
    CardType[CardType["TEMPLAR"] = 0] = "TEMPLAR";
    CardType[CardType["ENEMY"] = 1] = "ENEMY";
    CardType[CardType["WEAPON"] = 2] = "WEAPON";
    CardType[CardType["SHIELD"] = 3] = "SHIELD";
    CardType[CardType["POTION"] = 4] = "POTION";
})(CardType || (CardType = {}));
var Belongs;
(function (Belongs) {
    Belongs[Belongs["PLAYER"] = 0] = "PLAYER";
    Belongs[Belongs["ENEMY"] = 1] = "ENEMY";
})(Belongs || (Belongs = {}));

class SwordIcon extends GameObject {
    constructor(x, y, scale = 0.5) {
        super({ x, y });
        this.setScale(scale);
    }
    draw() {
        drawPolygon(this.context, "10 18 23 5 24 0 19 1 6 14 4 13 2 15 4 17 0 22 1 23 2 24 7 20 9 22 11 20 10 18", COLOR.WHITE_6);
    }
}

function tween(obj, config, duration, delay = 0) {
    return new Promise((resolve) => {
        let { targetX, targetY, opacity } = config;
        let fps = 60; // Frames per second
        let steps = fps * (duration / 1000); // Total number of steps
        let stepX = targetX === undefined ? 0 : (targetX - obj.x) / steps;
        let stepY = targetY === undefined ? 0 : (targetY - obj.y) / steps;
        let stepOpacity = opacity === undefined ? 0 : (opacity - obj.opacity) / steps;
        let currentStep = 0;
        function step() {
            if (currentStep < steps) {
                obj.x += stepX;
                obj.y += stepY;
                obj.opacity += stepOpacity;
                currentStep++;
                setTimeout(step, duration / steps);
            }
            else {
                // Ensure final positions are exact
                obj.x = targetX === undefined ? obj.x : targetX;
                obj.y = targetY === undefined ? obj.y : targetY;
                obj.opacity = opacity === undefined ? obj.opacity : opacity;
                // Wait for the delay period before resolving the promise
                setTimeout(resolve, delay);
            }
        }
        step(); // Start the animation
    });
}

var CardPart;
(function (CardPart) {
    CardPart[CardPart["BACKGROUND"] = 0] = "BACKGROUND";
    CardPart[CardPart["CIRCLE"] = 1] = "CIRCLE";
})(CardPart || (CardPart = {}));
class BaseCard extends Sprite {
    constructor({ type, x, y }) {
        super({
            x,
            y,
            width: GRID_SIZE,
            height: GRID_SIZE,
            anchor: { x: 0.5, y: 0.5 },
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "main", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isActive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "mainIcon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.type = type;
        this.setScale(0);
        this.main = factory$8({
            width: GRID_SIZE,
            height: GRID_SIZE,
            color: getCardColor(type, CardPart.BACKGROUND),
            anchor: { x: 0.5, y: 0.5 },
        });
        this.addChild(this.main);
        let circle = factory$8({
            radius: 24,
            color: getCardColor(type, CardPart.CIRCLE),
            anchor: { x: 0.5, y: 0.5 },
            y: this.type === CardType.TEMPLAR
                ? 0
                : this.type === CardType.ENEMY
                    ? -14
                    : -20,
        });
        this.mainIcon = this.getMainIcon();
        this.main.addChild([circle, this.mainIcon]);
    }
    async moveTo(x, y) {
        await tween(this, { targetX: x, targetY: y }, 100);
    }
    async setInactive(ms = 200) {
        await this.setChildrenOpacity(0, ms);
        this.isActive = false;
    }
    setActive(x, y) {
        this.x = x;
        this.y = y;
        this.setChildrenOpacity(1, 200);
        this.isActive = true;
    }
    reset() {
        // for reusing
        this.isActive = true;
        this.setChildrenOpacity(1, 0);
        this.setScale(0);
        this.resetProps();
    }
    async setChildrenOpacity(opacity, duration) {
        await Promise.all([
            tween(this, { opacity }, duration),
            tween(this.main, { opacity }, duration),
            ...this.children.map((child) => tween(child, { opacity }, duration)),
            ...this.main.children.map((child) => tween(child, { opacity }, duration)),
        ]);
    }
    update() {
        // When generating the card
        if (this.scaleX <= 1) {
            this.scaleX += 0.1;
            this.scaleY += 0.1;
            if (this.scaleX > 1)
                this.setScale(1);
        }
    }
    render() {
        if (this.opacity < 0)
            return;
        super.render();
    }
}
// Utils
function getCardColor(type, part) {
    switch (type) {
        case CardType.TEMPLAR:
            switch (part) {
                case CardPart.BACKGROUND:
                    return COLOR.YELLOW_7;
                case CardPart.CIRCLE:
                    return COLOR.YELLOW_6;
            }
        case CardType.ENEMY:
            switch (part) {
                case CardPart.BACKGROUND:
                    return COLOR.RED_7;
                case CardPart.CIRCLE:
                    return COLOR.RED_6;
            }
        case CardType.WEAPON:
            switch (part) {
                case CardPart.BACKGROUND:
                    return COLOR.BLUE_7;
                case CardPart.CIRCLE:
                    return COLOR.BLUE_6;
            }
        case CardType.SHIELD:
            switch (part) {
                case CardPart.BACKGROUND:
                    return COLOR.BROWN_7;
                case CardPart.CIRCLE:
                    return COLOR.BROWN_6;
            }
        case CardType.POTION:
            switch (part) {
                case CardPart.BACKGROUND:
                    return COLOR.GREEN_6;
                case CardPart.CIRCLE:
                    return COLOR.GREEN_5;
            }
    }
}

class HeartIcon extends GameObject {
    constructor(x, y) {
        super({ x, y });
    }
    draw() {
        drawPolygon(this.context, "20 0 13 3 7 0 0 9 13 23 26 9 20 0", COLOR.BROWN_8);
    }
}

class ShieldIcon extends GameObject {
    constructor(x, y, scale, color = COLOR.BROWN_7) {
        super({ x, y });
        this.setScale(scale ?? 1);
        this.color = color;
    }
    draw() {
        drawPolygon(this.context, "10 0 0 3 0 15 2 19 10 23 17 19 19 15 19 3 10 0", this.color);
    }
}

var AttackDirection;
(function (AttackDirection) {
    AttackDirection["FRONT"] = "front";
    AttackDirection["LINE"] = "line";
    AttackDirection["AROUND"] = "around";
})(AttackDirection || (AttackDirection = {}));
var AttackType;
(function (AttackType) {
    AttackType["NORMAL"] = "normal";
    AttackType["PENETRATE"] = "penetrate";
})(AttackType || (AttackType = {}));

function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

class CharacterCard extends BaseCard {
    constructor({ type, x, y, belongs }) {
        super({ type, x, y });
        Object.defineProperty(this, "attackText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "healthText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shieldText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "impactText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "belongs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "health", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "shield", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "attack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "hitRate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "criticalRate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "attackDirection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: AttackDirection.FRONT
        });
        Object.defineProperty(this, "hitBackAttack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "attackType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: AttackType.NORMAL
        });
        this.belongs = belongs;
        this.color = COLOR.DARK_6;
        this.attackText = factory$7({
            text: `${this.attack}`,
            x: 42,
            y: 39,
            ...COMMON_TEXT_CONFIG,
        });
        this.healthText = factory$7({
            text: `${this.health}`,
            x: -33,
            y: -34,
            ...COMMON_TEXT_CONFIG,
        });
        this.shieldText = factory$7({
            text: `${this.shield}`,
            x: 37,
            y: -34,
            ...COMMON_TEXT_CONFIG,
        });
        this.impactText = new ImpactText(0);
        this.main.addChild([
            new SwordIcon(20, 30),
            this.attackText,
            new HeartIcon(-46, -46),
            this.healthText,
            new ShieldIcon(28, -46),
            this.shieldText,
            this.impactText,
        ]);
    }
    async execAttack(direction, target, isHitBack = false, isPenetrate = false) {
        if (target.health <= 0 || this.health <= 0)
            return;
        let origX = this.x;
        let origY = this.y;
        await tween(this.main, { targetX: -5, targetY: -10 }, 100, 700);
        if ([Direction.RIGHT, Direction.LEFT].includes(direction)) {
            let xFactor = direction === Direction.RIGHT ? -1 : 1;
            await tween(this, { targetX: this.x + 10 * xFactor, targetY: this.y }, 50);
            await tween(this, { targetX: this.x - 30 * xFactor, targetY: this.y }, 40);
        }
        else {
            let yFactor = direction === Direction.DOWN ? -1 : 1;
            await tween(this, { targetX: this.x, targetY: this.y + 10 * yFactor }, 50);
            await tween(this, { targetX: this.x, targetY: this.y - 30 * yFactor }, 40);
        }
        zzfx(...[3, , 179, , 0.03, 0.06, , 2.8, , , , , , 0.5, 25, , , 0.46, 0.05]);
        await tween(this, { targetX: origX, targetY: origY }, 50, 400);
        let counterDirection = () => {
            switch (direction) {
                case Direction.RIGHT:
                    return Direction.LEFT;
                case Direction.LEFT:
                    return Direction.RIGHT;
                case Direction.UP:
                    return Direction.DOWN;
                case Direction.DOWN:
                    return Direction.UP;
            }
        };
        await Promise.all([
            tween(this.main, { targetX: 0, targetY: 0 }, 200),
            target.applyDamage(this, counterDirection(), isHitBack, isPenetrate),
        ]);
    }
    async applyDamage(attacker, counterDirection, isHitBack = false, isPenetrate = false, wizardAttack = 0) {
        let { attack, hitBackAttack, hitRate, criticalRate } = attacker;
        let isHit = Math.random() <= hitRate;
        if (!isHit) {
            await this.impactText.show("Miss");
            if (this.hitBackAttack > 0 && !isHitBack && !wizardAttack)
                await this.execAttack(counterDirection, attacker, true, false);
            return;
        }
        let isCritical = Math.random() <= criticalRate;
        let damage = isHitBack
            ? hitBackAttack
            : wizardAttack > 0
                ? wizardAttack
                : attack;
        let calculatedDamage = isCritical ? damage * 2 : damage;
        if (isCritical) {
            await this.impactText.show(`Critical -${calculatedDamage}`);
        }
        else {
            await this.impactText.show(`-${calculatedDamage}`);
        }
        let remainingDamage = isPenetrate
            ? calculatedDamage
            : this.updateShield(-calculatedDamage);
        let isDead = this.updateHealth(-remainingDamage);
        if (!isDead && this.hitBackAttack > 0 && !isHitBack && !wizardAttack)
            await this.execAttack(counterDirection, attacker, true, false);
    }
    async applyOverweightDamage() {
        await this.impactText.show(`Overweight -1`);
        this.updateHealth(-1);
    }
    // return true if the card is dead
    updateHealth(value) {
        this.health += value;
        if (this.health <= 0) {
            this.setInactive();
            this.deathCallback();
            return true;
        }
        this.healthText.text = `${this.health}`;
    }
    updateShield(value) {
        let remainingDamage = 0;
        this.shield += value;
        if (this.shield <= 0) {
            remainingDamage = -this.shield;
            this.shield = 0;
        }
        this.shieldText.text = `${this.shield}`;
        if (this.type === CardType.TEMPLAR && this.cls === TemplarClass.DEFENDER) {
            this.hitBackAttack = this.shield;
            emit(EVENT.UPDATE_TEMPLAR_INFO, this);
        }
        return remainingDamage;
    }
    updateAttack(value) {
        this.attack += value;
        this.attackText.text = `${this.attack}`;
    }
    refreshText() {
        this.attackText.text = `${this.attack}`;
        this.healthText.text = `${this.health}`;
        this.shieldText.text = `${this.shield}`;
        this.impactText.reset();
    }
    applyBuff(buff) {
        this.updateHealth(buff.health || 0);
        this.updateShield(buff.shield || 0);
        this.updateAttack(buff.attack || 0);
        this.hitRate += buff.hitRate || 0;
        this.hitRate = Math.max(Math.min(this.hitRate, 1), 0);
        this.criticalRate += buff.criticalRate || 0;
        this.criticalRate = Math.max(Math.min(this.criticalRate, 1), 0);
        this.attackDirection = buff.attackDirection || this.attackDirection;
        this.attackType = buff.attackType || this.attackType;
        this.hitBackAttack += buff.hitBackAttack || 0;
        if (this.type === CardType.TEMPLAR)
            emit(EVENT.UPDATE_TEMPLAR_INFO, this);
        // TODO: show buff effect
    }
}
class ImpactText extends Sprite {
    set text(text) {
        this._text.text = text;
    }
    constructor(y) {
        super({
            x: 0,
            y,
            width: 100,
            height: 20,
            color: COLOR.BROWN_8,
            anchor: { x: 0.5, y: 0.5 },
            opacity: 0,
        });
        Object.defineProperty(this, "_text", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._text = factory$7({
            text: "",
            font: `16px ${FONT}`,
            color: COLOR.WHITE_6,
            anchor: { x: 0.5, y: 0.5 },
        });
        this.addChild(this._text);
    }
    async show(text) {
        this._text.text = text;
        await Promise.all([
            tween(this._text, { opacity: 1 }, 500),
            tween(this, { opacity: 1 }, 500),
            tween(this, { targetY: this.y - 10 }, 500),
        ]);
        await delay(100);
        await Promise.all([
            tween(this._text, { opacity: 0 }, 300),
            tween(this, { opacity: 0 }, 300),
        ]);
        this.y += 10;
    }
    reset() {
        this.opacity = 0;
        this._text.opacity = 0;
    }
}

function randomPick(array) {
    return array[Math.floor(Math.random() * array.length)];
}

class EnemyIcon extends GameObject {
    constructor(x, y) {
        super({ x, y });
        this.setScale(0.9);
    }
    draw() {
        drawPolygon(this.context, "10 0 0 8 0 25 5 32 6 16 2 15 3 12 8 13 8 23 10 25 11 23 11 13 16 12 17 15 13 16 14 32 19 25 19 8 10 0", COLOR.WHITE_6);
    }
}

let getEnemyPropsDescText = (buff) => getCharacterPropsDescText(buff, false);
let getItemPropsDescText = (buff) => getCharacterPropsDescText(buff, true);
let getCharacterPropsDescText = (buff, isAccurate) => {
    let buffTexts = Object.entries(buff).map(([key, value]) => {
        if (!value)
            return "";
        if (key === "attackDirection")
            return `range: ${value}`;
        if (key === "attackType")
            return `type: ${value}`;
        let percentageKeys = ["hitRate", "criticalRate"];
        if (value > 0) {
            if (!isAccurate)
                return `high ${key}`;
            if (percentageKeys.includes(key)) {
                return `${key} +${(value * 100).toFixed()}%`;
            }
            return `${key} +${value}`;
        }
        else {
            if (!isAccurate)
                return `low ${key}`;
            if (percentageKeys.includes(key)) {
                return `${key} ${(value * 100).toFixed()}%`;
            }
            return `${key} ${value}`;
        }
    });
    return buffTexts.join("\n");
};

class EnemyCard extends CharacterCard {
    constructor({ x, y }) {
        super({
            type: CardType.ENEMY,
            x,
            y,
            belongs: Belongs.ENEMY,
        });
        Object.defineProperty(this, "descriptionText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.descriptionText = factory$7({
            x: 0,
            y: 18,
            text: "",
            ...COMMON_TEXT_CONFIG,
            textAlign: "center",
        });
        this.main.addChild(this.descriptionText);
        this.resetProps();
    }
    async onWizardAttack(wizard, level) {
        let gm = GameManager.getInstance();
        let factor = gm.level + 1;
        await this.applyDamage(wizard, Direction.UP, false, wizard.attackType === AttackType.PENETRATE, level * factor);
    }
    getMainIcon() {
        return new EnemyIcon(-8, -29);
    }
    deathCallback() {
        emit(EVENT.ENEMY_DEAD, this);
    }
    resetProps() {
        let { level, moveCount, cls } = GameManager.getInstance();
        this.health = 5 + 2 * level;
        this.attack = 2 + 1 * level;
        this.shield = 0;
        this.hitRate = cls === TemplarClass.DEFENDER ? 0.7 : 0.8;
        this.criticalRate = 0.1;
        this.attackDirection = AttackDirection.FRONT;
        this.hitBackAttack = 0;
        let isElite = moveCount > 0 && moveCount % 13 === 0;
        // Add extra buff
        let { buff, desc } = randomPick(getEnemyBuffsAndDesc(level + 1, isElite));
        this.applyBuff(buff);
        this.descriptionText.text = desc;
        this.refreshText();
    }
}
let eliteCount = -1;
let getEnemyBuffsAndDesc = (factor, isElite) => {
    if (isElite) {
        let elites = [
            {
                buff: {
                    attackDirection: AttackDirection.AROUND,
                    health: 2 * factor,
                },
                desc: `"Whirlstriker"\nRange: around`,
            },
            {
                buff: {
                    attackDirection: AttackDirection.LINE,
                    attack: 2 * factor,
                    health: 1 * factor,
                },
                desc: `"Spearman"\nRange: line`,
            },
            {
                buff: {
                    hitBackAttack: 3 * factor,
                    health: 2 * factor,
                },
                desc: `"Counterstriker"\nHit back: ${3 * factor}`,
            },
            {
                buff: {
                    shield: 4 * factor,
                },
                desc: `"Guardian"\nShield: ${4 * factor}`,
            },
            {
                buff: {
                    attackType: AttackType.PENETRATE,
                    attack: 2 * factor,
                },
                desc: `"Penetrator"\nPenetrate shield`,
            },
            {
                buff: {
                    attackDirection: AttackDirection.AROUND,
                    attackType: AttackType.PENETRATE,
                    shield: 5 * factor,
                },
                desc: `"Stormpiercer"\nPenetrate, around`,
            },
        ];
        eliteCount < elites.length - 1 ? eliteCount++ : (eliteCount = 0);
        return [elites[eliteCount]];
    }
    else {
        let buffs = [
            { shield: 2 * factor, health: -2 * factor },
            { health: 1 * factor, attack: -1 * factor },
            { criticalRate: 0.05 * factor, health: -2 * factor },
            { attack: 1 * factor, hitRate: -0.2 },
        ];
        return buffs.map((buff) => ({ buff, desc: getEnemyPropsDescText(buff) }));
    }
};

class ClockIcon extends GameObject {
    constructor(x, y) {
        super({ x, y });
        this.setScale(0.5);
    }
    draw() {
        drawPolygon(this.context, "7 7 0 7 0 0 2 0 2 5 7 5 7 7", COLOR.WHITE_6, 11, 6);
        drawPolygon(this.context, "22 3 15 0 12 0 12 2 13 2 20 5 22 10 22 14 20 19 13 22 11 22 4 19 2 14 2 10 4 5 11 2 12 2 12 0 9 0 2 3 0 8 0 16 2 21 9 24 15 24 22 21 24 16 24 8 22 3", COLOR.WHITE_6);
    }
}

class WeightIcon extends GameObject {
    constructor(x, y) {
        super({ x, y });
        this.setScale(0.4);
    }
    draw() {
        drawPolygon(this.context, "24 5 20 5 20 0 12 0 12 5 8 5 0 24 32 24 24 5", COLOR.WHITE_6, 0, 4);
    }
}

class PotionIcon extends GameObject {
    constructor(x, y) {
        super({ x, y });
    }
    draw() {
        drawRect(this.context, 6, 0, 6, 3, COLOR.WHITE_6);
        drawPolygon(this.context, "12 6 12 0 6 0 6 6 0 11 4 24 14 24 18 11 12 6", COLOR.WHITE_6, 0, 5);
    }
}

class ItemCard extends BaseCard {
    constructor({ type, x, y, duration, weight }) {
        super({ type, x, y });
        Object.defineProperty(this, "descriptionText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "durationText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "weightText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "buff", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "duration", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "weight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "level", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        this.duration = duration;
        this.weight = weight;
        this.buff = this.pickBuff();
        this.descriptionText = factory$7({
            x: 0,
            y: 18,
            text: getItemPropsDescText(this.buff),
            ...COMMON_TEXT_CONFIG,
            textAlign: "center",
        });
        this.durationText = factory$7({
            text: `${duration}`,
            x: 42,
            y: 40,
            ...COMMON_TEXT_CONFIG,
        });
        this.weightText = factory$7({
            text: `${weight}`,
            x: -24,
            y: 40,
            ...COMMON_TEXT_CONFIG,
        });
        this.main.addChild([
            this.descriptionText,
            new ClockIcon(22, 32),
            this.durationText,
            new WeightIcon(-46, 32),
            this.weightText,
        ]);
    }
    getMainIcon() {
        switch (this.type) {
            case CardType.WEAPON:
                return new SwordIcon(-11, -32, 1);
            case CardType.SHIELD:
                return new ShieldIcon(-10, -31, 1, COLOR.WHITE_6);
            case CardType.POTION:
                return new PotionIcon(-9, -36);
            default:
                throw new Error(`Invalid card type: ${this.type}`);
        }
    }
    async equip() {
        this.duration = Math.max(this.duration, 2);
        await Promise.all([
            tween(this.main, { targetY: -24 }, 300, 50),
            this.setChildrenOpacity(0, 300),
        ]);
        zzfx(...[0.4, , 100, , 0.3, 0.4, 1, 0.1, , , 50, , 0.09, , , , , 0.5, 0.2]);
        this.main.y = 0; // reset
    }
    resetProps() {
        this.durationText.text = `${this.duration}`;
        this.weightText.text = `${this.weight}`;
    }
    updateDuration(value) {
        this.duration += value;
        if (this.duration <= 0)
            return false;
        this.durationText.text = `${this.duration}`;
        return true;
    }
    upgrade(card) {
        this.level += card.level;
        this.level = Math.min(this.level, 4);
        this.duration += card.duration;
        this.weight = card.type === CardType.POTION ? 0 : 2 * this.level;
        this.buff = this.pickBuff();
        this.descriptionText.text = getItemPropsDescText(this.buff);
        this.resetProps();
    }
    pickBuff() {
        let gm = GameManager.getInstance();
        let factor = gm.level + 1;
        switch (this.type) {
            case CardType.WEAPON:
                return getWeaponLevelBuff(this.level, factor, gm.cls);
            case CardType.SHIELD:
                return getShieldLevelBuff(this.level, factor, gm.cls);
            case CardType.POTION:
                return getPotionLevelBuff(this.level, factor, gm.cls);
            default:
                throw new Error(`Invalid card type: ${this.type}`);
        }
    }
}
let getWeaponLevelBuff = (level, factor, cls) => {
    let isKnight = cls === TemplarClass.KNIGHT;
    let attack = isKnight ? factor + 2 * level : 1;
    let random = Math.random();
    if (level === 1) {
        return { attack };
    }
    else if (level === 2) {
        return random < 0.6
            ? { attack, criticalRate: 0.05 }
            : { attack, hitRate: 0.05 };
    }
    else if (level === 3) {
        return {
            attack,
            criticalRate: 0.1,
            attackType: AttackType.PENETRATE,
        };
    }
    else {
        let dir = random < 0.5 ? AttackDirection.AROUND : AttackDirection.LINE;
        return {
            attack,
            attackDirection: dir,
            hitBackAttack: 3 * factor,
        };
    }
};
let getShieldLevelBuff = (level, factor, cls) => {
    return { shield: factor + (cls === TemplarClass.DEFENDER ? 4 : 2) * level };
};
let getPotionLevelBuff = (level, factor, cls) => {
    let random = Math.random();
    let baseVal = level;
    let baseRate = 0.025 + 0.025 * level;
    let buffs = [
        {
            health: factor *
                (random > (cls === TemplarClass.DEFENDER ? 0.4 : 0.6) - 0.1 * level
                    ? baseVal
                    : -baseVal),
        },
        {
            criticalRate: factor * random > 0.95 - 0.1 * level ? baseRate : -baseRate,
        },
        { hitRate: factor * random > 0.95 - 0.1 * level ? baseRate : -baseRate },
    ];
    return randomPick(buffs);
};

class TemplarCard extends CharacterCard {
    constructor({ x, y }) {
        super({
            type: CardType.TEMPLAR,
            x,
            y,
            belongs: Belongs.PLAYER,
        });
        Object.defineProperty(this, "cls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: TemplarClass.KNIGHT
        });
        Object.defineProperty(this, "weight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "weightText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.resetProps();
        this.weightText = factory$7({
            text: `${this.weight}`,
            x: -24,
            y: 40,
            ...COMMON_TEXT_CONFIG,
        });
        this.main.addChild([new WeightIcon(-46, 32), this.weightText]);
        on(EVENT.UPDATE_TEMPLAR_CLASS, this.updateCls.bind(this));
    }
    getMainIcon() {
        let templar = new Templar({
            x: -12,
            y: -20,
            scale: 0.33,
        });
        return templar;
    }
    deathCallback() {
        let gm = GameManager.getInstance();
        gm.gameOver();
    }
    updateCls(cls) {
        this.cls = cls;
        this.resetProps();
    }
    resetProps() {
        let isDefender = this.cls === TemplarClass.DEFENDER;
        let isKnight = this.cls === TemplarClass.KNIGHT;
        let isWizard = this.cls === TemplarClass.WIZARD;
        this.health = isWizard ? 6 : 10;
        this.shield = isDefender ? 10 : 0;
        this.attack = isKnight ? 4 : 1;
        this.hitRate = 0.8;
        this.criticalRate = isDefender ? 0.4 : 0.1;
        this.attackDirection = AttackDirection.FRONT;
        this.attackType = AttackType.NORMAL;
        this.hitBackAttack = isDefender ? this.shield : 0;
        if (isDefender)
            this.updateWeight(3);
        this.refreshText();
        emit(EVENT.UPDATE_TEMPLAR_INFO, this);
    }
    updateWeight(value) {
        this.weight += value;
        this.weightText.text = `${this.weight}`;
        let isOverweight = this.weight >= 13;
        this.weightText.color = isOverweight ? COLOR.BROWN_8 : COLOR.WHITE_6;
        emit(EVENT.UPDATE_TEMPLAR_WEIGHT, isOverweight);
    }
}

class CardFactory {
    static createCard(x, y) {
        let { moveCount, cls } = GameManager.getInstance();
        let isSpawnEliteEnemy = moveCount % 13 === 0;
        if (isSpawnEliteEnemy) {
            return CardFactory.factory({
                type: CardType.ENEMY,
                x,
                y,
            });
        }
        else {
            let isDefender = cls === TemplarClass.DEFENDER;
            let isKnight = cls === TemplarClass.KNIGHT;
            let randomItem = Math.random() > 0.5 ? CardType.POTION : CardType.SHIELD;
            let itemOrder = [
                CardType.ENEMY,
                isDefender ? CardType.SHIELD : CardType.WEAPON,
                randomItem,
                isKnight ? CardType.WEAPON : CardType.POTION,
                isDefender ? CardType.WEAPON : randomItem,
            ];
            return CardFactory.factory({
                type: itemOrder[moveCount % itemOrder.length],
                x,
                y,
            });
        }
    }
    static factory(props) {
        let { type, x, y } = props;
        let gm = GameManager.getInstance();
        switch (type) {
            case CardType.TEMPLAR:
                return new TemplarCard({ x, y });
            case CardType.ENEMY:
                if (gm.reusableEnemyCards.length > 2) {
                    let card = gm.reusableEnemyCards.shift();
                    card.reset();
                    card.x = x;
                    card.y = y;
                    return card;
                }
                return new EnemyCard({ x, y });
            case CardType.WEAPON:
                return new ItemCard({
                    ...props,
                    duration: 4,
                    weight: gm.cls === TemplarClass.DEFENDER ? 4 : 3,
                });
            case CardType.SHIELD:
                return new ItemCard({
                    ...props,
                    duration: 6,
                    weight: 3,
                });
            case CardType.POTION:
                return new ItemCard({
                    ...props,
                    duration: 5,
                    weight: 0,
                });
            default:
                throw new Error(`Invalid card type: ${type}`);
        }
    }
}

let GAP = 4;
let PADDING = 8;
let GRIDS_IN_LINE = 5;
let BOARD_SIZE = GRID_SIZE * GRIDS_IN_LINE + GAP * (GRIDS_IN_LINE - 1) + PADDING * 2;
class Board extends GameObject {
    constructor(x, y) {
        super({ x, y });
        Object.defineProperty(this, "grids", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "occupiedInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => null))
        });
        Object.defineProperty(this, "templarCard", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        on(EVENT.SWIPE, this.onSwipe.bind(this));
        let bg = factory$8({
            x: 0,
            y: 0,
            width: BOARD_SIZE,
            height: BOARD_SIZE,
            color: COLOR.GRAY_7,
        });
        this.addChild(bg);
        for (let i = 0; i < GRIDS_IN_LINE; i++) {
            for (let j = 0; j < GRIDS_IN_LINE; j++) {
                let grid = new Grid({
                    x: PADDING + i * (GRID_SIZE + GAP) + GRID_SIZE / 2,
                    y: PADDING + j * (GRID_SIZE + GAP) + GRID_SIZE / 2,
                    coord: [j, i],
                });
                this.grids.push(grid);
                this.addChild(grid);
            }
        }
        let centerGrid = this.getGridByCoord([2, 2]);
        this.templarCard = CardFactory.factory({
            type: CardType.TEMPLAR,
            x: centerGrid.x,
            y: centerGrid.y,
        });
        this.addChild(this.templarCard);
        this.occupiedInfo[2][2] = this.templarCard;
        this.spawnCards();
        on(EVENT.REMOVE_ENEMY_DEAD, this.onRemoveEnemyDead.bind(this));
    }
    getGridByCoord(coord) {
        let grid = this.grids[coord[0] + coord[1] * GRIDS_IN_LINE];
        if (!grid)
            throw new Error(`Grid not found by coord: ${coord}`);
        return grid;
    }
    onRemoveEnemyDead(card) {
        for (let i = 0; i < GRIDS_IN_LINE; i++) {
            let found = false;
            for (let j = 0; j < GRIDS_IN_LINE; j++) {
                let c = this.occupiedInfo[j][i];
                if (c === card) {
                    this.occupiedInfo[j][i] = null;
                    found = true;
                    break;
                }
            }
            if (found)
                break;
        }
        this.removeChild(card);
    }
    async onSwipe(direction) {
        await this.checkOverweight();
        await this.moveCards(direction);
        await this.checkAttack(direction);
        await this.checkDuration();
        this.spawnCards();
        emit(EVENT.SWIPE_FINISH);
    }
    async checkOverweight() {
        if (this.templarCard.weight < 13)
            return;
        this.templarCard.applyOverweightDamage();
    }
    async moveCards(direction) {
        let moveRight = direction === Direction.RIGHT;
        let moveLeft = direction === Direction.LEFT;
        let moveUp = direction === Direction.UP;
        let moveDown = direction === Direction.DOWN;
        let startI = moveRight ? GRIDS_IN_LINE - 2 : 1;
        let startJ = moveDown ? GRIDS_IN_LINE - 2 : 1;
        let endI = moveRight ? -1 : GRIDS_IN_LINE;
        let endJ = moveDown ? -1 : GRIDS_IN_LINE;
        let stepI = moveRight ? -1 : 1;
        let stepJ = moveDown ? -1 : 1;
        // Move cards
        let moveInfos = [];
        for (let i = moveUp || moveDown ? 0 : startI; i !== endI; i += stepI) {
            for (let j = moveLeft || moveRight ? 0 : startJ; j !== endJ; j += stepJ) {
                let card = this.occupiedInfo[j][i];
                if (!card)
                    continue;
                let currI = i, currJ = j;
                while (true) {
                    let nextI = currI + (moveRight ? 1 : moveLeft ? -1 : 0);
                    let nextJ = currJ + (moveDown ? 1 : moveUp ? -1 : 0);
                    let occupiedCard = this.occupiedInfo?.[nextJ]?.[nextI];
                    if (nextI < 0 ||
                        nextI >= GRIDS_IN_LINE ||
                        nextJ < 0 ||
                        nextJ >= GRIDS_IN_LINE ||
                        occupiedCard)
                        break;
                    currI = nextI;
                    currJ = nextJ;
                }
                let targetGrid = this.getGridByCoord([currJ, currI]);
                moveInfos.push({ card, x: targetGrid.x, y: targetGrid.y });
                this.occupiedInfo[j][i] = null;
                this.occupiedInfo[currJ][currI] = card;
            }
        }
        await Promise.all(moveInfos.map(({ card, x, y }) => card.moveTo(x, y)));
        // Equip cards
        let equippedItems = [];
        let potionLevels = [];
        for (let i = moveUp || moveDown ? 0 : startI; i !== endI; i += stepI) {
            for (let j = moveLeft || moveRight ? 0 : startJ; j !== endJ; j += stepJ) {
                let card = this.occupiedInfo[j][i];
                if (!card)
                    continue;
                let currI = i, currJ = j;
                while (true) {
                    let nextI = currI + (moveRight ? 1 : moveLeft ? -1 : 0);
                    let nextJ = currJ + (moveDown ? 1 : moveUp ? -1 : 0);
                    if (nextI < 0 ||
                        nextI >= GRIDS_IN_LINE ||
                        nextJ < 0 ||
                        nextJ >= GRIDS_IN_LINE)
                        break;
                    let occupiedCard = this.occupiedInfo?.[nextJ]?.[nextI];
                    if (occupiedCard) {
                        let isTemplarEquip = card.type === CardType.TEMPLAR &&
                            occupiedCard instanceof ItemCard;
                        let isItemUpgrade = card.type === occupiedCard.type && card instanceof ItemCard;
                        let potionAttackEnabled = this.templarCard.cls === TemplarClass.WIZARD;
                        if (isTemplarEquip || isItemUpgrade) {
                            isTemplarEquip && card.applyBuff(occupiedCard.buff);
                            isItemUpgrade && card.upgrade(occupiedCard);
                            if (potionAttackEnabled &&
                                occupiedCard.type === CardType.POTION &&
                                card.type === CardType.POTION)
                                potionLevels.push(1);
                            await occupiedCard.equip();
                            this.occupiedInfo[nextJ][nextI] = null;
                            // TODO: anim effect
                            if (card instanceof TemplarCard &&
                                occupiedCard.type !== CardType.POTION) {
                                card.updateWeight(occupiedCard.weight);
                                // @ts-ignore
                                equippedItems.push(occupiedCard);
                            }
                            else {
                                if (potionAttackEnabled && card.type === CardType.TEMPLAR)
                                    potionLevels.push(occupiedCard.level);
                                await occupiedCard.setInactive();
                            }
                            this.removeChild(occupiedCard);
                            let targetGrid = this.getGridByCoord([nextJ, nextI]);
                            await card.moveTo(targetGrid.x, targetGrid.y);
                            continue;
                        }
                        else {
                            break;
                        }
                    }
                    currI = nextI;
                    currJ = nextJ;
                }
                let targetGrid = this.getGridByCoord([currJ, currI]);
                await card.moveTo(targetGrid.x, targetGrid.y);
                this.occupiedInfo[j][i] = null;
                if (card instanceof CharacterCard && card.health <= 0)
                    continue;
                this.occupiedInfo[currJ][currI] = card;
            }
        }
        if (potionLevels.length) {
            // attack all enemies
            let allEnemies = this.occupiedInfo
                .flat()
                .filter((card) => card instanceof EnemyCard);
            for (let potionLevel of potionLevels) {
                await Promise.all(allEnemies.map((enemy) => enemy.onWizardAttack(this.templarCard, potionLevel)));
            }
        }
        if (equippedItems.length) {
            let gm = GameManager.getInstance();
            gm.addItems(equippedItems);
        }
    }
    spawnCards() {
        let gm = GameManager.getInstance();
        let isDual = gm.moveCount % 5 === 1 || gm.moveCount % 5 === 3;
        for (let i = 0; i < (isDual ? 2 : 1); i++) {
            let emptyIndices = [];
            for (let i = 0; i < GRIDS_IN_LINE; i++) {
                for (let j = 0; j < GRIDS_IN_LINE; j++) {
                    if (!this.occupiedInfo[j][i]) {
                        emptyIndices.push([j, i]);
                    }
                }
            }
            let randomIndex = Math.floor(Math.random() * emptyIndices.length);
            let [j, i] = emptyIndices[randomIndex];
            let grid = this.getGridByCoord([j, i]);
            let card = CardFactory.createCard(grid.x, grid.y);
            this.addChild(card);
            this.occupiedInfo[j][i] = card;
        }
    }
    async checkAttack(direction) {
        let battleInfos = [];
        for (let i = 0; i < GRIDS_IN_LINE; i++) {
            for (let j = 0; j < GRIDS_IN_LINE; j++) {
                let card = this.occupiedInfo[j][i];
                if (!(card instanceof CharacterCard))
                    continue;
                let { attackDirection } = card;
                let isNormalCase = attackDirection === AttackDirection.FRONT;
                let isAroundCase = attackDirection === AttackDirection.AROUND;
                let isLineCase = attackDirection === AttackDirection.LINE;
                if (isNormalCase) {
                    let targetJ = j +
                        (direction === Direction.UP
                            ? -1
                            : direction === Direction.DOWN
                                ? 1
                                : 0);
                    let targetI = i +
                        (direction === Direction.LEFT
                            ? -1
                            : direction === Direction.RIGHT
                                ? 1
                                : 0);
                    let targetCard = this.occupiedInfo?.[targetJ]?.[targetI];
                    if (targetI < 0 ||
                        targetI >= GRIDS_IN_LINE ||
                        targetJ < 0 ||
                        targetJ >= GRIDS_IN_LINE ||
                        !targetCard ||
                        !(targetCard instanceof CharacterCard) ||
                        targetCard.belongs === card.belongs)
                        continue;
                    battleInfos.push({ attacker: card, target: targetCard, direction });
                }
                else if (isAroundCase) {
                    // check 4 directions
                    let directions = [
                        [0, 1],
                        [1, 0],
                        [0, -1],
                        [-1, 0],
                    ];
                    for (let [di, dj] of directions) {
                        let targetJ = j + di;
                        let targetI = i + dj;
                        let targetCard = this.occupiedInfo?.[targetJ]?.[targetI];
                        if (targetCard instanceof CharacterCard &&
                            targetCard.belongs !== card.belongs) {
                            let direction = di === 0 && dj === 1
                                ? Direction.RIGHT
                                : di === 1 && dj === 0
                                    ? Direction.DOWN
                                    : di === 0 && dj === -1
                                        ? Direction.LEFT
                                        : Direction.UP;
                            battleInfos.push({
                                attacker: card,
                                target: targetCard,
                                direction,
                            });
                        }
                    }
                }
                else if (isLineCase) {
                    // check the same direction of the card
                    let isVertical = direction === Direction.UP || direction === Direction.DOWN;
                    let fixedIndex = isVertical ? i : j;
                    let variableIndex = isVertical ? j : i;
                    for (let k = 0; k < GRIDS_IN_LINE; k++) {
                        if (k === variableIndex)
                            continue;
                        let targetCard = isVertical
                            ? this.occupiedInfo[k][fixedIndex]
                            : this.occupiedInfo[fixedIndex][k];
                        if (targetCard instanceof CharacterCard &&
                            targetCard.belongs !== card.belongs) {
                            battleInfos.push({
                                attacker: card,
                                target: targetCard,
                                direction: k < variableIndex && isVertical
                                    ? Direction.UP
                                    : k < variableIndex && !isVertical
                                        ? Direction.LEFT
                                        : k > variableIndex && isVertical
                                            ? Direction.DOWN
                                            : Direction.RIGHT,
                            });
                        }
                    }
                }
            }
        }
        for (let { attacker, target, direction } of battleInfos) {
            await attacker.execAttack(direction, target, false, attacker.attackType === AttackType.PENETRATE);
        }
    }
    async checkDuration() {
        let gm = GameManager.getInstance();
        let deprecated = [];
        // items on board
        for (let i = 0; i < GRIDS_IN_LINE; i++) {
            for (let j = 0; j < GRIDS_IN_LINE; j++) {
                let card = this.occupiedInfo[j][i];
                if (card instanceof ItemCard) {
                    let isAlive = card.updateDuration(-1);
                    if (!isAlive) {
                        deprecated.push(card);
                        this.occupiedInfo[j][i] = null;
                    }
                }
            }
        }
        // items equipped on the templar
        let removed = []; // any item that should be removed from templar
        for (let item of gm.currentItems) {
            let isAlive = item.updateDuration(-1);
            if (!isAlive) {
                removed.push(item);
                deprecated.push(item);
                let debuff = {};
                Object.entries(item.buff).forEach(([key, value]) => {
                    if (key === "attackDirection") {
                        debuff[key] = AttackDirection.FRONT;
                    }
                    else if (key === "attackType") {
                        debuff[key] = AttackType.NORMAL;
                    }
                    else if (key !== "shield") {
                        debuff[key] = value * -1;
                    }
                });
                this.templarCard.applyBuff(debuff);
                this.templarCard.updateWeight(-item.weight);
            }
        }
        if (removed.length)
            gm.removeItems(removed);
        await Promise.all(deprecated.map((item) => item.setInactive()));
    }
}

class Header extends Text {
    constructor(x, y) {
        super({
            text: "MOVE 0",
            x,
            y,
            color: COLOR.GRAY_7,
            font: "36px Gill Sans",
            anchor: { x: 0.5, y: 0.5 },
        });
        let subText = factory$7({
            text: "Powerful Enemy Coming!",
            x: 0,
            y: 310,
            color: COLOR.RED_7,
            font: "36px Gill Sans",
            anchor: { x: 0.5, y: 0.5 },
            opacity: 0,
        });
        this.addChild(subText);
        on(EVENT.SWIPE, async () => {
            let moveCount = GameManager.getInstance().moveCount;
            this.text = `MOVE ${moveCount}`;
            let isThirteen = moveCount % 13 === 0;
            if (isThirteen) {
                this.color = COLOR.RED_7;
                await tween(subText, { opacity: 1 }, 500);
                await delay(500);
                await tween(subText, { opacity: 0 }, 400);
            }
            else {
                this.color = COLOR.GRAY_7;
            }
        });
    }
}

class CustomButton extends Sprite {
    constructor(x, y, text) {
        super({
            x,
            y,
            width: 96,
            height: 28,
            color: COLOR.BROWN_7,
            anchor: { x: 0.5, y: 0.5 },
        });
        Object.defineProperty(this, "text", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "canvasCallback", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.text = factory$7({
            text,
            anchor: { x: 0.5, y: 0.5 },
            color: COLOR.WHITE_6,
            font: `16px ${FONT}`,
        });
        this.addChild(this.text);
    }
    bindClick(callback) {
        let canvas = getCanvas();
        this.canvasCallback = (event) => {
            let { offsetLeft, offsetTop } = event.target;
            let { world } = this;
            let minX = world.x - world.width / 2;
            let maxX = world.x + world.width / 2;
            let minY = world.y - world.height / 2;
            let maxY = world.y + world.height / 2;
            let { width: w, height: h } = canvas;
            let scale = Math.min(innerWidth / w, innerHeight / h, devicePixelRatio);
            let x = (event.x - offsetLeft) / scale;
            let y = (event.y - offsetTop) / scale;
            if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
                callback();
            }
        };
        canvas.addEventListener("pointerdown", this.canvasCallback);
    }
    offClick() {
        if (this.canvasCallback) {
            getCanvas().removeEventListener("pointerdown", this.canvasCallback);
        }
    }
}

class GameOverDialog extends Sprite {
    constructor() {
        let { width, height } = getCanvas();
        super({
            width,
            height,
            opacity: 0.8,
            color: COLOR.DARK_6,
        });
        Object.defineProperty(this, "descText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "button", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        let wrapper = factory$8({
            x: width / 2,
            y: height / 2,
            width: 280,
            height: 180,
            anchor: { x: 0.5, y: 0.5 },
            color: COLOR.YELLOW_6,
        });
        let title = factory$7({
            text: "Game Over",
            x: width / 2,
            y: height / 2 - 48,
            anchor: { x: 0.5, y: 0.5 },
            color: COLOR.BROWN_7,
            font: `24px ${FONT}`,
        });
        this.descText = factory$7({
            text: "",
            x: width / 2,
            y: height / 2,
            anchor: { x: 0.5, y: 0.5 },
            textAlign: "center",
            color: COLOR.BROWN_7,
            font: `16px ${FONT}`,
        });
        this.button = new CustomButton(width / 2, height / 2 + 50, "Restart");
        this.addChild([wrapper, title, this.descText, this.button]);
        on(EVENT.GAME_OVER, this.show.bind(this));
    }
    show() {
        let gm = GameManager.getInstance();
        this.descText.text = `You did a great job!\nSurvived for ${gm.moveCount} moves!`;
        this.button.bindClick(() => window.location.reload());
    }
    render() {
        let gm = GameManager.getInstance();
        if (gm.state !== GameState.GAME_OVER)
            return;
        super.render();
    }
}

class GameStartDialog extends Sprite {
    constructor() {
        let { width, height } = getCanvas();
        super({
            width,
            height,
            opacity: 0.8,
            color: COLOR.DARK_6,
        });
        let wrapper = factory$8({
            x: width / 2,
            y: height / 2,
            width: 360,
            height: 180,
            anchor: { x: 0.5, y: 0.5 },
            color: COLOR.YELLOW_6,
        });
        let title = factory$7({
            text: "Pick a Class",
            x: width / 2,
            y: height / 2 - 52,
            anchor: { x: 0.5, y: 0.5 },
            color: COLOR.BROWN_7,
            font: `24px ${FONT}`,
        });
        let descText = factory$7({
            text: "Pick a class to fight against enemies",
            x: width / 2,
            y: height / 2,
            anchor: { x: 0.5, y: 0.5 },
            color: COLOR.BROWN_7,
            font: `16px ${FONT}`,
        });
        let gm = GameManager.getInstance();
        let wizardButton = new CustomButton(width / 2 - 108, height / 2 + 52, "Wizard");
        let knightButton = new CustomButton(width / 2, height / 2 + 52, "Knight");
        let defenderButton = new CustomButton(width / 2 + 108, height / 2 + 52, "Defender");
        let removeAllEvents = () => {
            wizardButton.offClick();
            knightButton.offClick();
            defenderButton.offClick();
        };
        wizardButton.bindClick(() => {
            gm.setClass(TemplarClass.WIZARD);
            removeAllEvents();
        });
        knightButton.bindClick(() => {
            gm.setClass(TemplarClass.KNIGHT);
            removeAllEvents();
        });
        defenderButton.bindClick(() => {
            gm.setClass(TemplarClass.DEFENDER);
            removeAllEvents();
        });
        this.addChild([
            wrapper,
            title,
            descText,
            wizardButton,
            knightButton,
            defenderButton,
        ]);
    }
    render() {
        let gm = GameManager.getInstance();
        if (gm.state !== GameState.INIT)
            return;
        super.render();
    }
}

let { canvas } = init$1();
initKeys();
GameManager.getInstance();
function resize() {
    let ctx = canvas.getContext("2d");
    let { width: w, height: h } = canvas;
    let scale = Math.min(innerWidth / w, innerHeight / h, devicePixelRatio);
    canvas.style.width = canvas.width * scale + "px";
    canvas.style.height = canvas.height * scale + "px";
    if (ctx)
        ctx.imageSmoothingEnabled = false;
}
(onresize = resize)();
let infoPanel = new InfoPanel(0, canvas.height - INFO_PANEL_HEIGHT);
let board = new Board((canvas.width - BOARD_SIZE) / 2, 84);
let header = new Header(canvas.width / 2, 46);
let gameOverDialog = new GameOverDialog();
let gameStartDialog = new GameStartDialog();
let loop = GameLoop({
    update: () => {
        infoPanel.update();
        board.update();
        header.update();
        gameOverDialog.update();
        gameStartDialog.update();
    },
    render: () => {
        infoPanel.render();
        board.render();
        header.render();
        gameOverDialog.render();
        gameStartDialog.render();
    },
});
loop.start();
