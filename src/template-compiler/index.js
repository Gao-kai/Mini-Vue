import {
	parseHTML,
	ELEMENT_TYPE,
	TEXT_TYPE
} from './htmlParser.js'

import {
	defaultTagReg
} from './tagRegs.js'
/**
 * Vue 2.0 模板编译
 * @param {Object} template 需要被编译的模板
 * @return {function} render 生成的render方法
 * 
 * 1. 将传入的template转化成为AST抽象语法树
 * 2. 生成render方法
 * 3. 执行render方法的返回值就是虚拟DOM
 * 4. 将虚拟DOM转化为真实DOM
 */
export function compileToFunction(template) {
	/*
		第一步：生成AST抽象语法树
		{
			tag:"div",
			type:1,
			attrs:[{name:'lilei',age:'18'}],
			parent:null,
			children:[
				{
					tag:"div",
					type:1,
					attrs:[{name:'lilei',age:'18'}],
					parent:,
					children:[...]
				}
			]
		}
	*/
	let ast = parseHTML(template);

	/* 
		第二步：基于ast语法树拼接生成需要的代码字符串
		render方法，render方法执行后返回的结果就是虚拟DOM
		实现c v s函数
	 */
	let code = codeGenerator(ast);
	
	code = `with(this){
		return ${code};
	}`
	
	
	
	/* 
		第三步：如何将代码字符串执行呢
		new Function语法：
		只传递一个参数，那么会返回一个匿名的函数，函数体就是参数
		new Function(functionBody)
		
		传递多个参数，前面的参数都是函数的形参，最后一个参数是函数体
		new Function(arg0, functionBody)
		new Function(arg0, arg1, functionBody)
		new Function(arg0, arg1, ..., argN, functionBody)
		
		new Funtion生成的函数只能在全局作用域中运行，在调用该函数的时候只能访问全局变量和自己局部变量
		let x = 100;
		function demo(){
			let x = 100;
			return new Function('console.log(x)')
		}
		
		let f = demo();
		f();// 100 因为只能访问全局的变量
		
	 */
	
	let render = new Function(code);
	// console.log('render函数',render)
	
	/* 执行render函数 用call绑定this */

	// render() {
	// 	return _c('div', {
	// 		id: 'app'
	// 	}, _c('div', {
	// 		style: {
	// 			color: 'red'
	// 		}
	// 	}, _v('姓名：' + _s(name)),_c('p',null,_v('年龄：' + _s(age)))))
	// }
	// c创建元素的 v创建文本的 s是stringify

	return render;

}

function codeGenerator(astNode) {
	// let attrsCode = generatorProps(astNode.attrs);
	let childrenCode = generatorChildren(astNode.children);
	// console.log('childrenCode',childrenCode);
	let code =
		`_c('${astNode.tag}',${ astNode.attrs.length ? generatorProps(astNode.attrs):'null'}${ astNode.children.length ? `,${childrenCode}`:''})`;

	// console.log('code', code);
	return code;
}

function generatorChildren(children) {
	if(children){
		return children.map(child => generatorChild(child)).join(',')
	}
}

function generatorChild(astNode) {

	// 元素 生成元素
	if (astNode.type === ELEMENT_TYPE) {
		return codeGenerator(astNode);
	}

	// 文本 创建文本
	/**
	 * 1. 纯文本
	 * eg:hahah ===> re:`_v(hahah)`
	 * 
	 * 2. {{name}}
	 * 3. {{name}} + '纯文本' + {{age}}
	 * 
	 * eg:{{name}} hahah {{ age}} ===> re:`_v(_s(name) + hahah + _s(age))`
	 * 
	 */
	if (astNode.type === TEXT_TYPE) {
		let text = astNode.text;
		if (!defaultTagReg.test(text)) {
			// 说明是纯文本
			return `_v(${JSON.stringify(text)})`
		} else {
			// 说明文本中包含一个或多个表达式文本
			let tokens = [];
			let match;
			let lastIndex = 0;
			// 重置下正则的lastIndex属性为0
			defaultTagReg.lastIndex = 0;
			while (match = defaultTagReg.exec(text)) {
				// 获取当前这一次匹配到{{}}开始的位置
				let index = match.index;
				if (index - lastIndex > 0) {
					tokens.push(JSON.stringify(text.slice(lastIndex, index)));
				}
				tokens.push(`_s(${match[1].trim()})`)
				// 更新lastIndex 便于截取两个{{}}之间的字符 
				lastIndex = index + match[0].length;
			}
			if (lastIndex < text.length) {
				tokens.push(JSON.stringify(text.slice(lastIndex, text.length)));
			}
			// console.log('tokens', tokens);
			return `_v(${tokens.join('+')})`
		}
	}

}

function generatorProps(attrs) {
	if (attrs.length === 0) return 'null'

	let propsStr = '';
	for (let attr of attrs) {
		let key = attr.name;
		let value = attr.value;

		// 当属性的key是style的时候 需要特殊处理value为对象
		if (key === 'style') {
			let styleObj = {};

			if (value[value.length - 1] === ';') {
				value = value.slice(0, -1);
			}

			value.split(';').forEach(item => {
				let [k, v] = item.split(':');
				styleObj[k] = v;
			})
			value = styleObj;
		}

		// 不同属性间用逗号隔开 id:100,name:'lilei'
		propsStr += `${key}:${JSON.stringify(value)},`;
	}
	// 循环结束之后末尾会多一个逗号,
	return `{${propsStr.slice(0,-1)}}`;
}
