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
export default function createRoute(record, location) {
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
