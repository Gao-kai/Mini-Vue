/* 打包入口文件 */
import {initMixin} from './init/init.js';
import {initLifeCycle} from './lifecycle/initLifeCycle.js'
import { nextTick } from './observer/nextTick.js';

// Vue构造函数
function Vue(options){
	this._init(options);
}

// 原型挂载核心API 
Vue.prototype.$nextTick = nextTick;

// 给Vue类拓展初始化options的方法
initMixin(Vue);

// 模板编译 组件挂载
initLifeCycle(Vue);


export default Vue; 