(function(window) {
/**
 * Drawing Worm Effect
 * Isolated effect for hero section
 */

if (!window.DrawingWormEffect) {
class DrawingWormEffect {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }

        // Configuration
        this.config = {
            color: '#FFFFFF',
            opacity: 0.6,
            maxWorms: 100,
            animationSpeed: 20
        };
        this.options = options || {};

        this.canvas = null;
        this.context = null;
        this.width = 0;
        this.height = 0;
        this.mouse = { x: 0, y: 0 };
        this.interval = null;
        this.vms = [];
        this.MAX_NUM = 100;
        this.N = 80;
        this.px = 0;
        this.py = 0;

        this.init();
    }

    init() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'effect-canvas';
        this.context = this.canvas.getContext('2d');
        
        // Insert canvas at the beginning of container
        this.container.insertBefore(this.canvas, this.container.firstChild);
        
        // Set canvas dimensions
        this.resizeCanvas();
        
        // Add event listeners
        this.addEventListeners();
        
        // Apply any option overrides before starting
        if (this.options && typeof this.options === 'object') {
            this.config = Object.assign({}, this.config, {
                color: this.options.color || this.config.color,
                opacity: (typeof this.options.opacity === 'number') ? this.options.opacity : this.config.opacity,
                animationSpeed: this.options.animationSpeed || this.config.animationSpeed
            });
            if (typeof this.options.maxWorms === 'number') this.MAX_NUM = this.options.maxWorms;
            if (typeof this.options.N === 'number') this.N = this.options.N;
        }

        // Start animation
        this.startAnimation();
    }

    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.px = this.width / 2;
        this.py = this.height;
        this.mouse.x = this.width / 2;
        this.mouse.y = this.height;
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.targetTouches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;
        }, false);

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        }, false);

        this.canvas.addEventListener('click', (e) => {
            e.preventDefault();
            this.clearCanvas();
        }, false);
    }

    startAnimation() {
        this.interval = setInterval(() => this.draw(), this.config.animationSpeed);
    }

    draw() {
        var len = this.vms.length;
        
        for (let i = 0; i < len; i++) {
            const o = this.vms[i];
            
            if (o.count < this.N) {
                this.drawWorm(o);
                o.count++;
            } else {
                len--;
                this.vms.splice(i, 1);
                i--;
            }
        }
        
        this.check();
    }

    drawWorm(obj) {
        // apply opacity per draw
        this.context.globalAlpha = this.config.opacity;
        if (Math.random() > 0.9) {
            obj.tmt.rotate(-obj.r * 2);
            obj.r *= -1;
        }

        obj.vmt.prependMatrix(obj.tmt);

        var cc1x = -obj.w * obj.vmt.c + obj.vmt.tx;
        var cc1y = -obj.w * obj.vmt.d + obj.vmt.ty;
        var pp1x = (obj.c1x + cc1x) / 2;
        var pp1y = (obj.c1y + cc1y) / 2;
        var cc2x = obj.w * obj.vmt.c + obj.vmt.tx;
        var cc2y = obj.w * obj.vmt.d + obj.vmt.ty;
        var pp2x = (obj.c2x + cc2x) / 2;
        var pp2y = (obj.c2y + cc2y) / 2;

        this.context.fillStyle = this.config.color;
        this.context.strokeStyle = this.config.color;
        this.context.beginPath();
        this.context.moveTo(obj.p1x, obj.p1y);
        this.context.quadraticCurveTo(obj.c1x, obj.c1y, pp1x, pp1y);
        this.context.lineTo(pp2x, pp2y);
        this.context.quadraticCurveTo(obj.c2x, obj.c2y, obj.p2x, obj.p2y);
        this.context.closePath();
        this.context.fill();
        this.context.globalAlpha = 1;

        obj.c1x = cc1x;
        obj.c1y = cc1y;
        obj.p1x = pp1x;
        obj.p1y = pp1y;
        obj.c2x = cc2x;
        obj.c2y = cc2y;
        obj.p2x = pp2x;
        obj.p2y = pp2y;
    }

    check() {
        var x0 = this.mouse.x;
        var y0 = this.mouse.y;
        var vx = x0 - this.px;
        var vy = y0 - this.py;
        var len = Math.min(this.magnitude(vx, vy), 50);

        if (len < 10) {
            return;
        }

        var matrix = new Matrix2D();
        matrix.rotate((Math.atan2(vy, vx)));
        matrix.translate(x0, y0);
        
        this.createWorm(matrix, len);

        this.context.beginPath();
        this.context.strokeStyle = this.config.color;
        this.context.moveTo(this.px, this.py);
        this.context.lineTo(x0, y0);
        this.context.stroke();
        this.context.closePath();

        this.px = x0;
        this.py = y0;
    }

    createWorm(mtx, len) {
        var angle = Math.random() * (Math.PI / 6 - Math.PI / 64) + Math.PI / 64;

        if (Math.random() > 0.5) {
            angle *= -1;
        }

        var tmt = new Matrix2D();
        tmt.scale(0.95, 0.95);
        tmt.rotate(angle);
        tmt.translate(len, 0);

        var w = 0.5;
        var obj = new Worm();

        obj.c1x = (-w * mtx.c + mtx.tx);
        obj.p1x = (-w * mtx.c + mtx.tx);
        obj.c1y = (-w * mtx.d + mtx.ty);
        obj.p1y = (-w * mtx.d + mtx.ty);
        obj.c2x = (w * mtx.c + mtx.tx);
        obj.p2x = (w * mtx.c + mtx.tx);
        obj.c2y = (w * mtx.d + mtx.ty);
        obj.p2y = (w * mtx.d + mtx.ty);
        obj.vmt = mtx;
        obj.tmt = tmt;
        obj.r = angle;
        obj.w = len / 20;
        obj.count = 0;

        this.vms.push(obj);

        if (this.vms.length > this.MAX_NUM) {
            this.vms.shift();
        }
    }

    clearCanvas() {
        this.canvas.width = this.canvas.width;
        this.vms = [];
    }

    magnitude(x, y) {
        return Math.sqrt((x * x) + (y * y));
    }

    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.canvas.remove();
    }
}

// Worm class
class Worm {
    constructor() {
        this.c1x = null;
        this.c1y = null;
        this.c2x = null;
        this.c2y = null;
        this.p1x = null;
        this.p1y = null;
        this.p2x = null;
        this.p2y = null;
        this.w = null;
        this.r = null;
        this.count = null;
        this.vmt = null;
        this.tmt = null;
    }
}

// Matrix2D class for transformations
(function(window) {
    if (window.Matrix2D) { return; }
    var Matrix2D = function(a, b, c, d, tx, ty) {
        this.initialize(a, b, c, d, tx, ty);
    }
    var p = Matrix2D.prototype;

    Matrix2D.identity = null;
    Matrix2D.DEG_TO_RAD = Math.PI / 180;

    p.a = 1;
    p.b = 0;
    p.c = 0;
    p.d = 1;
    p.tx = 0;
    p.ty = 0;

    p.initialize = function(a, b, c, d, tx, ty) {
        if (a != null) { this.a = a; }
        this.b = b || 0;
        this.c = c || 0;
        if (d != null) { this.d = d; }
        this.tx = tx || 0;
        this.ty = ty || 0;
    }

    p.prepend = function(a, b, c, d, tx, ty) {
        var n11 = a * this.a + b * this.c;
        var n12 = a * this.b + b * this.d;
        var n21 = c * this.a + d * this.c;
        var n22 = c * this.b + d * this.d;
        var n31 = tx * this.a + ty * this.c + this.tx;
        var n32 = tx * this.b + ty * this.d + this.ty;

        this.a = n11;
        this.b = n12;
        this.c = n21;
        this.d = n22;
        this.tx = n31;
        this.ty = n32;
    }

    p.prependMatrix = function(matrix) {
        this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    }

    p.rotate = function(angle) {
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var n11 = cos * this.a + sin * this.c;
        var n12 = cos * this.b + sin * this.d;
        var n21 = -sin * this.a + cos * this.c;
        var n22 = -sin * this.b + cos * this.d;
        this.a = n11;
        this.b = n12;
        this.c = n21;
        this.d = n22;
    }

    p.scale = function(x, y) {
        this.a *= x;
        this.d *= y;
        this.tx *= x;
        this.ty *= y;
    }

    p.translate = function(x, y) {
        this.tx += x;
        this.ty += y;
    }

    Matrix2D.identity = new Matrix2D(1, 0, 0, 1, 0, 0);
    window.Matrix2D = Matrix2D;
}(window));

window.DrawingWormEffect = DrawingWormEffect;
}
}(window));

