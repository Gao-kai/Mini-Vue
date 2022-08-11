import {
	initState
} from './initState.js';
import {
	compileToFunction
} from '../template-compiler/index.js'

import {mountComponent} from '../lifecycle/index.js'

export function initMixin(Vue) {
	/* 在这里给Vue原型拓展方法 */
	Vue.prototype._init = function(options) {

		// 给生成的实例上挂载$options用于在其他地方获取用户传入的配置
		let vm = this;
		vm.$options = options;

		// 开始初始化options中的各个状态 data - props - methods...
		initState(vm);

		// 如果用户传入了el属性 就使用$mount进行挂载
		if (options.el) {
			vm.$mount(options.el);
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
		mountComponent(vm,element);

	}

}
