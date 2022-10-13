(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SVueRouter"] = factory();
	else
		root["SVueRouter"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ install; }
/* harmony export */ });
/* harmony import */ var _components_link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _components_view__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/*
 * @Author: shaolong
 * @Date: 2022-10-11 09:36:12
 * @LastEditors: shaolong
 * @LastEditTime: 2022-10-13 09:24:52
 * @Description:
 */



function install(Vue) {
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
  Vue.component("router-link", _components_link__WEBPACK_IMPORTED_MODULE_0__["default"]);
  Vue.component("router-view", _components_view__WEBPACK_IMPORTED_MODULE_1__["default"]);

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


/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  name: "RouterLink",
  props: {
    to: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: "a",
    },
  },
  methods: {
    handleJump() {
      this.$router.push(this.to);
    },
  },
  render(h) {
    return h(
      this.tag,
      {
        on: {
          click: () => {
            this.handleJump();
          },
        },
      },
      this.$slots.default
    );
  },
});


/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/*
 * @Author: shaolong
 * @Date: 2022-10-13 09:58:12
 * @LastEditors: shaolong
 * @LastEditTime: 2022-10-13 09:58:12
 * @Description:
 */
/* harmony default export */ __webpack_exports__["default"] = ({
  name: "RouterView",
  functional: true,
  render(h, ctx) {
    // 标记当前 dataView 为true
    ctx.data.dataView = true;

    let { parent, data } = ctx;

    const route = parent.$route;

    // 表示当前RouterView需要渲染的层级
    let depth = 0;

    // 当寻找到根节点时停止
    while (parent && parent._routerRoot !== parent) {
      // 获取父节点标签上的 data
      const vnodeData = parent.$vnode ? parent.$vnode.data : {};
      if (vnodeData.dataView) {
        // 如果 parent.$vnode.dataView 为 true，则表示当前 routerView 已经渲染过了
        depth++;
      }
      // 递归向上查找
      parent = parent.$parent;
    }

    // 根据depth判断当前router-view 承载的是第几个匹配组件
    const matchRoute = route.matched[depth];
    if (!matchRoute) {
      return h();
    }

    return h(matchRoute.component, data);
  },
});


/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ createMatcher; }
/* harmony export */ });
/* harmony import */ var _create_router_map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _create_route__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/*
 * @Author: shaolong
 * @Date: 2022-10-11 16:46:51
 * @LastEditors: shaolong
 * @LastEditTime: 2022-10-12 17:39:26
 * @Description:
 */

/**
 * @export
 * @param {*} routes 需要注册的路由表（未格式化）
 * @param {*} oldPathList 已经格式化好的路径列表
 * @param {*} oldPathMap 已经格式化好的路径关系表
 * @param {*} oldNameMap 已经格式化好的名称关系表
 */



function createMatcher(routes) {
  // 首先初始化需要格式化路由对象，将传入的路由列表进行扁平化
  const { pathList, pathMap, nameMap } = (0,_create_router_map__WEBPACK_IMPORTED_MODULE_0__["default"])(routes);

  // 动态注册单个路由 本质上还是参数的重载
  // 当动态注册单个路由时 支持覆盖同名路由
  // 同时注册单个路由支持指定在特定的路由中添加子路由 支持parent参数，parentOrRoute如果为字符串，则添加route为该parentOrRoute的子路由
  function addRoute(parentOrRoute, route) {
    // 如果第一个参数传递了非Object对象，那么表示它不是路由对象 代表传递的是对应的parent路由的名称
    const parent =
      typeof parentOrRoute !== "object" ? nameMap[parentOrRoute] : undefined;
    return (0,_create_router_map__WEBPACK_IMPORTED_MODULE_0__["default"])(
      [route || parentOrRoute],
      pathList,
      pathMap,
      nameMap,
      parent
    );
  }

  // 获取当前所有活跃的路由记录
  function getRoutes() {
    return pathList.map((path) => pathMap[path]);
  }

  // 通过路径寻找当前路径匹配的所有record记录
  function match(location) {
    // 判断传入的location是否为字符串 如果为字符串则表示是通过路径跳转
    //  如果为字符串则格式化location返回一个{ path:location } 对象 否则 返回location本身
    const next = typeof location === "string" ? { path: location } : location;
    const { name, path } = next;
    // 如果存在name属性，那么优先会去nameMap中查找当前name对应的Record路由记录
    if (name) {
      const record = nameMap[name];
      // 如果没有匹配的路由记录
      if (!record) return (0,_create_route__WEBPACK_IMPORTED_MODULE_1__["default"])(null, location);
      // 返回时调用createRoute方法 返回完全匹配的路由映射数据（包含嵌套节点）
      return (0,_create_route__WEBPACK_IMPORTED_MODULE_1__["default"])(record, next);
    } else if (path) {
      // 不存在name时则会寻找path对应的Record对象
      const record = pathMap[path];
      if (!record) return (0,_create_route__WEBPACK_IMPORTED_MODULE_1__["default"])(null, location);
      // 返回时调用createRoute方法 返回完全匹配的路由映射数据（包含嵌套节点）
      return (0,_create_route__WEBPACK_IMPORTED_MODULE_1__["default"])(record, next);
    }
  }

  return {
    addRoute,
    getRoutes,
    match,
  };
}


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ createRouteMap; }
/* harmony export */ });
/*
 * @Author: shaolong
 * @Date: 2022-10-12 09:35:36
 * @LastEditors: shaolong
 * @LastEditTime: 2022-10-12 13:54:59
 * @Description:
 */
function createRouteMap(
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap,
  parentRoute
) {
  // 获取之前的路径对应表
  const pathList = oldPathList || [];
  // 创建本次格式化的 pathMap 和 nameMap 对象
  const pathMap = oldPathMap || Object.create(null);
  const nameMap = oldNameMap || Object.create(null);

  // 递归格式化路径记录
  routes.forEach((route) => {
    addRouteRecord(pathList, pathMap, nameMap, route, parentRoute);
  });
  return {
    pathList,
    pathMap,
    nameMap,
  };
}

function addRouteRecord(pathList, pathMap, nameMap, route, parent) {
  const { path, name } = route;

  const normalizedPath = normalizePath(path, parent);
  // 根据route构造record对象
  const record = {
    name: route.name,
    component: route.component,
    path: normalizedPath,
    props: route.props || {},
    meta: route.meta || {},
    parent,
  };

  // 递归添加children属性
  if (route.children) {
    route.children.forEach((child) => {
      addRouteRecord(pathList, pathMap, nameMap, child, record);
    });
  }

  // 不存在则添加进入pathMap
  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  // 不存在则添加进入nameMap
  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    }
  }
}

/**
 *
 * 格式化路径 主要用于拼接嵌套路由的路径
 * @param {*} path
 * @param {*} parent
 * @returns
 */
function normalizePath(path, parent) {
  // 如果不存parent记录
  if (!parent) {
    return path;
  }

  // 如果path以/开头 表示不需要拼接路径
  if (path.startsWith("/")) {
    return path;
  }

  // 判断parent.path 是否以/结尾
  if (parent.path.endsWith("/")) {
    return `${parent.path}${path}`;
  } else {
    return `${parent.path}/${path}`;
  }
}


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ createRoute; }
/* harmony export */ });
/*
 * @Author: shaolong
 * @Date: 2022-10-12 17:17:02
 * @LastEditors: shaolong
 * @LastEditTime: 2022-10-12 17:20:21
 * @Description:
 */

/**
 *
 * 寻找完全匹配的路由对象 比如 /about/about1
 * 它会匹配出两个Record路由对象 [{ path:'/about', ... },{ path:'/about/about1',... }]
 * @export
 * @param {*} record 路由记录对象 （通过 matcher 匹配器属性中维护的列表获取）
 * @param {*} location 用户传入的参数
 * @returns
 */
function createRoute(record, location) {
  const matched = [];

  if (record) {
    while (record) {
      // 首部添加
      matched.unshift(record);
      // 依次递归寻找父路由记录
      record = record.parent;
    }
  }

  return {
    matched,
    ...location,
  };
}


/***/ }),
/* 7 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HashHistory": function() { return /* binding */ HashHistory; },
/* harmony export */   "getHash": function() { return /* binding */ getHash; }
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/*
 * @Author: shaolong
 * @Date: 2022-10-12 16:11:17
 * @LastEditors: shaolong
 * @LastEditTime: 2022-10-12 16:37:14
 * @Description:
 */


class HashHistory extends _base__WEBPACK_IMPORTED_MODULE_0__.BaseHistory {
  constructor(router) {
    super(router);
    // 初始化hash路由时 确保路由存在#并且 #后一定是拼接/
    ensureSlash();
  }

  // 推入记录跳转方法
  push(location) {
    this.transitionTo(location, (route) => {
      // location
      window.location.hash = route.path;
    });
  }

  // 替换当前路由记录跳转
  replace(location) {
    this.transitionTo(location, (route) => {
      window.location.replace(route.path);
    });
  }

  // 设置监听函数
  setupListeners() {
    // 源码中hash路由做了判断优先使用 popstate 不支持情况下才会考虑 hashchange
    // const eventType = supportsPushState ? 'popstate' : 'hashchange'
    // 这里Demo为了简化逻辑直接使用hashchange
    window.addEventListener("hashchange", () => {
      // 当路由变化时获取当前最新hash进行跳转
      this.transitionTo(getHash());
    });
  }

  // 获取当前#之后的路径
  getCurrentLocation() {
    return getHash();
  }
}

/**
 * 确保路由
 *
 * @returns
 */
function ensureSlash() {
  const path = getHash();
  // 如果 # 之后是以 / 开头，return true 什么操作都不进行
  if (path.charAt(0) === "/") {
    return true;
  }
  // 如果getHash() 返回以非 / 开头
  replaceHash("/" + path);
  return false;
}

/**
 * 获取当前页面中#之后的路径
 * 比如 http://hycoding.com/#/a/b 则会返回 /a/b
 * 如果页面当前url不存在 # 那么直接返回 ''
 * @export
 * @returns
 */
function getHash() {
  let href = window.location.href;
  const index = href.indexOf("#");
  if (index < 0) return "";

  href = href.slice(index + 1);

  return href;
}

// 替换当前页面路径
function replaceHash(path) {
  window.location.replace(getUrl(path));
}

/**
 * 比如传入
 * 首先获取当前#前的基础路径 比如http://hycoding.com/#/a/b
 * 此时 base为 http://hycoding.com/
 * 之后使用传入的路径拼接 `${base}#${path}` 返回
 * @param {*} path
 * @returns
 */
function getUrl(path) {
  const href = window.location.href;
  const i = href.indexOf("#");
  const base = i >= 0 ? href.slice(0, i) : href;
  return `${base}#${path}`;
}


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BaseHistory": function() { return /* binding */ BaseHistory; }
/* harmony export */ });
/* harmony import */ var _create_route__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/*
 * @Author: shaolong
 * @Date: 2022-10-12 16:13:13
 * @LastEditors: shaolong
 * @LastEditTime: 2022-10-13 09:27:59
 * @Description:
 */

class BaseHistory {
  constructor(router) {
    this.router = router;
    // 表示当前路由对象 初始化时会赋予 / 未匹配任何路由
    this.current = (0,_create_route__WEBPACK_IMPORTED_MODULE_0__["default"])(null, {
      path: "/",
    });
  }

  // 核心跳转方法
  transitionTo(location, onComplete) {
    // 寻找即将跳转路径匹配到的路由对象
    const route = this.router.matcher.match(location);
    // 禁止重复跳转
    if (
      this.current.path === route.path &&
      route.matched.length === this.current.matched.length
    ) {
      // 这里不仅仅判断了前后的path是否一致
      // 同时判断了匹配路由对象的个数
      // 这是因为在首次初始化时 this.current 的值为 { path:'/',matched:[] }
      // 假如我们打开页面同样为 / 路径时，此时如果单纯判断path那么就会造成无法渲染
      return;
    }

    this.updateRoute(route);
    onComplete && onComplete(route);
  }

  // 更新current的值
  updateRoute(route) {
    this.current = route;
    this.cb && this.cb(route);
  }

  // current改变同步修改$route
  listen(cb) {
    this.cb = cb;
  }
}


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HTML5History": function() { return /* binding */ HTML5History; }
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/*
 * @Author: shaolong
 * @Date: 2022-10-12 16:11:28
 * @LastEditors: shaolong
 * @LastEditTime: 2022-10-13 09:14:53
 * @Description:
 */


class HTML5History extends _base__WEBPACK_IMPORTED_MODULE_0__.BaseHistory {
  constructor(router) {
    super(router);
  }

  // 推入记录跳转方法
  push(location) {
    this.transitionTo(location, (route) => {
      window.history.pushState({}, null, route.path);
    });
  }

  // 替换当前路由记录跳转
  replace(location) {
    this.transitionTo(location, (route) => {
      window.history.replaceState({}, null, route.path);
    });
  }

  // 设置监听函数
  setupListeners() {
    // 源码中hash路由做了判断优先使用 popstate 不支持情况下才会考虑 hashchange
    // const eventType = supportsPushState ? 'popstate' : 'hashchange'
    // 这里Demo为了简化逻辑直接使用hashchange
    window.addEventListener("popstate", () => {
      // 当路由变化时获取当前最新hash进行跳转
      this.transitionTo(window.location.pathname);
    });
  }

  // 获取当前#之后的路径
  getCurrentLocation() {
    return window.location.pathname;
  }
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _install__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _crate_matcher__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _history_hash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _history_history__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/*
 * @Author: shaolong
 * @Date: 2022-10-11 09:36:07
 * @LastEditors: shaolong
 * @LastEditTime: 2022-10-13 09:29:45
 * @Description:
 */





class VueRouter {
  constructor(options) {
    // 保存外部传入的属性
    this.options = options;

    // 创建路由匹配器
    this.matcher = (0,_crate_matcher__WEBPACK_IMPORTED_MODULE_1__["default"])(options.routes || []);

    // 获取路由模式 默认是hash
    const mode = options.mode || "hash";
    this.mode = mode;

    switch (mode) {
      case "hash":
        this.history = new _history_hash__WEBPACK_IMPORTED_MODULE_2__.HashHistory(this);
        break;
      case "history":
        this.history = new _history_history__WEBPACK_IMPORTED_MODULE_3__.HTML5History(this);
        break;
    }
  }

  // 定义初始化路由方法
  init(app) {
    this.app = app;
    const history = this.history;

    // 路由变化监听函数
    const setupListeners = (route) => {
      history.setupListeners();
    };

    // 初始化时 首先根据当前页面路径渲染一次页面
    history.transitionTo(history.getCurrentLocation(), setupListeners);

    // 额外定义history.listen方法 传入一个callback
    // 在每次BaseHistory中的current属性改变时 传入最新的值 从而更新 app._route
    history.listen((route) => {
      app._route = route;
    });
  }

  // 注册多个路由
  // addRoutes(routes) {
  //   this.matcher.addRoutes(routes);
  // }

  // 注册路由
  addRoute(parentOrRoute, route) {
    this.matcher.addRoute(parentOrRoute, route);
  }

  // 根据获取当前所有活跃的路由Record对象
  getRoutes() {
    return this.matcher.getRoutes();
  }

  // 跳转
  push(location) {
    this.history.push(location);
  }

  // 替换
  replace(location) {
    this.history.replace(location);
  }
}

// 挂载静态install方法
VueRouter.install = _install__WEBPACK_IMPORTED_MODULE_0__["default"];

/* harmony default export */ __webpack_exports__["default"] = (VueRouter);

}();
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});