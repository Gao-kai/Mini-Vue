import {
	startTagOpen,
	startTagClose,
	endTag,
	attribute,
	defaultTagReg
} from './tagRegs.js'

export const ELEMENT_TYPE = 1;
export const TEXT_TYPE = 3;

/**
 * 1. 解析html字符串的开头一定是< 
 * 2. 解析html字符串的原则是每解析一个标签就从html中将其删除
 * 3. 直到html截取空了，此时模板就解析完成了
 * 4. Vue3.0支持直接在template中写字符串，Vue2.0不行
 * 5. 返回值是AST抽象语法树
 * 
 */
export function parseHTML(htmlStr) {

	// 定义创建AST节点所需变量
	const stack = [];
	let currentParent; // 永远指向栈中最后一个元素的指针
	let root;

	/**
	 * 创建AST节点
	 */
	function createASTElement(tag, attrs) {
		return {
			tag,
			type: ELEMENT_TYPE,
			attrs,
			parent: null,
			children: []
		}
	}

	/**
	 * @param {Object} tagName
	 * @param {Object} attrs
	 * 根据正则匹配到的开始标签的tagName和attrs构建AST节点
	 */
	function start(tagName, attrs) {
		console.log(tagName, attrs, '开始标签');

		let astNode = createASTElement(tagName, attrs);
		// 如果root为空 就是AST树的根节点
		if (!root) {
			root = astNode;
		}

		if (currentParent) {
			astNode.parent = currentParent;
			currentParent.children.push(astNode);
		}

		stack.push(astNode);
		currentParent = astNode; // currentParent指向栈中最后一个元素
	}

	/**
	 * @param {Object} tagName
	 * 根据正则匹配到的结束标签的tagName构建AST节点
	 */
	function end(tagName) {
		console.log(tagName, '结束标签');
		let astNode = stack.pop(); // 栈顶弹出最后一个 校验标签是否合法
		if (astNode.tag !== tagName) {
			console.error('标签不合法')
		}
		currentParent = stack[stack.length - 1]; // 重新指向栈中最后一个
	}

	/**
	 * @param {Object} text
	 * 根据正则匹配到的文本text构建AST节点
	 */
	function chars(text) {
		console.log(text, '文本内容');
		text = text.replace(/\s/g, '') // 将多个空格替换为1个
		// 文本直接放到当前指向的节点的children下
		text && currentParent.children.push({
			text,
			type: TEXT_TYPE,
			parent: currentParent
		})
	}

	/**
	 * 将htmlStr从索引为n的地方截取到末尾 并返回截取后的htmlStr
	 */
	function advance(n) {
		htmlStr = htmlStr.slice(n);
	}

	/**
	 * 根据正则匹配解析开始标签
	 */
	function parseStartTag() {
		const start = htmlStr.match(startTagOpen);
		console.log('匹配开始标签正则的结果', start);

		if (start) {
			const match = {
				tagName: start[1], // 捕获到的是标签名
				attrs: []
			}
			advance(start[0].length);

			// 只要不是开始标签的结束就一直匹配 同时记录属性
			let attrResult;
			let endResult;
			while (!(endResult = htmlStr.match(startTagClose)) && (attrResult = htmlStr.match(attribute))) {
				advance(attrResult[0].length);
				match.attrs.push({
					name: attrResult[1],
					value: attrResult[3] || attrResult[4] || attrResult[5] || true
				});
			}

			// 处理结束标签
			if (endResult) {
				advance(endResult[0].length);
			}

			console.log('解析开始标签的结果', match, htmlStr);
			return match;
		}

		return false; // 说明不是开始标签
	}


	// 开始循环解析htmlStr模板字符串 直至htmlStr为空
	while (htmlStr) {
		/**
		 * 如何确定父子关系：基于栈模拟标签的顺序关系
		 * 1. 遇到一个开始标签div，就先压入栈底【div】
		 * 2. 再遇到一个开始标签比如p，就再压入栈，此时栈底的div就是p的父元素 【div p】
		 * 3. 遇到一个结束标签</p>,就和栈顶进行匹配 如果匹配ok 就从栈中弹出【div p p】
		 * 4. 知道全部解析完成 栈清空 说明标签匹配完了 【】
		 */

		let textEnd = htmlStr.indexOf('<')
		
		// 1.textEnd值为0 代表解析到了一个开始标签<div>或者结束标签</div>
		if (textEnd === 0) {
			// 解析到的开始标签的匹配结果
			const startTagMatch = parseStartTag();
			if (startTagMatch) {
				start(startTagMatch.tagName, startTagMatch.attrs);
				continue;
			}
			// 解析到的是结束标签
			const endTagMatch = htmlStr.match(endTag);
			if (endTagMatch) {
				advance(endTagMatch[0].length);
				end(endTagMatch[1])
				continue;
			}

		}

		// 2.textEnd值>0 代表解析到了文本结束的位置<div>文本</div>
		if (textEnd > 0) {
			// 解析到的文本结果
			let text = htmlStr.slice(0, textEnd);
			if (text) {
				chars(text);
				advance(text.length);
			}
		}
	}

	console.log('root', root);
	return root;
}
