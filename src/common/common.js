export default {


    // 检查是否为空
    messageBox: function(message) {
        this.$alert(message, '提示', {
            confirmButtonText: '确定',
            callback: action => {
                this.$message({
                    type: 'info',
                    message: `action: ${ action }`
                });
            }
        });
    }

}