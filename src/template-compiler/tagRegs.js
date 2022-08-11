// 匹配解析正则表达式
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
/**
 * 正则startTagOpen用来匹配开始标签的名字
 * 1.以<开头
 * 2.标签名不能以数字开头，可以使用字母和下划线 <div 自定义标签<_demo
 * 3.除了标签名的首字母不可以是字符 第二位可使用数字 <h1
 * 4.考虑存在命名空间的标签比如 <namespace:div 虽然很少见
 * 5.此正则匹配到的分组是标签名组成的字符串
 */
export const startTagOpen = new RegExp(`^<${qnameCapture}`);

/**
 * 正则startTagClose用来匹配结束标签
 * 1.可以有一个/，比如单标签<br/>的结束/>
 * 2.可以没有/，比如正常标签的结束>
 */
export const startTagClose = /^\s*(\/?)>/;

/**
 * 正则endTag用来匹配结束标签的名字
 * 1.以</开头
 * 2.匹配到的是</div的标签名组成的字符串
 */
export const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);

/**
 * 正则attribute用来匹配属性
 * 1. 属性的前面可以有空白字符，但是不能有特殊字符
 * 2. 匹配的属性可以是：color = "xxx"
 * 3. 匹配的属性可以是：color = 'yyy'
 * 4. 匹配的属性可以是：color = zzz
 * 5. 此正则匹配到的分组是1分组-属性key 3分组或4分组或5分组-属性value
 */
export const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

/**
 * defaultTagReg匹配到的是{{xxx }} 表达式的变量xxx
 * 
 */
export const defaultTagReg = /\{\{((?:.|\r?\n)+?)\}\}/g;
