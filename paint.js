window.onload = function() {

	// 画板行为
	var drawing = document.getElementById('drawing');

	var ctxWidth = 10;
	var ctxColor = "orange";

	// 画笔宽度滑动条
	var ctxWid = document.getElementById("ctxWid");

	// 画笔颜色组按钮
	var co = document.getElementById("co");

	if (drawing.getContext("2d")) {
		var ctx = drawing.getContext("2d");
	} else {
		return;
	}

	// 画笔显示样式
	var ctxStyle = document.getElementById("ctxStyle");

	// 画笔宽度设置
	ctxWid.onchange = function() {
		console.log("11");
		ctxWidth = parseInt(ctxWid.value);
		// 为了让画笔显示样式看起来更清楚，加了2px
		ctxStyle.style.width = ctxWidth + 2 + "px";
		ctxStyle.style.height = ctxWidth + 2 + "px";
		ctxStyle.style.borderRadius = ctxWidth / 2 + 1 + "px";

	}

	// --画画事件--
	var isDown = false;
	drawing.onmousedown = function(evt) {
		var e = evt || window.event;
		isDown = true;
		ctx.beginPath();
		ctx.moveTo(e.clientX, e.clientY);
	}
	drawing.onmouseup = function() {
		isDown = false;
		ctx.closePath();
	}

	drawing.onmousemove = function(evt) {

		var e = evt || window.event;

		if (isDown) {

			ctx.strokeStyle = ctxColor;
			ctx.lineWidth = ctxWidth;

			ctx.lineTo(e.clientX - this.offsetLeft, e.clientY - this.offsetTop);

			ctx.stroke();
		}
	}


	// --工具栏行为--
	var colors = document.getElementsByClassName("selColor");

	// 初始化调色板颜色
	groupColor();

	var co = document.getElementById("co");

	co.onclick = groupColor;

	function groupColor() {
		for (var i = 0; i < colors.length; i++) {
			colors[i].style.backgroundColor = randomColor();
		}
	}

	for (var i = 0; i < colors.length; i++) {
		colors[i].onclick = function() {
			ctxColor = this.style.backgroundColor;
			ctxStyle.style.backgroundColor = ctxColor;
		}
	}

	function randomColor() {
		return "#" + Math.floor(Math.random() * 16 * 16 * 16 * 16 * 16 * 16).toString(16);
	}

	var tool = document.getElementById("tool");

	// 工具栏动画加载
	tool.onmouseover = function() {
		animateEE(tool, "left", 400);
	}
	// 工具栏动画隐藏
	tool.onmouseout = function() {
		animateEE(tool, "left", -10);
	}

	// --缓冲动画--
	function animateEE(obj, attr, target, fn) {

		clearInterval(obj.timer);

		obj.timer = setInterval(function() {

			var temp;
			if (attr == "opacity") {

				temp = getStyle(obj, attr) * 100;

			} else {
				// opacity的值如果小于1的话，会被parseInt转成0
				temp = parseInt(getStyle(obj, attr));
			}

			var speed = (target - temp) / 10;

			speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

			if (temp == target) {
				clearInterval(obj.timer);

				if (fn) {
					fn();
				}
			} else {

				temp += speed;

				if (attr == "opacity") {
					console.log(temp);
					obj.style.opacity = temp / 100;
				} else if (attr == "filter") {
					obj.style.filter = "alpha(opacity:" + (temp / 100) + ")";
				} else {
					obj.style[attr] = temp + "px";
				}
			}
		}, 20);

	}
	// 获取计算样式
	function getStyle(obj, attr) {
		if (window.getComputedStyle) {
			return getComputedStyle(obj)[attr];
		} else if (obj.currentStyle) {
			return currentStyle[attr];
		}
	}
}