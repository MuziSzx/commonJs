/**
 * 数据根据分类封装成对象
 * @param {codes}   [必须]类型编号 例如 area,company
 * @param {list}    [必须]原数组  
 * @param {column}  [必须]需要分类的字段名称 例如 type
 */
function getObjListByCodes(codes,list,column){
    var typeArr=[];
    var obj={};
    var classifyList=function(){
        if(!isNull(list) && isList(list) && isList(typeArr)){
            for(var i=0;i<typeArr.length;i++){
                var code=typeArr[i];
                var arr=filterArrayData(list,code,false,column);
                if(isList(arr)){
                    obj[code]=arr;
                }else{
                    obj[code]=arr;
                }
            }
            return obj;
        }else{
            return null;
        }
    };

    if(!isNullOrEmpty(codes) && typeof(codes)=='string'){
        if(codes.indexOf(',')){
            typeArr=codes.split(',');
        }else{
            typeArr=[codes];
        }
        obj=classifyList(list);
    }
    return obj;
}

/**
 * 数组过滤
 * @param arr        [必须] 原数组
 * @param filterText [必须] 需要过滤的文本
 * @param allMode    [可选] 过滤模式 默认所有对象都过滤 false 只过滤某字段 对象的key
 * @param keyName    [可选] allMode=false时 对象的keyname
 * @returns 返回过滤后的数组
 */
function filterArrayData(arr, filterText, allMode, keyName) {
    var filterArr = [];
    var Mode = isNullOrEmpty(allMode) || allMode ? true : false; //默认全字段查找
    if (!isArray(arr) || isNullOrEmpty(filterText)) return filterArr;

    filterArr = arr.filter(function (item, index, array) {
        if (typeof (item) === 'object') {
            for (var key in item) {
                var value = item[key];
                //console.log(item,key,value,!allMode && isNullOrEmpty(keyName),allMode && typeof(key) !=='string',!allMode && key!==keyName);
                if ((!allMode && isNullOrEmpty(keyName)) || (allMode && typeof (key) !== 'string') || (!allMode && key !== keyName)) {

                } else if (!isNull(value) && value==filterText) {
                    return item;
                }
            }
        } else {
            if (!isNull(item) && item.toString().indexOf(filterText) >= 0) {
                return item;
            }
        }
    });
    return filterArr;
}
/**
 * 验证key值是否存在与数组中
 * @param {原始数组} arr     [必须]原数组
 * @param {寻找的值} key     [必须]数组中需要寻找的值
 * @param {对象名称} keyName [可选]如果数组行是对象则必须填写keyName
 */
function checkKeyInArray(arr, key, keyName) {
    var exists = false;
    if (isArray(arr) && arr.length > 0) {
        if (!isNull(keyName)) {
            for (var i = 0; i < arr.length; i++) {
                var value = arr[i][keyName];
                if (value === key) {
                    return true;
                }
            }
        } else {
            for (var i = 0; i < arr.length; i++) {
                var value = arr[i];
                if (value === key) {
                    return true;
                }
            }
        }
    }
    return exists;
}
/**
 * 查询key值是否存在与数组中，并返回当前行的整个对象
 * @param {原始数组} arr      [必须]原数组
 * @param {寻找的值} keyValue [必须]数组中需要寻找的值
 * @param {对象名称} keyName  [可选]如果数组行是对象则必须填写keyName
 */
function queryKeyArrayItem(arr, keyValue, keyName) {
    var obj = null;
    if (isArray(arr) && arr.length > 0 && !isNullOrEmpty(keyValue)) {
        for (var i = 0; i < arr.length; i++) {
            var key = !isNullOrEmpty(keyName) ? arr[i][keyName] : arr[i];
            if (!isNullOrEmpty(key) && key == keyValue) {
                return arr[i];
            }

        }
    }
    return obj;
}


/**
 * 去除非数字的字符串
 * @param   s  [必须]  html格式字符串 -0.1元
 * @returns 返回数字相关的数字 -0.1
 */
function filterNotNumber(s) {
    return parseFloat(s.replace(/[^\d\.-]/g, ""));
}

/*******************************************数字类****************************************/
/**
 * 金额按千位逗号分隔
 * @param   s     [必须]  需要格式化的金额数值
 * @param   type  [必须]  判断格式化后的金额是否需要小数位. 
 * @returns 返回格式化后的数值字符串.
 */
function formatMoney(s, type) {
    if (/[^0-9\.]/.test(s))
        return "0.00";
    if (s == null || s == "null" || s == "")
        return "0.00";
    s = s.toString().replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s))
        s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    if (type == 0) {
        var a = s.split(".");
        if (a[1] == "00") {
            s = a[0];
        }
    }
    return s;
}

/**
 * 排序数组或者对象
 * @param object [必须] 数组或对象
 * @param subkey [可选] 需要排序的子键, 该参数可以是字符串, 也可以是一个数组
 * @param desc   [可选] 排序方式, true:降序, false|undefined:升序
 * @returns 返回排序后的数组或者对象
 * 注意: 对于对象的排序, 如果使用console.log打印对象的显示可能和排序结果不一致,
 *  其键会被浏览器以字母顺序排序显示,但在for循环中则为正确的排序顺序
 */
function sortObject(object, subkey, desc) {
    if (!isNullOrEmpty(object))
        object = JSON.parse(JSON.stringify(object));
    var is_array = false;
    if (Object.prototype.toString.call(object) === '[object Array]') {
        is_array = true;
    }
    if (is_array) {
        var keys = {
            length: object.length
        };
    } else {
        if (typeof (Object.keys) == 'function') {
            var keys = Object.keys(object);
        } else {
            var keys = [];
            for (var key in keys) {
                keys.push(key);
            }
        }
    }
    for (var i = 0; i < keys.length; i++) {
        for (var j = i + 1; j < keys.length; j++) {
            if (is_array) {
                //数组排序
                if (Object.prototype.toString.call(subkey) === '[object Array]') {
                    var vali = object[i];
                    var valj = object[j];
                    for (var si = 0; si < subkey.length; si++) {
                        vali = vali[subkey[si]];
                        valj = valj[subkey[si]];
                    }
                } else {
                    if ((!subkey && subkey !== '') || subkey == '' && object.sort) {
                        var vali = object[i];
                        var valj = object[j];
                    } else {
                        var vali = object[i][subkey];
                        var valj = object[j][subkey];
                    }
                }
                if (desc) {
                    if ( Number(valj ) >Number( vali)) {
                        var tmp = object[i];
                        object[i] = object[j];
                        object[j] = tmp;
                    }
                } else {
                    if (Number(valj ) < Number( vali)) {
                        var tmp = object[i];
                        object[i] = object[j];
                        object[j] = tmp;
                    }
                }
            } else {
                //对象排序
                var obi = object[keys[i]];
                var obj = object[keys[j]];
                if (Object.prototype.toString.call(subkey) === '[object Array]') {
                    var vali = obi;
                    var valj = obj;
                    for (var si = 0; si < subkey.length; si++) {
                        vali = vali[subkey[si]];
                        valj = valj[subkey[si]];
                    }
                } else {
                    if ((!subkey && subkey !== '') || subkey == '' && object.sort) {
                        var vali = obi;
                        var valj = obj;
                    } else {
                        var vali = obi[subkey];
                        var valj = obj[subkey];
                    }
                }
                if (desc) {
                    if (valj > vali) {
                        var tmp = keys[i];
                        keys[i] = keys[j];
                        keys[j] = tmp;
                    }
                } else {
                    if (valj < vali) {
                        var tmp = keys[i];
                        keys[i] = keys[j];
                        keys[j] = tmp;
                    }
                }
            } //is!array
        }
    }
    if (is_array) {
        return object;
    } else {
        var sorted = {};
        for (var i = 0; i < keys.length; i++) {
            sorted[keys[i]] = object[keys[i]];
        }
        return sorted;
    }
}