import Watcher from '../observer/watcher.js';
import Dep from '../observer/dep.js'

// 初始化用户传入的计算属性computed对象中的每一个属性
export function initComputed(vm) {
	let computed = vm.$options.computed;
	// console.log('computed',computed); // a:{} / a:fn(){}
	
	// 将watchers暴露在vm上 便于在其他方法中直接用vm实例获取
	let watchers = vm._computedWatchers = {};
	
	// 循环遍历定义每一个计算属性
	for(let key in computed){
		let userDefine = computed[key];
		
		/**
		 * 我们需要监控计算属性中get的变化
		 * 1.一般情况下如果直接new Watcher就会立即执行fn 
		 * 2.这里加一个标识lazy标识在new Watcher的时候不要立即执行userDefine
		 * 3.将计算属性key和Watcher一一对应起来
		 */
		let fn = typeof userDefine === 'function' ? userDefine : userDefine.get;
		watchers[key] = new Watcher(vm,fn,{lazy:true});
		
		// 这一步的目的是实现计算属性的响应式拦截 实现直接修改计算属性值引起视图重新渲染
		defineComputed(vm,key,userDefine);
	}
}

/**
 * @param {Object} vm 
 * @param {Object} key 计算属性的key
 * @param {Object} userDefine 计算属性key对应的值，可能是一个函数或者一个对象
 * 
 * defineComputed的作用：给vm实例上定义响应式属性
 */
function defineComputed(vm,key,userDefine){
	// 根据用户传入的computed计算属性是函数或者对象取出getter或setter
	const getter = typeof userDefine === 'function' ? userDefine : userDefine.get;
	const setter = userDefine.set || (()=>{});
	
	// console.log('获取计算属性的getter和setter',getter,setter);
	
	// 将用户传入的计算属性依次用Object.defineProperty进行get和set的重新绑定，好处在于这样一做之后在实例vm上可以直接获取到computed中的计算属性
	Object.defineProperty(vm,key,{
		get:createComputedGetter(key),
		set:setter
	})
}

// 计算属性本身和data中的属性不一样，它本身不会收集依赖，只会让自己依赖的属性去收集依赖
function createComputedGetter(key){
	
	return function(){
		// this就是vm 获取到对应计算属性key的watcher实例
		let computedWatcher = this._computedWatchers[key];
		
		/**
		 * 如果dirty为true 代表值是脏的发生了变化 就需要执行用户传入的函数
		 * 并且只有第一次进行取值的时候computedWatcher.dirty为true可以执行fn
		 * 执行过一次之后computedWatcher.dirty的值为false 后续每次执行都不会触发fn
		 * 
		 */
		if(computedWatcher.dirty){
			// 求完值以后计算属性watcher就会出栈
			computedWatcher.evaluate();
		}
		
		// 说明计算属性watcher出栈后还有渲染watcher
		if(Dep.target){
			// 让计算属性watcher里面依赖的属性 也去收集上层watcher 实现计算属性依赖的属性变化了 不仅计算属性的值变化 渲染watcher也发生变化
			computedWatcher.depend();
		}
		
		return computedWatcher.value;
	}
	
}