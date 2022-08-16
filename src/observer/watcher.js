import Dep from './dep.js'
import { nextTick } from './nextTick.js';
import { pushTarget,popTarget } from './dep.js';

let id = 0;
class Watcher {
	/**
	 * @param {Object} vm 实例
	 * @param {Object} fn 当实例上属性的getter触发的时候要执行的逻辑 
	 * @param {Object} options 标识是否为渲染watcher或者lazy执行fn的watcher
	 * 当watcher实例是一个渲染watcher的时候，fn就是_render和_update意味着要更新视图
	 * 当watcher实例是一个计算watcher的时候，fn就是计算属性自身的getter，要设置缓存memorize
	 */
	constructor(vm, fn, options) {
		this.id = id++; // 创建组件唯一的watcher
		this.getter = fn; // getter意味着调用函数可以发生取值操作
		this.renderWatcher = options.renderWatcher; // 标识是否为渲染watcher
		this.vm = vm;
		/**
		 * 记录当前这个组件watcher实例上观察了多少个属性，目的：
		 * 1.实现computed计算属性
		 * 2.组件卸载之后需要将当前组件watcher绑定的所有dep释放
		 * 3.watcher和dep是多对多的关系
		 */
		this.deps = []; 
		
		// 记录当前watcher绑定的dep的id数组 实现去重操作
		this.depsId = new Set();
		
		// 计算属性的getter被触发后先不执行 先看下值是否被修改(变脏)
		// 如果已经被修改，那么执行getter;否则返回上一次缓存的结果
		/**
		 * 1. 如果options.lazy为true 代表传入的fn不立即执行，否则才需要执行fn也就是get
		 * 2. 多次取值用dirty进行控制
		 */
		this.lazy = options.lazy;
		this.lazy ? null : this.get();
		this.dirty = options.lazy;
	}
	
	
	evaluate(){
		// 执行watcher的get就等于执行getter方法也就是用户传入的fn，对于计算属性来说fn就是用户定义的userDefine，在这里拿到用户传入的计算属性的get函数的返回值，并且需要标识为脏
		this.value = this.get();
		this.dirty = false;
	}
	
	/**
	 * 让计算属性watcher也收集渲染watcher
	 */
	depend(){
		let depLen = this.deps.length;
		while(depLen--){
			this.deps[depLen].depend();
		}
	}
	
	
	/**
	 * @param {Object} dep 属性的收集器
	 * 给watcher记录关联了多少个属性dep
	 * 
	 * 注意：重复的属性也不用重复push记录，因为一个watcher组件模板中可能绑定了多个重复的属性，比如一个组件模板多个地方用到属性name这是很常见的
	 */
	addDep(dep){
		let depId = dep.id;
		// 使用set实现watcher关联的属性dep 去重 避免同一属性重复watcher重复关联
		if(!this.depsId.has(depId)){
			
			// 先让watcher记住其关联的dep
			this.deps.push(dep);
			
			// 为了下次depsId可以进行去重判断
			this.depsId.add(depId);
			
			// 最后才让dep记住其关联的watcher 这个this是watcher
			dep.addSub(this);
		}
		
	}
	

	get() {
		// 给Dep类的静态属性target赋值
		// Dep.target = this;
		pushTarget(this);

		/**
		 * 1.执行getter就等于执行组件new Watcher的时候传递进来的渲染逻辑函数中的_render
		 * 2.就等于执行$options.render.call(vm)
		 * 3.就等于去vm上获取模板中变量vm.name和vm.age的值
		 * 4.就会触发绑定在模板上属性defineProperty的get方法
		 */
		let value = this.getter.call(this.vm);
		
		// 渲染完成之后将Dep.target设置为null
		popTarget();
		// Dep.target = null;
		
		return value;
		
	}
	
	/**
	 * watcher组件更新视图 
	 * 如果同一个组件A模板中绑定的name和age属性值都发生了set操作
	 * 那么原本直接执行watcher的get方法会触发两次视图渲染
	 * 这里设计一个队列将watcher都缓存起来 只更新一次 避免性能浪费
	 */
	update(){
		// 如果是计算属性有lazy标识 计算属性依赖的值变化就标识dirty属性为脏
		if(this.lazy){
			this.dirty = true;
		}else{
			// 先不直接更新watcher的视图 而是将要更新视图的watcher暂存到队列中
			queneWatcher(this);
		}
		
	
	}
	
	run(){
		// 真正执行视图渲染的地方
		this.get();
	}
}




/**
 * 
 * 1. 同一组件
 * 假设A组件绑定了name和age，此时给name和age赋值触发两次setter，原本要更新A组件两次，现在我们要让它只更新一次视图
 * 
 * 2. 多个组件
 * age属性不只依赖A组件，还依赖于B组件，当age连着两次赋值之后，此时原本A组件和B组件都要更新2次，现在我们要让A和B组件都各更新一次即可
 * 
 * 3.queneWatcher的作用
 * 不管watcher的update方法走了多少次，最后的更新操作只进行一次，那么就要设置一个锁，在第一次代码执行的时候关锁，不让后续的代码触发这个更新操作
 */
let quene = []; // 缓存数组 存放的watcher在后续都会执行一次刷新操作
let memo = {}; // 去重
let pending = false; // 防抖
function queneWatcher(watcher){
	const watcherId = watcher.id;
	
	// watcher去重
	if(!memo[watcherId]){
		quene.push(watcher);
		memo[watcherId] = true;
		console.log(quene);
		
		/**
		 * 不管此方法执行多少次 最终的视图刷新操作只执行一次 
		 * 为什么要将刷新的操作写在异步代码中呢 
		 * 就是为了利用事件环的机制 
		 * 让此异步代码等到前面的所有同步代码执行完成之后再执行 
		 * 也就实现了多次属性值修改只执行一次更新的操作
		 */
		if(!pending){
			// setTimeout(flushSchedulerQuene,0)
			nextTick(flushSchedulerQuene);
			pending = true;
		}
	}
}

/**
 * 把缓存在队列中的watcher拿出来 
 * 依次执行其更新视图操作
 */
function flushSchedulerQuene(){
	console.log('执行异步批量渲染');
	// 浅克隆一份
	let flushWatcherQuene = quene.slice(0);
	
	// 清空队列和memo对象以及pending默认值
	quene = []; // 保证在刷新的过程中有新的watcher重新放入队列中
	memo = {};
	pending = false
	
	// 从保存watcher的队列中依次取出更新视图
	flushWatcherQuene.forEach(watcher=>{
		watcher.run();
	});
}


export default Watcher;
