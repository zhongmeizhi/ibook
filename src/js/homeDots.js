
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
let h = $main.offsetHeight
let configObj = {
	text: '钟美志的个人网站',
	hSize: 36,
	dots: [],
	state: 'dispersed',
	distance: 12, // 步长
	floorX: 30,
	finishNum: 0,
	pause: false,
	pauseTime: 20, // 暂停时间
	startTime: 0,
	randomTimeSize: 100, // 起跑时间
}
ctx.canvas.width = w
ctx.canvas.height = h;

// 标题部分
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

// 点部分
class Dot {
	constructor (centerX , centerY , color) {
		this.x = centerX;
		this.y = centerY;
		this.z = 1;
		this.sx = w / 2; // 第一种起始位置X
		this.sy = h; // 第一种起始位置Y
		this.tx = w / 4 + Math.random() * w / 2; // 第二种起始位置X
		this.ty = Math.random() * h + h / 4; // 第二种起始位置Y
		this.sz = this.tz = 2 + Math.random() * 6; // 模拟Z轴
		this.color = color;
		let radius = configObj.distance + Math.random() * configObj.distance / 2;
		this.radius = radius;
		this.axisX = Math.abs(this.x - this.sx) / configObj.floorX;
		let startTime = Math.random() * configObj.randomTimeSize;
		this.startTime = startTime
		this.finish = false
	}

	// 图片终点和起跑判断
	paint() {
		ctx.save();
		ctx.beginPath();
		if (!configObj.pause) {
			// TODO 动画效果根据状态单独配置
			// configObj.state === 'bottom'
			if (!this.finish && this.startTime < configObj.startTime) {
				if (this.sx < this.x) {
					this.sx += this.axisX;
				} else {
					this.sx -= this.axisX;
				}
				if (Math.abs(this.y - this.sy) < this.radius) {
					this.sy = this.y;
					this.sx = this.x;
				} else if (this.sy < this.y) {
					this.sy += this.radius;
				} else {
					this.sy -= this.radius;
				}
				if (this.sz > 2) {
					this.sz -= 0.07
				} else {
					this.sz += 0.07
				}
				if (this.sx === this.x && this.sy === this.y) {
					configObj.finishNum++
					this.finish = true;
					this.sz = 2; // 两倍大小
				}
			}
		}
		ctx.fillStyle = this.color;
		ctx.arc(this.sx, this.sy, this.sz, 0, 2*this.sz*Math.PI);
		ctx.fill()
		ctx.restore();
	}
}

// 获取图片中的点
function getimgData({imgData, hSize}){
	let dots = [];
	for(let x = 0; x < w; x++){
		for(let y = hSize; y < h; y++){
			let startIndx = (w*y + x)*4
			let a = imgData[startIndx + 3];
			// 要清楚的，而且6个中只要1个
			if (a > 111 && !(x % 6) && !(y % 6)) {
				let r = imgData[startIndx];
				let g = imgData[startIndx + 1];
				let b = imgData[startIndx + 2];
				let color = `rgba(${r}, ${g}, ${b * Math.random()}, ${a * Math.random()})`;
				let dot = new Dot(x, y, color);
				dots.push(dot);
			}
		}
	}
	return dots;
}

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

// 画点
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
		configObj.startTime++
		configObj.dots.forEach(dot => {
			dot.paint();
		})
	}
}

function render () {
	ctx.clearRect(0, configObj.hSize, w, h);
	drawDot();
	requestAnimationFrame(render)
}

function startDotsAnimation() {
	initData()
	render()
}

export default startDotsAnimation
			