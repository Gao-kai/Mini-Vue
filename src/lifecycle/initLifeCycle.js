import {createElementVNode,createTextVNode} from '../vNode/index.js'

/**
 * 1. 初始化渲染
 * 2. 异步更新diff算法
 * patch是更新的意思
 */
function patch(oldVNode,VNode){
	// 如果oldVNode是一个真实的DOM元素 那么代表传递进来的是要挂载的DOM节点 是初始化渲染
	let isRealDomElement = oldVNode.nodeType;
	if(isRealDomElement){
		// 开始初始化渲染
		
		// 1.基于VNode虚拟DOM创建真实DOM元素
		let newElement = createElement(VNode);
		console.log('newElement',newElement)
		
		// 2.新节点newElement替换老节点el 也是有讲究的
		// 假设要将A节点的内容替换为B节点的，需要先将B插入到A的下一个兄弟节点位置，然后移除A节点；而不能直接先将A移除，然后找到A的父元素appendChild，这样会插入到A的父元素的末尾去，导致前后节点位置发生变化
		let parentNode = oldVNode.parentNode;
		parentNode.insertBefore(newElement,oldVNode.nextSibling)
		parentNode.removeChild(oldVNode);
		
		// 3. 返回新的DOM
		return newElement;
		
	}else{
		// 开始diff算法对比
		
	}
}

/**
 * @param {Object} VNode
 * 根据虚拟DOM节点创建真实DOM节点
 * 这个真实的DOM节点就是最终要替代传入的el节点的元素节点
 */
function createElement(VNode){
	let {tag,data,children,text} = VNode;
	// 在_render方法生成虚拟DOM节点的时候设置了如果tag是一个字符串，那么就是元素节点；如果是null就是文本节点
	if(typeof tag === 'string'){
		// 将虚拟DOM和新建的真实DOM联系起来
		VNode.el = document.createElement(tag);
		// 给新DOM节点的属性赋值
		patchProps(data,VNode.el)
		// 给新DOM节点的children赋值
		children.forEach(child=>{
			VNode.el.appendChild(createElement(child));
		})
	}else {
		// 创建文本节点
		VNode.el = document.createTextNode(text);
	}
	
	return VNode.el;
}

/**
 * @param {Object} props 属性组成的对象
 * @param {Object} el 当前属性要挂载的元素节点
 * props:{ id:'app',style:{ color:red}}
 */
function patchProps(props,el){
	for(let key in props){
		if(key === 'style'){
			// 再次从style对象中取值 给el的style赋值
			for (let styleProp in props.style) {
				el.style[styleProp] = props.style[styleProp];
			}
		}else{
			el.setAttribute(key,props[key]);
		}
	}
}


export function initLifeCycle(Vue){
	
	/* 渲染虚拟DOM */
	Vue.prototype._render = function(){
		const vm = this;
		// 让with里面的this指向vm实例，就可以去实例中取值
		// 这一步就可以将属性和视图进行挂钩
		return vm.$options.render.call(vm);
	}
	
	// 生成元素节点
	Vue.prototype._c = function(){
		return createElementVNode(this,...arguments);
	}
	
	// 生成文本节点
	Vue.prototype._v = function(){
		return createTextVNode(this,...arguments);
	}
	
	// 转义字符串
	Vue.prototype._s = function(value){
		// 不是对象类型的话 没必要转义
		if(typeof value !== 'object') return value;
		return JSON.stringify(value);
	}
	
	
	/* 转化真实DOM */
	Vue.prototype._update = function(vNode){
		
		const vm = this;
		const el = vm.$el; // 此el是querySelector获取到的dom元素对象，不是new Vue时传入的选择符字符串'#app'
		
		console.log('执行render函数返回的虚拟节点',vNode);
		console.log('要挂载的真实DOM节点',el);
		
		/**
		 * Vue2.0和Vue3.0
		 * patch既有初始化的功能，又有更新视图的功能
		 * 将虚拟DOM转化为真实DOM
		 * 
		 * 用vNode创建真实DOM节点，然后替换到原来的el元素节点
		 * 并将patch后的返回值也就是新的真实DOM节点赋值给实例的$el属性
		 * 为了下一次更新的时候老的el就是上一次生成的真实DOM节点
		 */
		vm.$el = patch(el,vNode);
	}
}