let bannerRender = (function (){
	let banner = document.getElementById('banner'),
		 wrapper = document.getElementById('wrapper'),
		 focus = document.getElementById('focus'),
		 prev = document.getElementById('prev'),
		 next = document.getElementById('next'),
		 focusList = null,
		 divList = null,
		 nowIndex = 0,
		 wrapperWidth = null,
		 timer = null,
		 interval = 3000,
		 move = false;

	//获取数据
	let queryData = function queryData(){
		return new Promise((resolve,reject)=>{
			let xhr = new XMLHttpRequest();
			xhr.open('get','./json/banner.json',true);
			xhr.onreadystatechange = function(){
				if(xhr.readyState === 4 && xhr.status === 200){
					let data = JSON.parse((xhr.responseText));
					resolve(data);
				}
			};
			xhr.send(null);
		});
	};

	//数据绑定
	let bindHTML = function bindHTML(data) {
		let str = ``,
			 listStr = ``;
		data.forEach((item,index)=>{
			let {img='default.jpg',desc='无图'} = item;
			str += `<div><img src="${img}" alt="${desc}"></div>`;
			listStr += `<li class="${index === 0 ? 'active' : null}"></li>`;
		});
		str += `<div><img src="${data[0].img}" alt="${data[0].desc}"></div>`;
		wrapper.innerHTML = str;
		focus.innerHTML = listStr;
		divList = wrapper.querySelectorAll('div');
		focusList = focus.querySelectorAll('li');
		wrapperWidth = utils.css(divList[0],'width');
		utils.css(wrapper,'width',(wrapperWidth * divList.length));
	};
	//优化
	let tab = function tab(){
		[].forEach.call(focusList,function(item,index){
			item.classList.remove('active');
		});
		focusList[nowIndex%focusList.length].classList.add('active');
		animate(wrapper,{
			left: -wrapperWidth*nowIndex,
		},300);
	};
	//优化
	let nextPicture = function nextPicture(){
		if(nowIndex >= focusList.length){
			nowIndex = 0;
			utils.css(wrapper,'left',0);
		}
		nowIndex++;
		tab();
	};

	//点击焦点左右切换
	let handleFocus = function handleFocus(){
		[].forEach.call(focusList,(item,index)=>{
			item.onclick = function () {
				nowIndex = index;
				tab();
			}
		})
	};

	//点击左右按钮切换
	let handleRL = function handleRL(){
		next.onclick = nextPicture;
		prev.onclick = function(){
			if(move){return}
			move = true;
			if(nowIndex === 0){
				nowIndex = focusList.length;
				utils.css(wrapper,'left',-nowIndex*wrapperWidth);
			}
			nowIndex--;
			tab();
		};
	};

	//自动轮播
	let automaticChange = function automaticChange(){
		nextPicture();
	};

	//鼠标滑过
	let mouseChange = function mouseChange(){
		banner.onmouseenter = function(){
			clearInterval(timer);
			next.style.display = prev.style.display = 'block';
		};
		banner.onmouseleave = function(){
			timer = setInterval(automaticChange,interval);
			next.style.display = prev.style.display = 'none';
		}
	};

	return {
		init: function init(){
			let promise = queryData();
			promise.then(bindHTML).then(handleFocus).then(handleRL).then(()=>{
				timer = setInterval(automaticChange,interval);
			}).then(mouseChange);
		}
	}
})();
bannerRender.init();