//
//console.profile('build & load');
//console.time('build & load');

var box = document.querySelector('#box'),
    tile = box.querySelector('.tile'),
    outel = document.querySelector('#output');

var N = parseInt(conf.n);
var STEPS = parseInt(conf.s);

if (!N) {
    alert("Invalid num of tiles");
}


function TileController(el) {
    this.el = el;
};

(function () {
    this.render = function (i) {
        var tile = this.el;
        if (conf.img) {
            this.putImage(i);
        }
        if (conf.txt) {
            tile.querySelector('.title').textContent = "A Tile #" + i;
        }
        if (conf.data) {
            tile.querySelector('.data').textContent = bigtext(i);
        }
        return tile;
    };

    this.text = function () {
        return this.el.querySelector('.data').textContent;
    };

    this.putImageClosure = function (i) {
        var img = this.el.querySelector('img'),
            src = "img-assets/img" + (i % 10) + ".png?v=" + i;

        img.onload = function img_load() {
            console.log("Loaded: " + src + " [" + img.width + "x" +
                        img.height + "]");
        };
        img.onerror = function img_error() {
            console.log("Error loading: " + src + " [" + img.width + "x" +
                        img.height + "]");
        };

        img.src = src;
    };

    function imgonload(evt) {
        var img = evt.target, // or `this` if context not changed
            src = img.src;
        console.log("Loaded: " + src + " [" + img.width + "x" +
                    img.height + "]");
    };
    function imgonerror(evt) {
        var img = evt.target,
            src = img.src;
        console.log("Error loading: " + src + " [" + img.width + "x" +
                    img.height + "]");
    };

    this.putImageFree = function (i) {
        var img = this.el.querySelector('img'),
            src = "img-assets/img" + (i % 10) + ".png?v=" + i;

        img.onload = imgonload;
        img.onerror = imgonerror;
        img.src = src;
    };

    this.putImage = conf.closure ? this.putImageClosure : this.putImageFree;

    var letters = "abcdefghijklmnoqprstuvwxyz";
    function bigtext() {
        var size = 1024;
        var s = "";
        while (size--) s += letters[Math.random() * letters.length|0];
        return s;
    }

}).call(TileController.prototype);

// --- build up tiles

var C = [new TileController(tile)];
C[0].render(0);

var n = N;
while (n--) {
    var t = tile.cloneNode(true);
    var tc = new TileController(t);
    tc.render(N - n);
    box.appendChild(t);
    C.push(tc);
}

if (conf.style === 'absolute') reposition();

function reposition(state) {
    C.forEach(function _r(tc, i) {
        var tile = tc.el;
        while (i + state < -1) i += N;

        if (tile.getAttribute('data-s') == i) return;

        tile.style.left = i * 260 + 'px';
        tc.render(i);

        tile.setAttribute("data-s", i);
    });
};


// --- animations

var state = {
    _v: 0,
    set value(v) {
        this._v = Math.min(Math.max(0, v), 100);
    },
    get value() {return this._v;}
};


var animtile = {
    el: tile,
    prop: 'marginLeft',
    apply: function (state) {
        this.el.style[this.prop] = 10 + state * 260 + 'px';
    }
};

var animbox = {
    el: box,
    prop: 'marginLeft',
    apply: function (state) {
        this.el.style[this.prop] = state * 260 + 'px';
        if (conf.style === "absolute") reposition(state);
    }
};

var transbox = {
    apply: function (state) {
        box.style.transform = "translateX(" + state * 260 + "px)";
        if (conf.style === "absolute") reposition(state);
    }
};

var translayer = {
    apply: function (state) {
        box.style.transform = "rotateX(0deg) translateX(" + state * 260 + "px)";
        if (conf.style === "absolute") reposition(state);
    }
};

// --- output debug info

function out(s) {
    outel.textContent = s + '';
}
function outconf() {
    out(JSON.stringify(conf));
}
outconf();

// --- choose animation based on conf

var anim;
switch (conf.anim) {
case 'box':
    anim = animbox;
    break;
case 'tile':
    anim = animtile;
    break;
case 'transbox':
    anim = conf.layer ? translayer : transbox;
    break;
default:
    alert("No animation specified!");
}

if (conf.anim !== 'transbox') {
    if (conf.layer) box.style.transform = 'rotateX(0deg)';
}

// --- plug key handlers

function prev() {
    --state.value;
    anim.apply(-state.value);
}
function next() {
    ++state.value;
    anim.apply(-state.value);
}

window.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 37) { // left
        prev();
    }
    else if (evt.keyCode === 39) { // right
        next();
    }
}, false);


// --- 'run' test case

var INTERVAL = 300;
function run() {
    next();
    if (state.value < STEPS) {
        setTimeout(run, INTERVAL);
    }
    else {
        if (conf.back) setTimeout(back, INTERVAL);
        else end();
    }
}
function back() {
    prev();
    if (state.value > 0) {
        setTimeout(back, INTERVAL);
    }
    else end();
}

outel.onclick = run;

// --- profile

var started = false;
function start() {
    started = true;
    console.profile();
    run();
};

function end() {
    if (started) console.profileEnd();
};

window.onload = function () {
//    console.profileEnd('build & load');
//    console.timeEnd('build & load');
};

//window.onload = start;
