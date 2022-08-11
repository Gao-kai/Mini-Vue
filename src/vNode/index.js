
/**
 * 创建虚拟DOM 元素节点
 * h方法和_c都是这个方法
 */
export function createElementVNode(vm,tag,data,...children){
	if(data == null) {
		data = {};
	}
	let key = data.key;
	if(key){
		delete data.key;
	}
	return createVNode(vm,tag,key,data,children)
}


/**
 * 创建虚拟DOM 文本节点
 * _v就是这个方法
 */
export function createTextVNode(vm,text,props={},...children){
	return createVNode(vm,null,null,null,null,text)
}

/**
 * 1.描述的是语法还是DOM 
 * 2. 能不能在过程中自定义新的内容进去
 * 3. react 把JSX转化为AST Vue是吧template转化为AST 都是语法层面的转化
 * 
 * AST做的是将HTML模板转化为一颗JS树的对象，做的是语法层面的转化，不能放自定义的属性，html标签是什么样子就转化为什么样，AST还可以描述css、es6语法、jsx等，描述的是语言本身
 * 
 * 
 * 虚拟DOM做的是描述DOM元素，可以增加一些自定义的属性，比如vm属性，插槽，指令等，核心是更加好的描述DOM元素
 * @param {Object} vm
 * @param {Object} tag
 * @param {Object} key
 * @param {Object} props
 * @param {Object} children
 * @param {Object} text
 * 
 */
function createVNode(vm,tag,key,data,children,text){
	return {
		vm,
		tag,
		key,
		data,
		children,
		text
	}
}

