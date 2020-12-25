/**
 * 工具类
 */
export default {
  /**
   * 函数防抖包装函数
   * @param {*} fn 需要包装的函数
   * @param {*} delay 防抖延迟（毫秒）
   * @param {*} immediate 是否立即执行一次
   * @returns 包装后的函数
   */
  debounce(fn, delay, immediate) {
    let timer = null;
    return function () {
      const context = this;
      const args = arguments;
      return new Promise((resolve, reject) => {
        timer && clearTimeout(timer);
        if (immediate) {
          const doNow = !timer;
          timer = setTimeout(() => {
            timer = null;
          }, delay);
          doNow && resolve(fn.apply(context, args));
        } else {
          timer = setTimeout(() => {
            resolve(fn.apply(context, args));
          }, delay);
        }
      });
    };
  }
}
