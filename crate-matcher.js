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

import createRouteMap from "./create-router-map";
import createRoute from "./create-route";
export default function createMatcher(routes) {
  // 首先初始化需要格式化路由对象，将传入的路由列表进行扁平化
  const { pathList, pathMap, nameMap } = createRouteMap(routes);

  // 动态注册单个路由 本质上还是参数的重载
  // 当动态注册单个路由时 支持覆盖同名路由
  // 同时注册单个路由支持指定在特定的路由中添加子路由 支持parent参数，parentOrRoute如果为字符串，则添加route为该parentOrRoute的子路由
  function addRoute(parentOrRoute, route) {
    // 如果第一个参数传递了非Object对象，那么表示它不是路由对象 代表传递的是对应的parent路由的名称
    const parent =
      typeof parentOrRoute !== "object" ? nameMap[parentOrRoute] : undefined;
    return createRouteMap(
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
      if (!record) return createRoute(null, location);
      // 返回时调用createRoute方法 返回完全匹配的路由映射数据（包含嵌套节点）
      return createRoute(record, next);
    } else if (path) {
      // 不存在name时则会寻找path对应的Record对象
      const record = pathMap[path];
      if (!record) return createRoute(null, location);
      // 返回时调用createRoute方法 返回完全匹配的路由映射数据（包含嵌套节点）
      return createRoute(record, next);
    }
  }

  return {
    addRoute,
    getRoutes,
    match,
  };
}
