# arm-html5-opera-tv
Testcase for "Creating performant HTML5 applications for TVs" (ARM workshop)

Use query params to set test case configuration. Examples:

`?style=absolute&anim=box&n=7&txt&img&s=20` - animate box, 7 rotating tiles, no layer promotion

`?style=absolute&anim=transbox&n=7&txt&img&s=20&layer` - animate box, 7 rotatin tiles, use transition, promote layer

`?style=inline&anim=tile&n=100&txt&img&s=10&back` - animate tiles, num of tiles = 100, layout: inline-block, 10 steps there and back

Use arrow keys to scroll.

Click gray 'info' element (with JSON conf) to start the test animation.

<em>The test run assumes starting at position 0.</em>

## conf

`style=[flex, float, absolute, inline]` - chose tiles layout (`inline` stands for `inline-block`)

`n={Number}` - number of tiles (use ~7 for `style=absolute`, as positioning absolutely triggers rotating of the tiles)

`anim=[tile, box, transbox]`

- `tile` - aniamte margin of the first tile (use for style `inline-block` or `flex`)
- `box` - animate margin of the `#box`
- `transbox` - animate `transform: translateX` of the box

`s={Number}` - num of steps in the run

`back` - if present, scroll back in the test run

`txt&img` - add text/images to the tiles

`layer` - promtote a layer for `#box`
