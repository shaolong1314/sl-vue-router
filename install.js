/*
 * @Author: shaolong
 * @Date: 2022-10-11 09:36:12
 * @LastEditors: shaolong
 * @LastEditTime: 2022-10-13 09:24:52
 * @Description:
 */
import Link from "./components/link";
import View from "./components/view";

export default function install(Vue) {
  // 安装过直接跳出
  if (install.installed) return;

  // 首次调用Vue.use(VueRouter)时，将install.installed变为true
  install.installed = true;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        // 如果当前options存在router对象 表示该实例是根对象
        this._rootRouter = this;
        this._rootRouter._router = this.$options.router;

        // 调用 _router 实例上的init方法初始化路由
        this._router.init(this);

        // 当根组件挂载 _router 时候 我们在根组件上定义了一个_route响应式属性 初始值为 this._router.history.current
        Vue.util.defineReactive(this, "_route", this._router.history.current);
      } else {
        // 非根组件实例
        this._rootRouter = this.$parent && this.$parent._rootRouter;
      }
    },
  });

  // 注册组件
  Vue.component("router-link", Link);
  Vue.component("router-view", View);

  // 定义原型$router对象
  Object.defineProperty(Vue.prototype, "$router", {
    get() {
      return this._rootRouter._router;
    },
  });

  // 定义原型$route对象
  // to do ...
  Object.defineProperty(Vue.prototype, "$route", {
    get() {
      return this._rootRouter._route;
    },
  });
}
