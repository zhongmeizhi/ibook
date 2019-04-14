import onStateLoaded from '@/js/ready';

onStateLoaded(function () {
  // 鉴别手机端
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    function appendDot () {
      let $dot = document.createElement('script');
      $dot.src = 'src/js/homeDots.js';
      document.body.appendChild($dot);
    }
    function preventPhoneScale () {
      // 同时按下两个手指
      document.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
          event.preventDefault()
        }
      })
      let lastTouchEnd = 0;
      // 特别注意300ms时差的设置
      document.addEventListener('touchend', function (event) {
        let now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      })
    }
    appendDot();
    preventPhoneScale();
  } else {
    // PC模式
    let $PC = document.createElement('div')
    $PC.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);;
    `
    $PC.innerHTML = `
      <h1>当前打开方式为PC端Web页</h1>
      <h2>请使用手机模式打开</h2>
    `
    document.body.append($PC)
  }
})