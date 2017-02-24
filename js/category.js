/**
 * [onload description]
 * @return {[type]} [description]
 * 2016.12.31
 * todo：阻止事件冒泡
 */
window.onload = function() {
	var rollMenu = new RollFlex(".jd-cateLeft", ".dynamicLeft", 100, true);
	rollMenu.startAnimate();
	
	var product = new RollFlex(".containerRight", ".jd-content", 100, false);
	product.startAnimate();

//阻止整个页面脱拽
	document.querySelector('body').addEventListener('touchstart', function (event) {
		// 判断默认行为是否可以被禁用
    	if (event.cancelable) {
        // 判断默认行为是否已经被禁用
        	if (!event.defaultPrevented) {
            	event.preventDefault();
            	event.stopPropagation(); 
        	}
    	}
	});
	document.querySelector('body').addEventListener('touchmove', function (event) {
		// 判断默认行为是否可以被禁用
    	if (event.cancelable) {
        // 判断默认行为是否已经被禁用
	        if (!event.defaultPrevented) {
	            event.preventDefault();
	            event.stopPropagation(); 
	        }
    	}
	});
};
/*****************************************************************************/
/**
 * [RollFlex description]
 * @param {[type]} container  [做动画元素的父级容器]
 * @param {[type]} dynamic    [执行动画的元素]
 * @param {[type]} dragLength [向下拖拽过程中最大拖拽的距离]
 * @param {[type]} changeClass [点击某个元素后是否改变活动焦点，为了兼容右侧]
 */
function RollFlex(container, dynamic, dragLength, changeClass) {
	this.containerHeight = document.querySelector(container).offsetHeight || 0;//获取容器的高度
	this.dynamicBox = document.querySelector(dynamic) || null;//获取做动画的那个盒子
	this.dynamicBoxHeight = this.dynamicBox.offsetHeight || 0;//做动画的那个盒子高度
	this.subElements = this.dynamicBox.children.length > 0 ? this.dynamicBox.children : null;//做动画的那个盒子的子元素，通常是li
	this.infiniteHigh = dragLength;
	// this.infiniteHigh = 2 * this.dynamicBoxHeight / this.subElements.length;//允许的阈值上线
	this.infiniteLow = (this.containerHeight - 45) - this.dynamicBoxHeight - this.infiniteHigh ;
	this.changeClass = changeClass || false;
}

RollFlex.prototype = {
	constructor: RollFlex,
	bindResize: function() {
		window.onresize = function() {
			location.reload(true);
		};
	},
	setTransition: function(duration) {
		this.dynamicBox.style.transition = "all " + duration + " ease 0s";
		this.dynamicBox.style.webkittransition = "all " + duration + " ease 0s";
	},
	setTransform: function(position) {
		this.dynamicBox.style.transform = "translateY(" + position + "px)";
		this.dynamicBox.style.webkittransform = "translateY(" + position + "px)";
	},
	bindTouchEvent: function() {
		var self = this;
		var isRightfulDrag = false;
		var absolutePos = 0; //记录绝对位置
		var dragDistance = 0;
		var startPositionY = 0,
			endPositionY = 0;
		var markTop = 0; //标志距离顶部的位置
		this.dynamicBox.addEventListener("touchstart", function(e) {
			startPositionY = e.touches[0].clientY;
			self.setTransition("0s");
			e.preventDefault();
	        e.stopPropagation(); 
		}, false);
		this.dynamicBox.addEventListener("touchmove", function(e) {
			endPositionY = e.touches[0].clientY;
			dragDistance = endPositionY - startPositionY;
			absolutePos = markTop + dragDistance; //历史位置+拖动位置=本次绝对位置
			if (absolutePos > self.infiniteLow && absolutePos < self.infiniteHigh) { //在合理区域内拖动 跟随指尖移动
				self.isRightfulDrag = true; //合理的拖拽
				self.setTransform(absolutePos);
			} else {
				self.isRightfulDrag = false; //不合理的拖拽
				if (absolutePos <= self.infiniteLow) { //小于下阈值 强制设为下阈值
					self.setTransform(self.infiniteLow);
					markTop = self.infiniteLow;
				} else if (absolutePos >= self.infiniteHigh) { //大于上阈值 强制设为上阈值
					self.setTransform(self.infiniteHigh);
					markTop = self.infiniteHigh;
				}
			}
			e.preventDefault();
	        e.stopPropagation(); 

		}, false);
		this.dynamicBox.addEventListener("touchend", function(e) {
			if (!endPositionY) { //只是点击并未拖拽
				if (self.changeClass) { //为了兼容右侧			
					Array.prototype.forEach.call(self.subElements, function(item, index) {
						item.className = "";
					});
					var selectedNode = e.target.parentNode;
					selectedNode.className = "now";
					if(selectedNode.offsetTop <= 0){
						console.log(selectedNode.offsetTop);
						return false;
					}
					var temp = self.dynamicBoxHeight - (selectedNode.offsetTop - 45);
					if (temp > self.containerHeight - 45) {
						self.setTransition("0.5s");
						self.setTransform(-selectedNode.offsetTop + 45);
						markTop = -selectedNode.offsetTop + 45;
					}
				}
				return false;
			}
			if (self.isRightfulDrag) { //对应上面的合理的拖拽
				markTop += dragDistance;
			}
			if (markTop >= 0 && markTop <= self.infiniteHigh) { //对应上面不合理拖拽的上阈值
				self.setTransition("0.5s");
				self.setTransform(0);
				markTop = 0;
			} else if (markTop <= self.infiniteLow + self.infiniteHigh && markTop >= self.infiniteLow) { //对应上面不合理拖拽的下阈值
				self.setTransition("0.5s");
				self.setTransform(self.infiniteLow + self.infiniteHigh);
				markTop = self.infiniteLow + self.infiniteHigh;
			}
			startPositionY = 0;
			endPositionY = 0;
			dragDistance = 0;
		}, false);
	},
	startAnimate: function() {
		this.bindResize();
		this.bindTouchEvent();
	}
};