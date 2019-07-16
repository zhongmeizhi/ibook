import '@/css/base.css';
import '@/css/about/index.css';

import TWEEN from '@tweenjs/tween.js'


var box = document.querySelector('.zmz-info');

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}
requestAnimationFrame(animate);


var coords = { x: 0, y: 0 };
var tween = new TWEEN.Tween(coords)
        .to({ x: 0, y: 30 }, 1000)
        .onUpdate(function() { 
            box.style.setProperty('transform', 'translate(' + coords.x + 'px, '     + coords.y + 'px)');
        })
        .start();

// end