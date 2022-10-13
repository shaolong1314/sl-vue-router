/*
 * @Author: shaolong
 * @Date: 2022-10-13 11:49:18
 * @LastEditors: shaolong
 * @LastEditTime: 2022-10-13 13:39:34
 * @Description:
 */

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    library: "SVueRouter",
    libraryExport: "default",
    libraryTarget: "umd",
  },
  mode: "none",
};
