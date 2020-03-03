!function (){
	 let utils = (function(){
	 	let getCss = (curEle,attr)=>{
		   let val = null;
		   if('getComputedStyle' in window){
			   val = window.getComputedStyle(curEle,null)[attr];
			   let reg = /^-?\d+(\.\d+)?(px|rem|em|pt)?$/i;
			   reg.test(val) ? val = parseFloat(val) : null;
			   return val;
		   }
		   throw new SyntaxError('您的浏览器版本太低，请升级到最新版本，谢谢配合!!!');
	   };
	 	let setCss = (curEle,attr,value)=>{
		   if(!isNaN(value)){
			   let reg =/^(width|height|fontSize|((margin|padding)?(top|left|right|bottom)?))$/i;
			   reg.test(attr) ? value += 'px' : null;
		   }
		   curEle['style'][attr] = value;
	   };
	   let setGroupCss = (curEle,options)=>{
		   for(let attr in options){
			   if(!options.hasOwnProperty(attr)) break;
			   setCss(curEle,attr,options[attr]);
		   }
	   };
	   let css = (...arg)=>{
		   let len = arg.length,
				   second = arg[1],
				   fn = getCss;
		   len >= 3 ? fn = setCss : null;
		   len === 2 && (second instanceof Object) ? fn = setGroupCss : null;
		   return fn(...arg);
	   };
	   return {css: css};
	 })();

    var tbcd = {
        linear: (t,b,c,d)=>{return t / d * c + b},
    };
    // move：实现多方向运动动画 curEle当前要操作运动的元素，target当前动画的目标位置存储的是每一个方向的目标位置{left:xxx,top:xxx,...}，duration当前动画总时间
    function move(curEle,target,duration,callBack){
        //在每一次执行方法之前把当前元素之前运行动画清除掉
        clearInterval(curEle.timer);
        //根据target获取每一个方向的起始值begin和总距离change
        var begin = {}, change = {};
        for(var key in target){
            //key:方向，top/left...
            if(target.hasOwnProperty(key)){
                begin[key] = utils.css(curEle,key);
                change[key] = target[key] - begin[key];
            }
        }
        var time = 0;
        curEle.timer = setInterval(function(){
            time += 17;
            //到达目标结束动画，让当前元素的样式等于目标样式值
            if(time >= duration){
                utils.css(curEle,target);
                clearInterval(curEle.timer);
                //在动画结束的时候，如果用户把回调函数传递给我，我就把用户传递进来的那个函数执行.并让回调函数中的this变为当前要操作的元素
                typeof callBack === "function" ? callBack.call(curEle) : null; //也可以简写为: callBack && callBack.call(curEle);
                return;
            }
            //未到达目标分别获取每一个方向当前位置，给每个元素设置样式即可
            for(var key in target){
                if(target.hasOwnProperty(key)){
                    var curpos = tbcd.linear(time,begin[key],change[key],duration);
                    utils.css(curEle,key,curpos);
                }
            }
        },10)
    }
    window.animate = move;
}();