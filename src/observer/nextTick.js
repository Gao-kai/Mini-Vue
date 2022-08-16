let timerFunction;
// nextTick处理异步刷新的优雅降级
function getTimerFn(fn){
	if(Promise){
		timerFunction = ()=>{
			Promise.resolve().then(flashCallBacks);
		}
	}else if(MutationObserver){
		// 这里传入的回调是异步回调 当DOM元素属性变化的时候触发flashCallBacks
		let mutationOb = new MutationObserver(flashCallBacks);
		let textNode = document.createTextNode(1);
		mutationOb.observe(textNode,{
			characterData:true
		})
		timerFunction = ()=>{
			textNode.textContent = 2;
		}
	}else if(setImmediate){
		timerFunction = ()=>{
			setImmediate(flashCallBacks);
		}
	}else{
		timerFunction = ()=>{
			setTimeout(flashCallBacks,0);
		}
	}
}
getTimerFn();

/**
 * @param {Object} callback 回调函数
 * 异步批处理:多次操作执行一次
 */
function flashCallBacks(){
	let flushCallBacks = callBacks.slice(0);
	
	// 清空队列和memo对象以及pending默认值
	callBacks = [];
	waiting = false
	
	// 从保存watcher的队列中依次取出更新视图
	flushCallBacks.forEach(cb=>{
		cb();
	});
}

let callBacks = [];
let waiting = false;
export function nextTick(callback){
	// 维护所有来自内部和外部的callback 这是同步操作
	callBacks.push(callback);
	
	if(!waiting){
		// 这是异步操作 最后将所有任务一起刷新
		// setTimeout(()=>{
		// 	flashCallBacks();
		// },0)
		timerFunction(flashCallBacks);
		waiting = true;
	}
}

