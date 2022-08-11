import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";

export default {
  input: "./src/index.js", //打包入口路径
  output: {
    file: "dist/mini-vue/vue.js", //打包出口路径
    name: "Vue", //指定打包后全局变量的名字
    format: "umd", //统一模块规范为umd   =>"amd", "cjs", "system", "es", "iife" or "umd"
    sourcemap: "true", // 最终的代码是ES6转化后的ES5 开启ES6源代码提示 可以找到源代码的报错位置
  },
  plugins: [
    babel({
      exclude: "node_modules/**", // 排除node_modules目录下的所有文件不进行babel处理
    }),
    // 通过环境变量判断当前环境是否为开发环境，只有在开发环境下才启动静态服务 否则不启动
    process.env.ENV === "development"
      ? serve({
          open: true, // 自动打开浏览器
          openPage: "/public/index.html", // 浏览器要加载打开html网页的路径
          port: 3000, // 端口号
          contentBase: "", // 静态文件的路径 默认为空 代表以当前文件夹的根目录启动服务
        })
      : null,
  ],
};
