export default {

    // -------------------addStoreForm----------------------
    // 检查是否为空
    checkEmpty : function (rule, value, callback) {
        setTimeout(() => {
            if(value === ""){
                callback(new Error('不能为空'));
            }else{
                callback();
            }
        }, 500);
    },
    // 检查是否是正整数
    checkPlusNumber : function (rule, value, callback) {
        if (!value) {
            return callback(new Error('不能为空'));
        }
        setTimeout(() => {
            value = Number(value);
            if (!Number.isInteger(value)) {
                callback(new Error('请输入大于0的整数值'));
            } else {
                if (value < 0) {
                    callback(new Error('必须大于0'));
                } else {
                    callback();
                }
            }
        }, 500);
    }
    // -------------------addStoreForm----------------------

}