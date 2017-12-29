layui.config({base: "js/"}).use(['form', 'layer', 'jquery', 'laypage'], function () {
    var form = layui.form, layer = parent.layer === undefined ? layui.layer : parent.layer, $ = layui.jquery;
    $(".add").click(function () {
        var index = layui.layer.open({
            title: "添加分类",
            type: 2,
            content: "/admin/category/add",
            success: function (layero, index) {
                layui.layer.tips('返回列表', '.layui-layer-setwin .layui-layer-close', {tips: 3});
            }
        })
        $(window).resize(function () {
            layui.layer.full(index);
        })
        layui.layer.full(index);
    })
    $(".edit").click(function () {
        var id = $(this).attr('data-id');
        var index = layui.layer.open({
            title: "修改管理员",
            type: 2,
            content: "/admin/category/edit?id=" + id,
            success: function (layero, index) {
                layui.layer.tips('返回列表', '.layui-layer-setwin .layui-layer-close', {tips: 3});
            }
        })
        $(window).resize(function () {
            layui.layer.full(index);
        })
        layui.layer.full(index);
    })
    $("body").on("click", ".remove", function () {
        var _this = $(this);
        layer.confirm('确定删除此信息？', {icon: 3, title: '提示信息'}, function (index) {
            post('/admin/category/remove', {id: _this.attr('data-id')}, function (data) {
                if (data) {
                    if (200 == data.code) {
                        layer.msg('删除成功', {icon: 1, time: 2000});
                        setTimeout(function () {
                            window.location.href = '/admin/category/list';
                        }, 2000);
                    } else {
                        return layer.msg(data.msg);
                    }
                } else {
                    return layer.msg('接口出错');
                }
            });
            layer.close(index);
        });
    })
})