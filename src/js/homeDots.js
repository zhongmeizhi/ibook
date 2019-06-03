

// 代码写的比较硬。。。
// 有空再优化吧

let $cvs = document.createElement('canvas');
$cvs.id = 'homeCanvas';
$cvs.style.cssText = `
	position: fixed;
	top: 0;
	left: 50%;
	transform: translateX(-50%);`
let $main = document.getElementById('mainBox');
$main.append($cvs);

let ctx = $cvs.getContext('2d');
let w = $main.offsetWidth;
let h = $main.offsetHeight;
ctx.canvas.width = w;
ctx.canvas.height = h;

// 配置数据
let configObj = {
	text: '钟美志的个人网站',
	hSize: 36,
	dots: [],
	state: 'dispersed',
	distance: 8,
	floorX: 50,
	finishNum: 0,
	pause: false,
	pauseTime: 20,
	startTime: 0,
	randomTimeSize: 66, // 起跑时间
}

// 表头
function drawTitle ({text, hSize}) {
	ctx.font = `${hSize - 6}px Verdana`;
	var gradient = ctx.createLinearGradient(0, 0, w, 0);
	gradient.addColorStop("0","magenta");
	gradient.addColorStop("0.4","blue");
	gradient.addColorStop("0.8","red");
	ctx.fillStyle = gradient;
	ctx.textBaseline = "bottom";
	ctx.textAlign = "center";
	ctx.fillText(text, w/2, hSize);
}

	// 一个点的
class Dot {
	constructor (centerX , centerY , color) {
		// 当前位置
		// 以缩放实现Z
		this.x = centerX;
		this.y = centerY;
		this.z = 1;
		// 起始位置
		this.tx = w / 4 + Math.random() * w / 2;
		this.ty = Math.random() * h + h / 4;
		// 起始位置
		this.sx = w / 2;
		this.sy = h;
		this.sz = this.tz = Math.random() * 5;
		this.color = color;
		this.axisX = Math.abs(this.x - this.sx) / configObj.floorX;
		// 半径
		let radius = configObj.distance + Math.random() * configObj.distance / 2;
		this.radius = radius;
		// 起跑时间
		let startTime = Math.random() * configObj.randomTimeSize;
		this.startTime = startTime
		// 完成标记，应该是 isFinish
		this.finish = false
	}
	
	paint() {
		ctx.save();
		ctx.beginPath();
		// 不在暂停时间段执行
		if (!configObj.pause) {
			// 粒子未完成阶段执行
			if (!this.finish && this.startTime < configObj.startTime) {
				// x轴运动
				if (this.sx < this.x) {
					this.sx += this.axisX;
				} else {
					this.sx -= this.axisX;
				}
				// y轴运动
				if (Math.abs(this.y - this.sy) < this.radius) {
					this.sy = this.y;
					this.sx = this.x;
				} else if (this.sy < this.y) {
					this.sy += this.radius;
				} else {
					this.sy -= this.radius;
				}
				// 大小缩放
				if (this.sz > 1) {
					this.sz -= 0.07
				} else {
					this.sz += 0.07
				}
				if (this.sx === this.x && this.sy === this.y) {
					configObj.finishNum++
					this.finish = true
					this.sz = 1
				}
			}
		}
		ctx.fillStyle = this.color;
		ctx.arc(this.sx, this.sy, this.sz, 0, 2*this.sz*Math.PI);
		ctx.fill()
		ctx.restore();
	}
}

// 获取每个点数据
function getimgData({imgData, hSize}){
	let dots = [];
	for(let x = 0; x < w; x++){
		for(let y = hSize; y < h; y++){
			let startIndx = (w*y + x)*4
			let a = imgData[startIndx + 3];
			if (a > 126 && !(x % 4) && !(y % 6)) {
				let r = imgData[startIndx];
				let g = imgData[startIndx + 1];
				let b = imgData[startIndx + 2];
				let color = `rgba(${r}, ${g}, ${b}, ${a})`;
				let dot = new Dot(x, y, color);
				dots.push(dot);
			}
		}
	}
	return dots;
}

// 初始化数据
function initData () {
	drawTitle(configObj);
	let img = new Image();
	img.src = 'src/img/logo.png'
	img.onload = function () {
		ctx.drawImage(img, 0, 0, 61, 67, w/4, h/4, w/2, h/2);
		let imgData = ctx.getImageData(0, configObj.hSize, w, h).data;
		configObj.dots = getimgData({imgData, ...configObj});
		drawDot();
	}
}

// 绘画过程
function drawDot () {
	ctx.clearRect(0, configObj.hSize, w, h);
	if (configObj.finishNum && configObj.finishNum === configObj.dots.length) {
		configObj.pause = true;
		configObj.finishNum--;
	} else {
		if (configObj.pause) {
			configObj.finishNum--;
			if (configObj.dots.length - configObj.finishNum === configObj.pauseTime) {
				configObj.pause = false;
				configObj.finishNum = 0;
				configObj.startTime = 0;
				configObj.state = configObj.state === 'bottom' ? 'dispersed' : 'bottom';
				configObj.dots.forEach(dot => {
					dot.finish = !dot.finish;
					dot.x = w - dot.x;
					dot.y = h - dot.y;
					dot.z = dot.tz
					if (configObj.state === 'bottom') {
						dot.sx = dot.tx;
						dot.sy = dot.ty;
					} else {
						dot.sx = w / 2
						dot.sy = h
					}
					dot.sz = dot.tz;
				})
			}
		}
		// 起跑时间
		configObj.startTime++
		configObj.dots.forEach(dot => {
			dot.paint();
		})
	}
}

// 渲染函数
function render () {
	ctx.clearRect(0, configObj.hSize, w, h);
	drawDot();
	requestAnimationFrame(render)
}

// main方法
function startDotsAnimation() {
	initData()
	render()
}

export default startDotsAnimation
			