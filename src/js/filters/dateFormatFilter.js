import Vue from "vue";

var str = "yyyy-MM-dd hh:mm:ss"

Vue.filter("dateFormatTimeStamp", function (i) {
  let value = parseInt(i.toString());
  var data = new Date(value);
  if (isThisYear(value)) {
    if (isJustRecently(value)) return "刚刚";
    if (isToday(value)) return data.Format("hh:mm");
    if (isYestday(value)) return "昨天 " + data.Format("hh:mm");
    if (isBeforeYesterday(value)) return "前天 " + data.Format("hh:mm");
    return data.Format("MM") + "月" + data.Format("dd") + "日 " + data.Format("hh:mm") ;
  }
  return data.Format("yyyy") + "年" + data.Format("MM") + "月" + data.Format("dd") + "日 " + data.Format("hh:mm") ;
});

Vue.filter("dateFormatMassage", function (i) {
  let value = parseInt(i.toString());
  var data = new Date(value);
  if (isThisYear(value)) {
    if (isJustRecently(value)) return data.Format("hh:mm");
    if (isToday(value)) return data.Format("hh:mm");
    return data.Format("MM") + "月" + data.Format("dd") + "日 " + data.Format("hh:mm") ;
  }
  return data.Format("yyyy") + "年" + data.Format("MM") + "月" + data.Format("dd") + "日 " + data.Format("hh:mm") ;
});

Vue.filter("dateFormatBirthday", function (i) {
  let value = parseInt(i.toString());
  var data = new Date(value);
  if (isThisYear(value)) {
    if (isJustRecently(value)) return data.Format("hh:mm");
    if (isToday(value)) return data.Format("hh:mm");
    return data.Format("MM") + "月" + data.Format("dd") + "日 " + data.Format("hh:mm") ;
  }
  return data.Format("yyyy") + "年" + data.Format("MM") + "月" + data.Format("dd") + "日 " + data.Format("hh:mm") ;
});

Vue.filter("dateFormatTree", function (i) {
  let value = parseInt(i.toString());
  var data = new Date(value);
  if (isThisYear(value)) {
    if (isJustRecently(value)) return "刚刚";
    if (isToday(value)) return data.Format("hh:mm");
    if (isYestday(value)) return "昨天";
    if (isBeforeYesterday(value)) return "前天";
  }
  return data.Format("MM-dd");
});

/**
 * 刚刚
 * @param {*} theDate 
 */
function isJustRecently(theDate) {
  var date = (new Date()).getTime(); //当前时间
  var justRecently = new Date(date - 10 * 60 * 1000).getTime(); // 十分钟前
  return justRecently <= theDate; // 传入时间在 十分钟前
}

/**
 * 今天
 * @param {*} theDate 
 */
function isToday(theDate) {
  var date = (new Date()); //当前时间
  var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); // 今天凌晨
  return today <= theDate; // 传入时间在 十分钟前
}

/**
 * 昨天
 * @param {*} theDate 
 */
function isYestday(theDate) {
  var date = (new Date()); //当前时间
  var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); // 今天凌晨
  var yestday = new Date(today - 24 * 3600 * 1000).getTime(); // 昨天凌晨
  return yestday <= theDate && theDate < today; // 传入时间在 昨天凌晨与今天凌晨 之间
}

/**
 * 前天
 * @param {*} theDate 
 */
function isBeforeYesterday(theDate) {
  var date = (new Date()); //当前时间
  var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); // 今天凌晨
  var yestday = new Date(today - 24 * 3600 * 1000).getTime(); // 昨天凌晨
  var beforeYesterday = new Date(yestday - 24 * 3600 * 1000).getTime(); // 前天凌晨
  return beforeYesterday <= theDate && theDate < yestday; // 传入时间在 前天凌晨与昨天凌晨 之间
}

/**
 * 是否今年
 * @param {*} theDate 
 */
function isThisYear(theDate) {
  var thisYear = (new Date()).getFullYear(); //当前年份
  var year = (new Date(theDate)).getFullYear(); // 传入时间年份
  return thisYear == year; // 传入时间是否今年
}
