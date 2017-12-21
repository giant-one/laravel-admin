var $, tab, skyconsWeather;
layui.config(
    {base: "js/"}).use(['bodyTab', 'form', 'element', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, element = layui.element;
    $ = layui.jquery;
    tab = layui.bodyTab();
    function lockPage() {
        layer.open({title: false, type: 1, content: $("#lock-box"), closeBtn: 0, shade: 0.9})
    }

    $(".lockcms").on("click", function () {
        window.sessionStorage.setItem("lockcms", true);
        lockPage();
    })
    if (window.sessionStorage.getItem("lockcms") == "true") {
        lockPage();
    }
    $("#unlock").on("click", function () {
        if ($(this).siblings(".admin-header-lock-input").val() == '') {
            layer.msg("请输入解锁密码！");
        } else {
            if ($(this).siblings(".admin-header-lock-input").val() == "123456") {
                window.sessionStorage.setItem("lockcms", false);
                $(this).siblings(".admin-header-lock-input").val('');
                layer.closeAll("page");
            } else {
                layer.msg("密码错误，请重新输入！");
            }
        }
    });
    $(document).on('keydown', function () {
        if (event.keyCode == 13) {
            $("#unlock").click();
        }
    });
    var treeMobile = $('.site-tree-mobile'), shadeMobile = $('.site-mobile-shade')
    treeMobile.on('click', function () {
        $('body').addClass('site-mobile');
    });
    shadeMobile.on('click', function () {
        $('body').removeClass('site-mobile');
    });
    $(".layui-nav .layui-nav-item a").on("click", function () {
        addTab($(this));
        $(this).parent("li").siblings().removeClass("layui-nav-itemed");
    })
    function showNotice() {
        layer.open({
            type: 1,
            title: "系统公告",
            closeBtn: false,
            area: '310px',
            shade: 0.8,
            id: 'LAY_layuipro',
            btn: ['火速围观'],
            moveType: 1,
            content: '<div style="padding:15px 20px; text-align:justify; line-height: 22px; text-indent:2em;border-bottom:1px solid #e2e2e2;"></div>',
            success: function (layero) {
                var btn = layero.find('.layui-layer-btn');
                btn.css('text-align', 'center');
                btn.on("click", function () {
                    window.sessionStorage.setItem("showNotice", "true");
                })
                if ($(window).width() > 432) {
                    btn.on("click", function () {
                        layer.tips('系统公告躲在了这里', '#showNotice', {tips: 3});
                    })
                }
            }
        });
    }

    /*if (window.sessionStorage.getItem("lockcms") != "true" && window.sessionStorage.getItem("showNotice") != "true") {
        showNotice();
    }
    $(".showNotice").on("click", function () {
        showNotice();
    })*/
    /*if (window.sessionStorage.getItem("menu") != null) {
        //刷新前历史菜单
        // console.log(window.sessionStorage.getItem("menu"))
        menu = JSON.parse(window.sessionStorage.getItem("menu"));
        curmenu = window.sessionStorage.getItem("curmenu");
        var openTitle = '';
        for (var i = 0; i < menu.length; i++) {
            openTitle = '';
            if (menu[i].icon.split("-")[0] == 'icon') {
                openTitle += '<i class="iconfont ' + menu[i].icon + '"></i>';
            } else {
                openTitle += '<i class="layui-icon">' + menu[i].icon + '</i>';
            }
            openTitle += '<cite>' + menu[i].title + '</cite>';
            openTitle += '<i class="layui-icon layui-unselect layui-tab-close" data-id="' + menu[i].layId + '">&#x1006;</i>';
            element.tabAdd("bodyTab", {
                title: openTitle,
                content: "<iframe src='" + menu[i].href + "' data-id='" + menu[i].layId + "'></frame>",
                id: menu[i].layId
            })
            if (curmenu != "undefined") {
                if (curmenu == '' || curmenu == "null") {
                    element.tabChange("bodyTab", '');
                } else if (JSON.parse(curmenu).title == menu[i].title) {
                    element.tabChange("bodyTab", menu[i].layId);
                }
            } else {
                element.tabChange("bodyTab", menu[menu.length - 1].layId);
            }
        }
    }*/
})
function addTab(_this) {
    tab.tabAdd(_this);
}
function donation() {
    layer.tab({
        area: ['260px', '367px'],
        tab: [{
            title: "微信",
            content: "<div style='padding:30px;overflow:hidden;background:#d2d0d0;'><img src='images/wechat.jpg'></div>"
        }, {
            title: "支付宝",
            content: "<div style='padding:30px;overflow:hidden;background:#d2d0d0;'><img src='images/alipay.jpg'></div>"
        }]
    })
}