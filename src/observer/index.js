import Dep from './dep.js'

// 传递过来的是data引用空间
export function observe(data) {
	if (typeof data !== 'object' || data === null) return;
	// 如果一个对象的__ob__属性存在并且是Observer的实例 那么说明这个对象已经被观测过了
	if (data.__ob__ instanceof Observer) {
		return data.__ob__;
	}
	return new Observer(data);
}

// 观测数组和对象的类
class Observer {
	constructor(data) {
		// 让__ob__属性的可被遍历属性设置为false
		Object.defineProperty(data, '__ob__', {
			value: this,
			enumrable: false,
			configurable: false
		})

		if (Array.isArray(data)) {
			let newArrayProto = createNewArrayProto();
			data.__proto__ = newArrayProto;
			// 会将数组中的对象的属性进行劫持
			this.observeArray(data);
		} else {
			this.walk(data);
		}
	}

	walk(data) {
		Object.keys(data).forEach(key => {
			// 单独定义  公共 方便导出 不放在类上
			defineReactive(data, key, data[key]);
		})
	}

	observeArray(data) {
		data.forEach(item => {
			observe(item);
		})
	}

}


function defineReactive(target, key, value) {
	// 递归劫持 如果对象的属性值还是一个对象
	observe(value);
	/**
	 * 每一个属性在defineProperty前都有一个独立的dep
	 * 这个dep由于和defineProperty中的get方法形成闭包
	 * 不会被垃圾回收所销毁
	 */
	let dep = new Dep();
	
	Object.defineProperty(target, key, {
		// 拦截取值操作
		get() {
			// console.log('取值操作', key, value);
			
			// 属性的收集器dep 进行依赖收集
			if(Dep.target){
				dep.depend(Dep.target);
			}
			
			return value;
		},
		// 拦截赋值操作
		set(newValue) {
			// console.log('存值操作', key, value);
			if (newValue === value) return;
			// 如果新赋的值是一个新的对象 还需要劫持
			observe(newValue);
			value = newValue;
			
			// 响应式属性值变化 通知此属性dep收集到的watcher更新视图
			dep.notify();
		}
	})
}


function createNewArrayProto() {
	let oldArrayProto = Array.prototype;
	let newArrayProto = Object.create(oldArrayProto);

	// 以下7个方法会改变原数组
	let methods = [
		'push',
		'pop',
		'shift',
		'unshift',
		'sort',
		'reverse',
		'splice'
	]

	methods.forEach(method => {
		newArrayProto[method] = function(...args) {
			// console.log('监听到调用了数组方法', method);
			let result = oldArrayProto[method].call(this, ...args);

			// 需要对操作数组方法的时候新增的数据 再次进行劫持
			let inserted;
			switch (method) {
				case 'push':
				case 'unshift':
					inserted = args;
					break;
				case 'splice':
					inserted = args.slice(2);
					break;
				default:
					break;
			}
			// console.log('inserted', inserted);

			if (inserted) {
				// 对新增的内容再次进行劫持
				this.__ob__.observeArray(inserted);
			}

			return result;
		}
	})

	return newArrayProto;
}
