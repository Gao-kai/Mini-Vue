// 将target对象上的所有
/**
 * @param {Object} vm Vue实例对象
 * @param {Object} target 要代理的vm上的目标对象_data = {}
 * @param {Object} key 目标对象的属性 name
 * 实现访问vm.name = 访问vm._data.name
 */
export function proxy(vm, target, key) {
	Object.defineProperty(vm, key, {
		get() {
			return vm[target][key];
		},
		set(newValue) {
			vm[target][key] = newValue;
		}
	})
}