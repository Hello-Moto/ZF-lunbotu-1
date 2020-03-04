$(function (){
	let bannerRender = (function bannerRender(){
		let $banner = $('#banner'),
			 $wrapper = $('#wrapper'),
			 $focus = $('#focus'),
			 $next = $('#next'),
			 $prev = $('#prev'),
			 $focusList = null,
			 $divList = null;
		//获取数据
		let queryDate = function queryDate(){
			return new Promise((resolve, reject) => {
				$.ajax({
					url: './json/banner.json',
					method: 'get',
					dataType: 'json',
					async: 'true',
					success: (data) => {
						resolve(data);
					},
					error: (msg) => {
						reject(msg);
					}
					// success: resolve,
					// error: reject,
				});
			})
		};

		//数据绑定
		let bindHTML = function bindHTML(data){
			let str = ``,
				 focusListStr = ``;
			$.each(data,(index,item)=>{
				let {img,desc} = item;
				str += `<div><img src="${img}" alt=""></div>`;
				focusListStr += `<li class="${index === 0 ? 'active' : 'null'}"></li>`;
			});
			$wrapper.html(str);
			$focus.html(focusListStr);
			$divList = $wrapper.find('div');
			$focusList = $focus.find('li');
		};

		//自动轮播
		let _index = 0,
			 _nextIndex = 0,
			 _timer = null,
			 _interval = 3000,
			 _speed = 500,
			 _move = false;

		//优化
		let changePicture = function changePicture(){
			let $cur = $divList.eq(_nextIndex),
				 $last = $divList.eq(_index);
			$cur.css('zIndex',1);
			$last.css('zIndex',0);
			$cur.stop().animate({opacity: 1},_speed,()=>{
				$last.css({opacity: 0});
				_index = _nextIndex;
				_move = false;
			});
			changeFocus();
		};

		let autoMove = function autoMove(){
			_nextIndex++;
			if(_nextIndex >= $divList.length){
				_nextIndex = 0;
			}
			changePicture();
		};

		//焦点对齐
		let changeFocus = function changeFocus(){
			$focusList.eq(_nextIndex).addClass('active');
			$focusList.eq(_index).removeClass('active');
		};

		 //鼠标移入
		let handleMouse = function handleMouse(){
			$banner.on('mouseenter',()=>{
				clearInterval(_timer);
				$('.banner .arrow').css('display','block');
			});
			$banner.on('mouseleave',()=>{
				_timer = setInterval(autoMove,_interval);
				$('.banner .arrow').css('display','none');
			});
		};

		//左右切换
		let changeRl = function changeRl(){
			$next.on('click',()=>{
				if(_move){
					return;
				}
				_move = true;
				autoMove();
			});
			$prev.on('click',()=>{
				if(_move){
					return;
				}
				_move = true;
				_nextIndex--;
				if(_nextIndex < 0){
					_nextIndex = $divList.length - 1;
				}
				changePicture();
			})
		};

		//焦点切换
		let changeFocusRL = function changeFocus(){
			$focusList.on('click',function (){
				if(_move){
					return;
				}
				_move = true;
				let curIndex = $(this).index();
				if(_nextIndex === curIndex){
					return;
				}
				_nextIndex = curIndex;
				changePicture();
			})
		};

		return {
			init: function init() {
				let promise = queryDate();
				promise.then((data)=>{
					bindHTML(data);
					_timer = setInterval(autoMove,_interval);
					handleMouse();
					changeRl();
					changeFocusRL();
				})
			}
		}
	})();
	bannerRender.init();
});