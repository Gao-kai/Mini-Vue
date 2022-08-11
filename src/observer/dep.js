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
	depend(watcher){
		// 让watcher先记住dep 比直接push实现去重 这个this是dep
		watcher.addDep(this);
		
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

// 给Dep挂载一个全局属性 暴露出去 初始值为null 就是一个全局变量
Dep.target = null;


export default Dep;