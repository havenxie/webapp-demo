/**
 * Create by havenxie on 2017/2/23
 * todo : 应该把click改成touch
 */
window.onload = function () {
	var delete_box_top = null;
	addCheckEvent();
	addDeleteEvent();
	addShadowEvent();
	addAddSubEvent();
}

// 添加左侧checkbox点击事件
function addCheckEvent() {
	var checkEles = document.querySelectorAll('.check_box');
	checkEles.forEach(function(item, index) {
		item.addEventListener('click', function() {
			var hasChecked = this.getAttribute('checked');
			if(hasChecked !== null) {
				this.removeAttribute('checked');
			} else {
				this.setAttribute('checked', '');
			}
		});
	});
}

// 添加右侧垃圾箱删除事件
function addDeleteEvent() {
	var deleteEles = document.querySelectorAll('.info_delete');
	deleteEles.forEach(function(item, index) {
		item.addEventListener('click', function() {
			toggleShadow(true);//显示
			delete_box_top = this.querySelector('.delete_box_top');
			delete_box_top.style.transition = 'all .5s ease 0s';
			delete_box_top.style.webkittransition = 'all .5s ease 0s';
			delete_box_top.style.transform = 'translateY(-5px) rotate(-30deg)';
			delete_box_top.style.webkittransform = 'translateY(-5px) rotate(-30deg)';
		});
	});
}

// 遮罩层显示、隐藏。true显示，false隐藏
function toggleShadow(flag) {
	var shadow = document.querySelector('.jd_shadow');
	var jd_shadow_box = document.querySelector('.jd_shadow_box');
	if(flag) {
		shadow.style.display = 'block';
		jd_shadow_box.className = 'jd_shadow_box bounceInDown';
	} else
		shadow.style.display = 'none';
}

// 添加遮罩层上按钮点击事件
function addShadowEvent() {
	var cancel = document.querySelector('.cancel');
	var delet = document.querySelector('.submit');
	var shadow = document.querySelector('.jd_shadow');
	cancel.addEventListener('click', function() {
		shadow.style.display = 'none';
		if(delete_box_top) {//是由于点击垃圾箱导致的
			delete_box_top.style.transition = 'all .5s ease 0s';
			delete_box_top.style.webkittransition = 'all .5s ease 0s';
			delete_box_top.style.transform = 'translateY(0px) rotate(0deg)';
			delete_box_top.style.webkittransform = 'translateY(0px) rotate(0deg)';
		}
	});
	delet.addEventListener('click', function() {
		shadow.style.display = 'none';
		if(delete_box_top) {
			var item = delete_box_top.parentNode.parentNode.parentNode.parentNode.parentNode
			item.remove();
			var jd_shops = document.querySelectorAll('.jd_shop');
			jd_shops.forEach(function(itemshop, index) {
				var products = itemshop.querySelectorAll('.jd_shop_product');
				if(products.length == 0) {
					itemshop.remove();
				}
			});
		}
	});
}

// 添加数量加减事件
function addAddSubEvent() {
	var sub_btns = document.querySelectorAll('.num_box_sub');
	var add_btns = document.querySelectorAll('.num_box_add');
	sub_btns.forEach(function(item, index) {
		item.addEventListener('click', function() {
			var input = this.parentNode.querySelector('input');
			if(input.value) {
				if(parseInt(input.value) > 0) {
					input.value = parseInt(input.value) - 1;
				}
			} else {
				//no nothing
			}
		});
	});
	add_btns.forEach(function(item, index) {
		item.addEventListener('click', function() {
			var input = this.parentNode.querySelector('input');
			if(input.value) {
				input.value = parseInt(input.value) + 1;
			} else {
				input.value = 1;
			}
		});
	});
}
