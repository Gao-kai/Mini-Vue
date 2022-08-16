let id = 0;
// 属性的dep核心目的：收集watcher 也称之为属性的收集器
class Dep {
	constructor() {
	    this.id = id++; 
	    this.subs = []; // 存放着当前属性对应的watcher都有哪些
	}
	
	/**
	 * 
	 * @param {Object} watcher
	 */
	depend(){
		// 让watcher先记住dep 比直接push实现去重 Dep.target永远指向当前dep要收集的watcher this就是dep
		Dep.target.addDep(this);
		
		// 直接在这里无脑push 不会去重
		// this.subs.push(watcher);
		
	}
	
	/**
	 * @param {Object} watcher
	 * 给属性的dep收集器记录收集了多少个watcher
	 * 其实就是记录这个属性有多少个组件模板在引用
	 */
	addSub(watcher){
		 this.subs.push(watcher);
	}
	
	/**
	 * 通知当前dep收集的watcher更新视图
	 */
	notify(){
		this.subs.forEach(watcher=>{
			watcher.update();
		})
	}
}

// 给Dep挂载一个全局属性 暴露出去 初始值为null 就是一个全局变量 代指当前正在
Dep.target = null;

// 存放渲染watcher和计算watcher的栈
let stack = [];
// 入栈
export function pushTarget(watcher){
	stack.push(watcher);
	Dep.target = watcher;
}
// 出栈
export function popTarget(){
	stack.pop();
	Dep.target = stack[stack.length-1];
}


export default Dep;