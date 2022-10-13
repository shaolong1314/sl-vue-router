/*
 * @Author: shaolong
 * @Date: 2022-10-12 16:11:28
 * @LastEditors: shaolong
 * @LastEditTime: 2022-10-13 09:14:53
 * @Description:
 */

import { BaseHistory } from "./base";
export class HTML5History extends BaseHistory {
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
