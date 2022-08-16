// 策略对象 
const strats = {};

// 一个个具体的策略
const LIFECYCLE = [
	"beforeCreate",
	"created",
	"beforeMount",
	"mounted",
	"beforeUpdate",
	"updated",
	"beforeDestroy",
	"destroyed",
];

// 创建一个个的策略 这意味着key为生命周期的值肯定是一个数组
function makeStrats(stratsList){
	stratsList.forEach(hook => {
		strats[hook] = function(oldValue, newValue) {
			if(newValue){
				if(oldValue){
					return oldValue.concat(newValue); // 新旧都有 合并在一个数组中
				}else{
					return [newValue]; // 新传入的属性值存在 旧的不存在 就新的包装在数组中
				}
			}else{
				return oldValue; // 只有旧对象没有新对象直接用旧对象的key的值
			}
		}
	});
}

makeStrats(LIFECYCLE);

export default strats;