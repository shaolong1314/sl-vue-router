/*
 * @Author: shaolong
 * @Date: 2022-10-12 16:11:17
 * @LastEditors: shaolong
 * @LastEditTime: 2022-10-12 16:37:14
 * @Description:
 */

import { BaseHistory } from "./base";
export class HashHistory extends BaseHistory {
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
export function getHash() {
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
