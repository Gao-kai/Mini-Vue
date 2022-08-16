import {
	initState
} from './initState.js';

import {
	compileToFunction
} from '../template-compiler/index.js'

import {
	mountComponent
} from '../lifecycle/index.js'

import {
	mergeOptions
} from '../globalApi/mergeOptions.js';


export function initMixin(Vue) {
	/* 在这里给Vue原型拓展方法 */
	Vue.prototype._init = function(options) {

		// 给生成的实例上挂载$options用于在其他地方获取用户传入的配置
		let vm = this;
		
		/**
		 * options是用户传入的配置项
		 * this.constructor.options是全局Vue上的静态options对象
		 * 
		 * Vue.mixin的作用就是将全局的配置项合并成为一个对象，将相同key的值放入一个数组中
		 * Vue的实例在初始化的时候会再次将用户自己传入的配置项和之前全局的配置对象二次进行合并
		 * 这样做的好处是我们定义的全局的filter、指令、组件component等最终都会挂载到每一个Vue的实例上
		 * 供Vue的实例this进行调用 这就是为什么全局的过滤器、组件在任意地方都可以访问调用的原因
		 * 这也是为什么全局的生命周期函数总是在实例之前调用的原因
		 */
		vm.$options = mergeOptions(this.constructor.options,options);

		// data未初始化前调用beforeCreate生命周期函数
		callHook(vm,'beforeCreate');

		// 开始初始化options中的各个状态 data - props - methods...
		initState(vm);
		
		// data初始化完成之后调用created生命周期函数
		callHook(vm,'created');

		// 如果用户传入了el属性 就使用$mount进行挂载
		if (options.el) {
			// 未挂载到DOM上前调用beforeMount生命周期函数
			callHook(vm,'beforeMount');
			
			vm.$mount(options.el);
			
			// DOM挂载完成调用mounted生命周期函数
			callHook(vm,'mounted');
		}
	}


	Vue.prototype.$mount = function(el) {
		let vm = this;
		
		let options = vm.$options;
		let element = document.querySelector(el);

		/* 编译模板优先级 render - template - el */
		if (!options.render) {
			let template;
			// 如果没有传递template属性但是有element
			if (!options.template && element) {
				template = element.outerHTML;
			} else {
				// 如果template属性和element属性都有 这里的判断没有考虑太完全
				template = options.template;
			}
			// 获取到模板template 就需要对模板进行编译 输入template 输出render函数
			if (template) {
				const render = compileToFunction(template);
				options.render = render;
			}
		}

		// 组件的挂载：将实例vm对象挂载到DOM元素el上面
		// vm.$options中可以获取前面生成的render函数
		mountComponent(vm, element);

	}
}

/**
 * @param {Object} vm Vue实例
 * @param {Object} hook 要执行的生命周期函数名称
 * 发布订阅模式应用：在策略模式处一一进行订阅，在这里进行发布
 */
export function callHook(vm,hook){
	// 这里取到的和实例配置项合并之后的hook 应该是一个数组
	let handlers = vm.$options[hook];
	
	if(Array.isArray(handlers)){
		handlers.forEach(hook=>{
			// 所有生命周期函数的this都是实例本身
			hook.call(vm)
		})
	}
	
}
