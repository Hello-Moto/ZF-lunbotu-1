let utils = (function(){
    //获取当前元素某一个样式属性值curEle:当前要操作的元素，attr:当前要获取的样式属性名
    let getCss = function(curEle,attr){
        let val = null;
        if('getComputedStyle' in window){
            val = window.getComputedStyle(curEle,null)[attr];
            //把获取的结果去除单位，display\复合值不能去掉单位
            let reg = /^-?\d+(\.\d+)?(px|rem|em|pt)?$/i;
            reg.test(val) ? val = parseFloat(val) : null;
            return val;
        }
        throw new SyntaxError('您的浏览器版本太低，请升级到最新版本，谢谢配合!!!');
    };

    //设置当前元素的某一个具体样式属性值
    let setCss = function(curEle,attr,value){
        // if(attr === 'opacity'){
        //     curEle.style.opacity = value;0.1
        //     curEle.style.filter = `alpha(opacity=${value*100})`;
        //     return;
        // }
        if(!isNaN(value)){
            let reg =/^(width|height|fontSize|((margin|padding)?(top|left|right|bottom)?))$/i;
            reg.test(attr) ? value += 'px' : null;
        }
        curEle['style'][attr] = value;
    };

    //批量设置元素CSS样式
    let setGroupCss = function(curEle,options = {}){
        for(let attr in options){
            //options传递进来的需要修改的样式对象
            //options[attr]传递要操作的样式属性值
            if(!options.hasOwnProperty(attr)) break;
            setCss(curEle,attr,options[attr]);
        }
    };

    //三个方法汇总集getCss,setCss,setGroupCss
    let css = function(...arg){
        //arg传递的实参集合
        let len = arg.length,
            second = arg[1],
            fn = getCss;
        len >= 3 ? fn = setCss : null;
        len === 2 && (second instanceof Object) ? fn = setGroupCss : null;
        return fn(...arg);
    };

    //获取当前元素距离body的偏移量（左/上便宜）
    let offset = function(curEle){
        let curLeft = curEle.offsetLeft,
            curTop = curEle.offsetTop,
            p = curEle.offsetParent;
        //累加父参照物边框和偏移量
        while(p.tagName !== 'BODY'){//找到父级参照物是body结束查找
            curLeft += p.clientLeft + p.offsetLeft;
            curTop += p.clientTop + p.offsetTop;
            p = p.offsetParent;
        }
        return {
            top: curTop,
            left: curLeft
        };
    };

    //操作浏览器盒子模型属性
    let winHandle = function (attr,value){
        if(typeof value !== 'undefined'){
            document.documentElement[attr] = value;
            document.body[attr] = value;
            return;
        }
        return document.documentElement[attr] || document.body[attr];
    };

    return {
        css: css,
        offset: offset,
        winHandle: winHandle,
    };
})();