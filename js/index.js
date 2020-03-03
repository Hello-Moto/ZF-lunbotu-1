let bannerRender = (function(){
	let banner = document.getElementById('banner'),
		 wrapper = document.getElementById('wrapper'),
		 focus = document.getElementById('focus'),
		 prev = document.getElementById('prev'),
		 next = document.getElementById('next'),
		 list = null,
		 divList = null,
		 stepIndex = 0,
		 autoTime = null,
		 interval = 2000;
	//获取数据
	let queryData = function queryDate(){
		return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
			xhr.open('get','json/banner.json',true);
			xhr.onreadystatechange = ()=>{
				if(xhr.readyState === 4 && xhr.status === 200){
					let data = JSON.parse(xhr.responseText);
					resolve(data);
				}
			};
			xhr.send(null);
		});
	};
	//数据绑定
	let bindHTML = function bindHTML(data){
		let str = ``,
			 strList = ``;
		data.forEach((item,index)=>{
			let {img='default.jpg',desc='无图'} = item;
			str += `<div><img src="${img}" alt="${desc}"></div>`;
			strList += `<li class="${index === 0 ? 'active' : null}"></li>`;
		});
		str += `<div><img src="${data[0].img}" alt="${data[0].desc}"></div>`;
		wrapper.innerHTML = str;
		focus.innerHTML = strList;
		//重新获取div和li
		divList = wrapper.querySelectorAll('div');
		list = focus.querySelectorAll('li');
		utils.css(wrapper,'width',divList.length * (utils.css(divList[0],'width')));
	};

	//自动切换
	let autoMove = function autoMove(){
		stepIndex++;
		if(stepIndex > divList.length - 1){
			utils.css(wrapper,'left',0);
			stepIndex = 1;
		}
		animate(wrapper,{left: (utils.css(divList[0],'width'))*-stepIndex},300);
		changeFocus();
	};

	//焦点按钮
	let changeFocus = function changeFocus(){
		let tempIndex = stepIndex;
		tempIndex === divList.length -1 ? tempIndex = 0 : null;
		[].forEach.call(list,(item,index)=>{
			item.className = tempIndex === index ? 'active' : '';
		})
	};

	//鼠标移入移出事件
	let handleBanner = function handleBanner(){
		banner.onmouseenter = function () {
			clearInterval(autoTime);
			next.style.display = prev.style.display = 'block';
		};
		banner.onmouseleave = function(){
			autoTime = setInterval(autoMove,interval);
			next.style.display = prev.style.display = 'none';
		}
	};

	//焦点切换
	let handleFocus = function handleFocus(){
		[].forEach.call(list,(item,index)=>{
			item.onclick = function () {
				stepIndex = index;
				animate(wrapper,{
					left: (utils.css(divList[0],'width'))*-stepIndex,
				},300);
				changeFocus();
			}
		})
	};

	//给左右切换添加点击事件
	let handleRL = function handleRL(){
		next.onclick = autoMove;
		prev.onclick = function(){
			stepIndex--;
			if(stepIndex < 0){
				utils.css(wrapper,'left',-(divList.length - 1)*(utils.css(divList[0],'width')));
				stepIndex = divList.length - 2;
			}
			animate(wrapper,{
				left: (utils.css(divList[0],'width'))*-stepIndex,
			},300);
			changeFocus();
		}
	};

	return {
		init: function init() {
			let promise = queryData();
			promise.then(bindHTML).then(()=>{
				autoTime = setInterval(autoMove,interval);
				document.addEventListener('visibilitychange',()=>{
					if(document.hidden){
						clearInterval(autoTime)
					}else{
						autoTime = setInterval(autoMove,interval);
					}
				});
			}).then(handleBanner).then(handleFocus).then(handleRL )
		}
	}
})();
bannerRender.init();