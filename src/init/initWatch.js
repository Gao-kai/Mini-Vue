export function initWatch(vm){
	const watch = vm.$options.watch;
	for(let key in watch){
		const handler = watch[key];
		/**
		 * 1.值为字符串
		 * 2.值为函数
		 * 3.值为数组
		 */
		if(Array.isArray(handler)){
			for(let i=0;i<handler.length;i++){
				createWatcher(vm,key,handler[i]);
			}
		}else{
			createWatcher(vm,key,handler);
		}
	}
	
}

function createWatcher(vm,key,handler){
	/* 如果某个watcher属性的值是字符串 那么这个字符串应该是methods中的一个函数名，同样的Vue内部会将用户传入的options.methods对象中的值依次挂载到vm上，所以这里通过vm[函数名]就可以取到这个watcher属性的回调函数*/
	if(typeof handler === 'string'){
		handler = vm[handler];
	}
	vm.$watch(key,handler)
}