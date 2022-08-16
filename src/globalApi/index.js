import {
	nextTick
} from '../observer/nextTick.js';
import {
	mergeOptions
} from './mergeOptions.js';



export function initGlobalApi(Vue){
	// 原型挂载核心API
	Vue.prototype.$nextTick = nextTick;
	
	/* Vue类的静态全局配置对象 */
	Vue.options = {};
	
	/**
	 * 调用 一次mixin，就把选项中的created取出来挂到Vue.options的created数组
	 * 
	 * 将全局的Vue.options对象和用户传入的mixinOptions进行合并
	 * 合并完成之后将结果赋值给全局Vue.options对象对应的key的数组上
	 * @param {Object} mixinOptions
	 */
	Vue.mixin = function(mixinOptions) {
		// this === Vue	
		this.options = mergeOptions(this.options, mixinOptions);
		// console.log(this.options);
		return this; // 方便链式调用
	}
}