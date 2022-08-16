import Watcher from '../observer/watcher.js';

/**
 * 组件挂载流程
 * @param {Object} vm 挂载组件所需的Vue实例对象
 * @param {Object} el 组件所在的DOM元素对象
 */
export function mountComponent(vm, el) {

	/**
	 * 1. 调用render方法产生虚拟节点 -虚拟DOM => vm._render()
	 * 2. 根据虚拟DOM生成真实DOM 
	 * 3. 用新的真实DOM替换el DOM元素
	 */

	vm.$el = el; // 方便在实例调用_update的时候直接通过$el属性取值


	// 定义渲染逻辑函数 每次执行这个函数就会对组件进行重新渲染
	let updateComponent = ()=>{
		vm._update(vm._render());
	}
	
	// 创建watcher new的过程就是渲染视图的过程
	let watcher = new Watcher(vm,updateComponent,{renderWatcher:true});
	console.log('watcher',watcher)
	
}
