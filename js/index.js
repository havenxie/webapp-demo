/**
 * Create by havenxie on 2017/1/14
 */
window.onload = function() {
	search();
	sencondKill();
	var carrousel = new Carrousel("jd_banner");
	carrousel.startAnimate();

};

// 头部搜索区域
var search = function() {
	var search = document.getElementsByClassName("jd-headerbox")[0];
	var banner = document.getElementById("jd_banner");
	// 获取banner的高度
	var height = banner.offsetHeight; //只有行内样式才能直接用height获取
	window.onscroll = function() {
		//获取文档滚动距离顶部的高度
		var top = document.body.scrollTop;
		if (top >= height) {
			search.style.background = "rgba(201, 21, 35, .8)";
		} else {
			var opacity = top / height * 0.8;
			search.style.background = "rgba(201, 21, 35, " + opacity + ")";
		}
	};
};

// 秒杀倒计时
var sencondKill = function() {
	clearInterval("timer");
	var parentBox = document.getElementsByClassName("sk-time")[0];
	var timeList = parentBox.getElementsByClassName("num");
	var allTime = 5 * 60 * 60;
	var timer = setInterval(function() {
			allTime--;
			if (allTime <= 0) {
				clearInterval(timer);
			}
			var h = Math.floor(allTime / (60 * 60));
			var m = Math.floor(allTime / 60 % 60);
			var s = Math.floor(allTime % 60);

			timeList[0].innerHTML = (h >= 10) ? Math.floor(h / 10) : 0;
			timeList[1].innerHTML = h % 10;
			timeList[2].innerHTML = (m >= 10) ? Math.floor(m / 10) : 0;
			timeList[3].innerHTML = m % 10;
			timeList[4].innerHTML = (s >= 10) ? Math.floor(s / 10) : 0;
			timeList[5].innerHTML = s % 10;
		},
		1000);
};
// 轮播图面向对象版本
function Carrousel(targetId) {
	this.target = document.getElementById(targetId) || null;
	this.carrousel = this.target.getElementsByTagName("ul")[0] || null; //获取轮播图片的父级ul
	this.control = this.target.getElementsByTagName("ul")[1] || null; //获取控制点的父级ul
	this.pictures = this.carrousel.getElementsByTagName("li") || null; //获取所有图片
	this.conPoints = this.control.getElementsByTagName("li") || null; //获取所有控制点
	this.width = this.carrousel.offsetWidth / this.pictures.length;
	this.index = 1;
	this.timer = null;
	this.startPointX = 0;
	this.endPointX = 0;
}
Carrousel.prototype = {
	constructor: Carrousel,
	setTransition: function(duration) { //设置过渡动画
		this.carrousel.style.transition = "all " + duration + " ease 0s"; //第一个时间是完成时间第二个时间是延时时间
		this.carrousel.style.webkitTransition = "all " + duration + " ease 0s";
	},
	setTransform: function(position) { //设置图片位置
		this.carrousel.style.transform = 'translatex(' + position + 'px)'; //在js中style的所有属性赋值都需要字符串格式
		this.carrousel.style.webkitTransform = 'translatex(' + position + 'px)';
	},
	bindTransitionEndEvent: function() { //绑定过渡动画结束之后的事件//addEventLisener的好处是可以绑定多次
		// 妈蛋的需要用webkittransitionEnd也是醉了
		var self = this;
		this.carrousel.addEventListener("webkitTransitionEnd", function() { //添加事件过渡完监听事件
			if (self.index >= self.pictures.length - 1) {
				self.index = 1;
				self.setTransition("0s");
				self.setTransform(-self.index * self.width);
			} else if (self.index <= 0) {
				self.index = self.pictures.length - 2;
				self.setTransition("0s");
				self.setTransform(-self.index * self.width);
			}
			// for (var i = 0; i < self.conPoints.length; i++) {
			// 	self.conPoints[i].className = "";
			// }
			Array.prototype.forEach.call(self.conPoints, function(item, index) {
				item.className = "";
			});
			self.conPoints[self.index - 1].className = "now";
			console.log(self.index);
		}, false);
	},
	bindTouchEvent: function() { //绑定触摸事件 
		var self = this;
		var dragDistance = 0; //记录拖动距离
		var remainTime = 0; //记录滚动所需的剩余时间
		this.carrousel.addEventListener("touchstart", function(e) {
			clearInterval(self.timer);
			self.setTransition("0s");
			self.startPointX = e.touches[0].clientX;
			console.log("touchstart" + self.startPointX);
		});
		this.carrousel.addEventListener("touchmove", function(e) {
			self.endPointX = e.touches[0].clientX;
			dragDistance = self.endPointX - self.startPointX;
			self.setTransform(-self.width * self.index + dragDistance); //在当前的位置上加上滑动的位置
		});
		this.carrousel.addEventListener("touchend", function(e) {
			console.log("touchend" + self.endPointX);
			if (self.endPointX === 0) {
				return false;
			}
			remainTime = (self.width - Math.abs(dragDistance)) / self.width; //尽量在这里不要转换成字符串 因为内次都要开辟空间 占内存
			if (Math.abs(dragDistance) < self.width * 2 / 7) { //拖动距离不够的情况下就返回去
				self.setTransition(1 - remainTime + "s");
			} else if (dragDistance > 0) { //向右拖动
				self.index--;
				self.setTransition(remainTime + "s");
			} else { //向左拖动
				self.index++;
				self.setTransition(remainTime + "s");
			}
			self.setTransform(-self.width * self.index);
			self.startTimer();
			self.startPointX = 0;
			self.endPointX = 0;
		});
	},
	bindConPointsEvent: function() { // 绑定鼠标点击小圆点的事件
		// forEach是ie8以下不兼容的，并且forEach是数组的方法，dom对象的合集属于伪数组不能直接使用，我们可以使用call方法调用
		var self = this;
		Array.prototype.forEach.call(this.conPoints, function(item, index) {
			item.addEventListener("click", function() {
				self.index = index + 1;
				self.setTransition("0.01s"); //设置为一个非零数就可以触发bindTransitionEndEvent()方法，这样会自动设置小圆点
				self.setTransform(-self.index * self.width);
			});
		});
	},
	bindMouseInOutEvent: function() {
		var self = this;
		this.carrousel.addEventListener("mouseenter", function() {
			clearInterval(self.timer);
		});
		this.carrousel.addEventListener("mouseleave", function() {
			self.startTimer();
		});
	},
	bindResize: function() {
		window.onresize = function() {
			location.reload(true);
		};
	},
	// ("#xxx").stop(true,true);
	startTimer: function() {
		clearInterval(this.timer);
		var self = this;
		this.timer = setInterval(function() { //定时器内部的this对象是window
			// self.carrousel.stop(true, true);
			self.index++;
			self.setTransition("1s");
			self.setTransform(-self.index * self.width);
		}, 5000);
	},
	startAnimate: function() {
		this.bindResize();
		this.bindTransitionEndEvent();
		this.bindTouchEvent();
		this.bindConPointsEvent(); //pc端用鼠标来点击小圆点
		this.bindMouseInOutEvent(); //pc端鼠标进入和离开轮播图
		this.startTimer();
	}
};