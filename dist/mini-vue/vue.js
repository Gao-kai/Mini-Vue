(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var id$1 = 0; // 属性的dep核心目的：收集watcher 也称之为属性的收集器

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.subs = []; // 存放着当前属性对应的watcher都有哪些
    }
    /**
     * 
     * @param {Object} watcher
     */


    _createClass(Dep, [{
      key: "depend",
      value: function depend(watcher) {
        // 让watcher先记住dep 比直接push实现去重 这个this是dep
        watcher.addDep(this); // 直接在这里无脑push 不会去重
        // this.subs.push(watcher);
      }
      /**
       * @param {Object} watcher
       * 给属性的dep收集器记录收集了多少个watcher
       * 其实就是记录这个属性有多少个组件模板在引用
       */

    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
      /**
       * 通知当前dep收集的watcher更新视图
       */

    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          watcher.update();
        });
      }
    }]);

    return Dep;
  }(); // 给Dep挂载一个全局属性 暴露出去 初始值为null 就是一个全局变量


  Dep.target = null;

  function observe(data) {
    if (_typeof(data) !== 'object' || data === null) return; // 如果一个对象的__ob__属性存在并且是Observer的实例 那么说明这个对象已经被观测过了

    if (data.__ob__ instanceof Observer) {
      return data.__ob__;
    }

    return new Observer(data);
  } // 观测数组和对象的类

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 让__ob__属性的可被遍历属性设置为false
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumrable: false,
        configurable: false
      });

      if (Array.isArray(data)) {
        var newArrayProto = createNewArrayProto();
        data.__proto__ = newArrayProto; // 会将数组中的对象的属性进行劫持

        this.observeArray(data);
      } else {
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          // 单独定义  公共 方便导出 不放在类上
          defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          observe(item);
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(target, key, value) {
    // 递归劫持 如果对象的属性值还是一个对象
    observe(value);
    /**
     * 每一个属性在defineProperty前都有一个独立的dep
     * 这个dep由于和defineProperty中的get方法形成闭包
     * 不会被垃圾回收所销毁
     */

    var dep = new Dep();
    Object.defineProperty(target, key, {
      // 拦截取值操作
      get: function get() {
        console.log('取值操作', key, value); // 属性的收集器dep 进行依赖收集

        if (Dep.target) {
          dep.depend(Dep.target);
        }

        return value;
      },
      // 拦截赋值操作
      set: function set(newValue) {
        console.log('存值操作', key, value);
        if (newValue === value) return; // 如果新赋的值是一个新的对象 还需要劫持

        observe(newValue);
        value = newValue; // 响应式属性值变化 通知此属性dep收集到的watcher更新视图

        dep.notify();
      }
    });
  }

  function createNewArrayProto() {
    var oldArrayProto = Array.prototype;
    var newArrayProto = Object.create(oldArrayProto); // 以下7个方法会改变原数组

    var methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
    methods.forEach(function (method) {
      newArrayProto[method] = function () {
        var _oldArrayProto$method;

        console.log('监听到调用了数组方法', method);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args)); // 需要对操作数组方法的时候新增的数据 再次进行劫持


        var inserted;

        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args;
            break;

          case 'splice':
            inserted = args.slice(2);
            break;
        }

        console.log('inserted', inserted);

        if (inserted) {
          // 对新增的内容再次进行劫持
          this.__ob__.observeArray(inserted);
        }

        return result;
      };
    });
    return newArrayProto;
  }

  // 将target对象上的所有

  /**
   * @param {Object} vm Vue实例对象
   * @param {Object} target 要代理的vm上的目标对象_data = {}
   * @param {Object} key 目标对象的属性 name
   * 实现访问vm.name = 访问vm._data.name
   */
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }

  /**
   * 1. 获取数据
   * 2. 对获取到的data进行响应式处理
   */

  function initData(vm) {
    var data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data; // 将要劫持的对象放在实例上 便于观测效果

    vm._data = data;
    observe(data); // 数据代理

    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  function initState(vm) {
    var options = vm.$options; // 获取用户传入的选项

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

  // 匹配解析正则表达式
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  /**
   * 正则startTagOpen用来匹配开始标签的名字
   * 1.以<开头
   * 2.标签名不能以数字开头，可以使用字母和下划线 <div 自定义标签<_demo
   * 3.除了标签名的首字母不可以是字符 第二位可使用数字 <h1
   * 4.考虑存在命名空间的标签比如 <namespace:div 虽然很少见
   * 5.此正则匹配到的分组是标签名组成的字符串
   */

  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  /**
   * 正则startTagClose用来匹配结束标签
   * 1.可以有一个/，比如单标签<br/>的结束/>
   * 2.可以没有/，比如正常标签的结束>
   */

  var startTagClose = /^\s*(\/?)>/;
  /**
   * 正则endTag用来匹配结束标签的名字
   * 1.以</开头
   * 2.匹配到的是</div的标签名组成的字符串
   */

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  /**
   * 正则attribute用来匹配属性
   * 1. 属性的前面可以有空白字符，但是不能有特殊字符
   * 2. 匹配的属性可以是：color = "xxx"
   * 3. 匹配的属性可以是：color = 'yyy'
   * 4. 匹配的属性可以是：color = zzz
   * 5. 此正则匹配到的分组是1分组-属性key 3分组或4分组或5分组-属性value
   */

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  /**
   * defaultTagReg匹配到的是{{xxx }} 表达式的变量xxx
   * 
   */

  var defaultTagReg = /\{\{((?:.|\r?\n)+?)\}\}/g;

  var ELEMENT_TYPE = 1;
  var TEXT_TYPE = 3;
  /**
   * 1. 解析html字符串的开头一定是< 
   * 2. 解析html字符串的原则是每解析一个标签就从html中将其删除
   * 3. 直到html截取空了，此时模板就解析完成了
   * 4. Vue3.0支持直接在template中写字符串，Vue2.0不行
   * 5. 返回值是AST抽象语法树
   * 
   */

  function parseHTML(htmlStr) {
    // 定义创建AST节点所需变量
    var stack = [];
    var currentParent; // 永远指向栈中最后一个元素的指针

    var root;
    /**
     * 创建AST节点
     */

    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        type: ELEMENT_TYPE,
        attrs: attrs,
        parent: null,
        children: []
      };
    }
    /**
     * @param {Object} tagName
     * @param {Object} attrs
     * 根据正则匹配到的开始标签的tagName和attrs构建AST节点
     */


    function start(tagName, attrs) {
      console.log(tagName, attrs, '开始标签');
      var astNode = createASTElement(tagName, attrs); // 如果root为空 就是AST树的根节点

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
      var astNode = stack.pop(); // 栈顶弹出最后一个 校验标签是否合法

      if (astNode.tag !== tagName) {
        console.error('标签不合法');
      }

      currentParent = stack[stack.length - 1]; // 重新指向栈中最后一个
    }
    /**
     * @param {Object} text
     * 根据正则匹配到的文本text构建AST节点
     */


    function chars(text) {
      console.log(text, '文本内容');
      text = text.replace(/\s/g, ''); // 将多个空格替换为1个
      // 文本直接放到当前指向的节点的children下

      text && currentParent.children.push({
        text: text,
        type: TEXT_TYPE,
        parent: currentParent
      });
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
      var start = htmlStr.match(startTagOpen);
      console.log('匹配开始标签正则的结果', start);

      if (start) {
        var match = {
          tagName: start[1],
          // 捕获到的是标签名
          attrs: []
        };
        advance(start[0].length); // 只要不是开始标签的结束就一直匹配 同时记录属性

        var attrResult;
        var endResult;

        while (!(endResult = htmlStr.match(startTagClose)) && (attrResult = htmlStr.match(attribute))) {
          advance(attrResult[0].length);
          match.attrs.push({
            name: attrResult[1],
            value: attrResult[3] || attrResult[4] || attrResult[5] || true
          });
        } // 处理结束标签


        if (endResult) {
          advance(endResult[0].length);
        }

        console.log('解析开始标签的结果', match, htmlStr);
        return match;
      }

      return false; // 说明不是开始标签
    } // 开始循环解析htmlStr模板字符串 直至htmlStr为空


    while (htmlStr) {
      /**
       * 如何确定父子关系：基于栈模拟标签的顺序关系
       * 1. 遇到一个开始标签div，就先压入栈底【div】
       * 2. 再遇到一个开始标签比如p，就再压入栈，此时栈底的div就是p的父元素 【div p】
       * 3. 遇到一个结束标签</p>,就和栈顶进行匹配 如果匹配ok 就从栈中弹出【div p p】
       * 4. 知道全部解析完成 栈清空 说明标签匹配完了 【】
       */
      var textEnd = htmlStr.indexOf('<'); // 1.textEnd值为0 代表解析到了一个开始标签<div>或者结束标签</div>

      if (textEnd === 0) {
        // 解析到的开始标签的匹配结果
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        } // 解析到的是结束标签


        var endTagMatch = htmlStr.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      } // 2.textEnd值>0 代表解析到了文本结束的位置<div>文本</div>


      if (textEnd > 0) {
        // 解析到的文本结果
        var text = htmlStr.slice(0, textEnd);

        if (text) {
          chars(text);
          advance(text.length);
        }
      }
    }

    console.log('root', root);
    return root;
  }

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

  function compileToFunction(template) {
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
    var ast = parseHTML(template);
    /* 
    	第二步：基于ast语法树拼接生成需要的代码字符串
    	render方法，render方法执行后返回的结果就是虚拟DOM
    	实现c v s函数
     */

    var code = codeGenerator(ast);
    code = "with(this){\n\t\treturn ".concat(code, ";\n\t}");
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

    var render = new Function(code);
    console.log('render函数', render);
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
    var childrenCode = generatorChildren(astNode.children);
    console.log('childrenCode', childrenCode);
    var code = "_c('".concat(astNode.tag, "',").concat(astNode.attrs.length ? generatorProps(astNode.attrs) : 'null').concat(astNode.children.length ? ",".concat(childrenCode) : '', ")");
    console.log('code', code);
    return code;
  }

  function generatorChildren(children) {
    if (children) {
      return children.map(function (child) {
        return generatorChild(child);
      }).join(',');
    }
  }

  function generatorChild(astNode) {
    // 元素 生成元素
    if (astNode.type === ELEMENT_TYPE) {
      return codeGenerator(astNode);
    } // 文本 创建文本

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
      var text = astNode.text;

      if (!defaultTagReg.test(text)) {
        // 说明是纯文本
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        // 说明文本中包含一个或多个表达式文本
        var tokens = [];
        var match;
        var lastIndex = 0; // 重置下正则的lastIndex属性为0

        defaultTagReg.lastIndex = 0;

        while (match = defaultTagReg.exec(text)) {
          // 获取当前这一次匹配到{{}}开始的位置
          var index = match.index;

          if (index - lastIndex > 0) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }

          tokens.push("_s(".concat(match[1].trim(), ")")); // 更新lastIndex 便于截取两个{{}}之间的字符 

          lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex, text.length)));
        }

        console.log('tokens', tokens);
        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }

  function generatorProps(attrs) {
    if (attrs.length === 0) return 'null';
    var propsStr = '';

    var _iterator = _createForOfIteratorHelper(attrs),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var attr = _step.value;
        var key = attr.name;
        var value = attr.value; // 当属性的key是style的时候 需要特殊处理value为对象

        if (key === 'style') {
          (function () {
            var styleObj = {};

            if (value[value.length - 1] === ';') {
              value = value.slice(0, -1);
            }

            value.split(';').forEach(function (item) {
              var _item$split = item.split(':'),
                  _item$split2 = _slicedToArray(_item$split, 2),
                  k = _item$split2[0],
                  v = _item$split2[1];

              styleObj[k] = v;
            });
            value = styleObj;
          })();
        } // 不同属性间用逗号隔开 id:100,name:'lilei'


        propsStr += "".concat(key, ":").concat(JSON.stringify(value), ",");
      } // 循环结束之后末尾会多一个逗号,

    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return "{".concat(propsStr.slice(0, -1), "}");
  }

  var timerFunction; // nextTick处理异步刷新的优雅降级

  function getTimerFn(fn) {
    if (Promise) {
      timerFunction = function timerFunction() {
        Promise.resolve().then(flashCallBacks);
      };
    } else if (MutationObserver) {
      // 这里传入的回调是异步回调 当DOM元素变化的时候触发flashCallBacks
      var mutationOb = new MutationObserver(flashCallBacks);
      var textNode = document.createTextNode(1);
      mutationOb.observe(textNode, {
        characterData: true
      });

      timerFunction = function timerFunction() {
        textNode.textContent = 2;
      };
    } else if (setImmediate) {
      timerFunction = function timerFunction() {
        setImmediate(flashCallBacks);
      };
    } else {
      timerFunction = function timerFunction() {
        setTimeout(flashCallBacks);
      };
    }
  }

  getTimerFn();
  /**
   * @param {Object} callback 回调函数
   * 异步批处理:多次操作执行一次
   */

  function flashCallBacks() {
    var flushCallBacks = callBacks.slice(0); // 清空队列和memo对象以及pending默认值

    callBacks = [];
    waiting = false; // 从保存watcher的队列中依次取出更新视图

    flushCallBacks.forEach(function (cb) {
      cb();
    });
  }

  var callBacks = [];
  var waiting = false;
  function nextTick(callback) {
    // 维护所有来自内部和外部的callback 这是同步操作
    callBacks.push(callback);

    if (!waiting) {
      // 这是异步操作 最后将所有任务一起刷新
      // setTimeout(()=>{
      // 	flashCallBacks();
      // },0)
      timerFunction(flashCallBacks);
      waiting = true;
    }
  }

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    /**
     * @param {Object} vm 实例
     * @param {Object} fn 实例对应的渲染逻辑
     * @param {Object} flag 标识是否为渲染watcher
     */
    function Watcher(vm, fn, flag) {
      _classCallCheck(this, Watcher);

      this.id = id++; // 创建组件唯一的watcher

      this.getter = fn; // getter意味着调用函数可以发生取值操作

      this.renderWatcher = flag; // 标识是否为渲染watcher

      /**
       * 记录当前这个组件watcher实例上观察了多少个属性，目的：
       * 1.实现computed计算属性
       * 2.组件卸载之后需要将当前组件watcher绑定的所有dep释放
       * 3.watcher和dep是多对多的关系
       */

      this.deps = []; // 记录当前watcher绑定的dep的id数组 实现去重操作

      this.depsId = new Set(); // 每次new Watcher 会执行并渲染视图

      this.get();
    }
    /**
     * @param {Object} dep 属性的收集器
     * 给watcher记录关联了多少个属性dep
     * 
     * 注意：重复的属性也不用重复push记录，因为一个watcher组件模板中可能绑定了多个重复的属性，比如一个组件模板多个地方用到属性name这是很常见的
     */


    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        var depId = dep.id; // 使用set实现watcher关联的属性dep 去重 避免同一属性重复watcher重复关联

        if (!this.depsId.has(depId)) {
          // 先让watcher记住其关联的dep
          this.deps.push(dep); // 为了下次depsId可以进行去重判断

          this.depsId.add(depId); // 最后才让dep记住其关联的watcher 这个this是watcher

          dep.addSub(this);
        }
      }
    }, {
      key: "get",
      value: function get() {
        // 给Dep类的静态属性target赋值
        Dep.target = this;
        /**
         * 1.执行getter就等于执行组件new Watcher的时候传递进来的渲染逻辑函数中的_render
         * 2.就等于执行$options.render.call(vm)
         * 3.就等于去vm上获取模板中变量vm.name和vm.age的值
         * 4.就会触发绑定在模板上属性defineProperty的get方法
         */

        this.getter(); // 渲染完成之后将Dep.target设置为null

        Dep.target = null;
      }
      /**
       * watcher组件更新视图 
       * 如果同一个组件A模板中绑定的name和age属性值都发生了set操作
       * 那么原本直接执行watcher的get方法会触发两次视图渲染
       * 这里设计一个队列将watcher都缓存起来 只更新一次 避免性能浪费
       */

    }, {
      key: "update",
      value: function update() {
        // 先不直接更新watcher的视图 而是将要更新视图的watcher暂存到队列中
        queneWatcher(this);
      }
    }, {
      key: "run",
      value: function run() {
        // 真正执行视图渲染的地方
        this.get();
      }
    }]);

    return Watcher;
  }();
  /**
   * 
   * 1. 同一组件
   * 假设A组件绑定了name和age，此时给name和age赋值触发两次setter，原本要更新A组件两次，现在我们要让它只更新一次视图
   * 
   * 2. 多个组件
   * age属性不只依赖A组件，还依赖于B组件，当age连着两次赋值之后，此时原本A组件和B组件都要更新2次，现在我们要让A和B组件都各更新一次即可
   * 
   * 3.queneWatcher的作用
   * 不管watcher的update方法走了多少次，最后的更新操作只进行一次，那么就要设置一个锁，在第一次代码执行的时候关锁，不让后续的代码触发这个更新操作
   */


  var quene = []; // 缓存数组 存放的watcher在后续都会执行一次刷新操作

  var memo = {}; // 去重

  var pending = false; // 防抖

  function queneWatcher(watcher) {
    var watcherId = watcher.id; // watcher去重

    if (!memo[watcherId]) {
      quene.push(watcher);
      memo[watcherId] = true;
      console.log(quene);
      /**
       * 不管此方法执行多少次 最终的视图刷新操作只执行一次 
       * 为什么要将刷新的操作写在异步代码中呢 
       * 就是为了利用事件环的机制 
       * 让此异步代码等到前面的所有同步代码执行完成之后再执行 
       * 也就实现了多次属性值修改只执行一次更新的操作
       */

      if (!pending) {
        // setTimeout(flushSchedulerQuene,0)
        nextTick(flushSchedulerQuene);
        pending = true;
      }
    }
  }
  /**
   * 把缓存在队列中的watcher拿出来 
   * 依次执行其更新视图操作
   */


  function flushSchedulerQuene() {
    console.log('执行异步批量渲染'); // 浅克隆一份

    var flushWatcherQuene = quene.slice(0); // 清空队列和memo对象以及pending默认值

    quene = []; // 保证在刷新的过程中有新的watcher重新放入队列中

    memo = {};
    pending = false; // 从保存watcher的队列中依次取出更新视图

    flushWatcherQuene.forEach(function (watcher) {
      watcher.run();
    });
  }

  /**
   * 组件挂载流程
   * @param {Object} vm 挂载组件所需的Vue实例对象
   * @param {Object} el 组件所在的DOM元素对象
   */

  function mountComponent(vm, el) {
    /**
     * 1. 调用render方法产生虚拟节点 -虚拟DOM => vm._render()
     * 2. 根据虚拟DOM生成真实DOM 
     * 3. 用新的真实DOM替换el DOM元素
     */
    vm.$el = el; // 方便在实例调用_update的时候直接通过$el属性取值
    // 定义渲染逻辑函数 每次执行这个函数就会对组件进行重新渲染

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    }; // 创建watcher new的过程就是渲染视图的过程


    var watcher = new Watcher(vm, updateComponent, true);
    console.log('watcher', watcher);
  }

  function initMixin(Vue) {
    /* 在这里给Vue原型拓展方法 */
    Vue.prototype._init = function (options) {
      // 给生成的实例上挂载$options用于在其他地方获取用户传入的配置
      var vm = this;
      vm.$options = options; // 开始初始化options中的各个状态 data - props - methods...

      initState(vm); // 如果用户传入了el属性 就使用$mount进行挂载

      if (options.el) {
        vm.$mount(options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      var element = document.querySelector(el);
      /* 编译模板优先级 render - template - el */

      if (!options.render) {
        var template; // 如果没有传递template属性但是有element

        if (!options.template && element) {
          template = element.outerHTML;
        } else {
          // 如果template属性和element属性都有 这里的判断没有考虑太完全
          template = options.template;
        } // 获取到模板template 就需要对模板进行编译 输入template 输出render函数


        if (template) {
          var render = compileToFunction(template);
          options.render = render;
        }
      } // 组件的挂载：将实例vm对象挂载到DOM元素el上面
      // vm.$options中可以获取前面生成的render函数


      mountComponent(vm, element);
    };
  }

  /**
   * 创建虚拟DOM 元素节点
   * h方法和_c都是这个方法
   */
  function createElementVNode(vm, tag, data) {
    if (data == null) {
      data = {};
    }

    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    return createVNode(vm, tag, key, data, children);
  }
  /**
   * 创建虚拟DOM 文本节点
   * _v就是这个方法
   */

  function createTextVNode(vm, text) {
    return createVNode(vm, null, null, null, null, text);
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

  function createVNode(vm, tag, key, data, children, text) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text
    };
  }

  /**
   * 1. 初始化渲染
   * 2. 异步更新diff算法
   * patch是更新的意思
   */

  function patch(oldVNode, VNode) {
    // 如果oldVNode是一个真实的DOM元素 那么代表传递进来的是要挂载的DOM节点 是初始化渲染
    var isRealDomElement = oldVNode.nodeType;

    if (isRealDomElement) {
      // 开始初始化渲染
      // 1.基于VNode虚拟DOM创建真实DOM元素
      var newElement = createElement(VNode);
      console.log('newElement', newElement); // 2.新节点newElement替换老节点el 也是有讲究的
      // 假设要将A节点的内容替换为B节点的，需要先将B插入到A的下一个兄弟节点位置，然后移除A节点；而不能直接先将A移除，然后找到A的父元素appendChild，这样会插入到A的父元素的末尾去，导致前后节点位置发生变化

      var parentNode = oldVNode.parentNode;
      parentNode.insertBefore(newElement, oldVNode.nextSibling);
      parentNode.removeChild(oldVNode); // 3. 返回新的DOM

      return newElement;
    }
  }
  /**
   * @param {Object} VNode
   * 根据虚拟DOM节点创建真实DOM节点
   * 这个真实的DOM节点就是最终要替代传入的el节点的元素节点
   */


  function createElement(VNode) {
    var tag = VNode.tag,
        data = VNode.data,
        children = VNode.children,
        text = VNode.text; // 在_render方法生成虚拟DOM节点的时候设置了如果tag是一个字符串，那么就是元素节点；如果是null就是文本节点

    if (typeof tag === 'string') {
      // 将虚拟DOM和新建的真实DOM联系起来
      VNode.el = document.createElement(tag); // 给新DOM节点的属性赋值

      patchProps(data, VNode.el); // 给新DOM节点的children赋值

      children.forEach(function (child) {
        VNode.el.appendChild(createElement(child));
      });
    } else {
      // 创建文本节点
      VNode.el = document.createTextNode(text);
    }

    return VNode.el;
  }
  /**
   * @param {Object} props 属性组成的对象
   * @param {Object} el 当前属性要挂载的元素节点
   * props:{ id:'app',style:{ color:red}}
   */


  function patchProps(props, el) {
    for (var key in props) {
      if (key === 'style') {
        // 再次从style对象中取值 给el的style赋值
        for (var styleProp in props.style) {
          el.style[styleProp] = props.style[styleProp];
        }
      } else {
        el.setAttribute(key, props[key]);
      }
    }
  }

  function initLifeCycle(Vue) {
    /* 渲染虚拟DOM */
    Vue.prototype._render = function () {
      var vm = this; // 让with里面的this指向vm实例，就可以去实例中取值
      // 这一步就可以将属性和视图进行挂钩

      return vm.$options.render.call(vm);
    }; // 生成元素节点


    Vue.prototype._c = function () {
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    }; // 生成文本节点


    Vue.prototype._v = function () {
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    }; // 转义字符串


    Vue.prototype._s = function (value) {
      // 不是对象类型的话 没必要转义
      if (_typeof(value) !== 'object') return value;
      return JSON.stringify(value);
    };
    /* 转化真实DOM */


    Vue.prototype._update = function (vNode) {
      var vm = this;
      var el = vm.$el; // 此el是querySelector获取到的dom元素对象，不是new Vue时传入的选择符字符串'#app'

      console.log('执行render函数返回的虚拟节点', vNode);
      console.log('要挂载的真实DOM节点', el);
      /**
       * Vue2.0和Vue3.0
       * patch既有初始化的功能，又有更新视图的功能
       * 将虚拟DOM转化为真实DOM
       * 
       * 用vNode创建真实DOM节点，然后替换到原来的el元素节点
       * 并将patch后的返回值也就是新的真实DOM节点赋值给实例的$el属性
       * 为了下一次更新的时候老的el就是上一次生成的真实DOM节点
       */

      vm.$el = patch(el, vNode);
    };
  }

  /* 打包入口文件 */

  function Vue(options) {
    this._init(options);
  } // 原型挂载核心API 


  Vue.prototype.$nextTick = nextTick; // 给Vue类拓展初始化options的方法

  initMixin(Vue); // 模板编译 组件挂载

  initLifeCycle(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
