import strats from './strats.js'

/**
 * @param {Object} oldOptions 当前的Vue.options对象
 * @param {Object} newOptions Vue.mixin调用时传入的新的options
 * 此方法不同于普通的对象之前的合并，比如：
 * let oldOptions = {};  let newOptions = {created:100};
 * 1. 要求将合并的结果要保存在oldOptions对象中
 * 2. 要求将key对应的值在合并之后放在数组队列中维护起来：
 * 
 * 比如上面例子合并之后的结果就是:oldOptions = {created:[100]}，再次进行合并：
 * let oldOptions = {created:[100]};  let newOptions = {created:200};
 * 合并结果为：oldOptions = {created:[100,200]}
 * 
 * 总的来说就是：新旧对象中相同key的要依次按照合并的顺序维护在一个数组队列中，并且将合并的结果赋值给原来的旧的对象本身，也就是Vue.options对象。
 */
export function mergeOptions(oldOptions, newOptions) {
	const resOptions = {};

	// 先循环老的对象
	for (let key in oldOptions) {
		mergeField(key); // 合并要合并的字段
	}

	// 再循环传入的对象
	for (let key in newOptions) {
		// 父对象合并过的字段就不重复合并了
		if (!oldOptions.hasOwnProperty(key)) {
			mergeField(key); // 合并要合并的字段
		}

	}

	function mergeField(key) {
		// 策略模式减少if - else 避免写很多if条件
		if (strats[key]) {
			// 有策略优先走策略 说明我定义好了如何处理的策略
			resOptions[key] = strats[key](oldOptions[key], newOptions[key]);
		} else {
			// 如果没有策略那么以传入的新的渲染中key的值为主
			resOptions[key] = newOptions[key] || oldOptions[key];
		}
	}

	return resOptions;
}