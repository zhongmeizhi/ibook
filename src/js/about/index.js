import '@/css/base.css';
import '@/css/about/index.css';

// 哒哒哒
import TWEEN from '@tweenjs/tween.js'


var boxList = document.querySelectorAll('.zmz-info >div');

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}
requestAnimationFrame(animate);

boxList.forEach((val, idx) => {
    setTimeout(() => {
        var coords = { x: 0, y: 0, o: 0};
        new TWEEN.Tween(coords)
            .to({ x: 8, y: 0, o: 1 }, 666)
            .onUpdate(function() { 
                val.style.setProperty('transform', 'translate(' + coords.x + 'px, ' + coords.y + 'px)');
                val.style.setProperty('opacity', coords.o);
            })
            .start();
    }, idx * 1000);
})

// end