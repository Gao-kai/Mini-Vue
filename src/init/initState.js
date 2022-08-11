import {initData} from './initData.js'

export function initState(vm) {
	let options = vm.$options; // 获取用户传入的选项
	
	if (options.props) {
		initProps(vm);
	}

	if (options.data) {
		initData(vm);
	}

	if (options.methods) {
		initMethods(vm);
	}

	if (options.computed) {
		initComputed(vm);
	}

	if (options.watch) {
		initWatch(vm);
	}
}

