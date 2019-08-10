import onStateLoaded from '@/js/ready';
import startDotsAnimation from '@/js/homeDots';

onStateLoaded(function () {

  // 开启动画
  startDotsAnimation();

  // 鉴别手机端
  if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
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
  preventPhoneScale();
  } else {
    // PC模式
    let $PC = document.createElement('div')
    $PC.style.cssText = `
      position: fixed;
      top: 66px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 16px;
      text-align: center;
    `
    $PC.innerHTML = `
      <h1>本站点仅支持手机模式</h1>
    `
    document.body.append($PC)
  }
})