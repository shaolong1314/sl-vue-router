/*
 * @Author: shaolong
 * @Date: 2022-10-12 09:35:36
 * @LastEditors: shaolong
 * @LastEditTime: 2022-10-12 13:54:59
 * @Description:
 */
export default function createRouteMap(
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
