import '../css/area.css';
import jsonArea from './data';

var areaSelect = function (options) {
    options = $.extend(true, {}, areaSelect.defaults, options);
    if (!(this instanceof areaSelect)) {
        return new areaSelect(options);
    } else {
        this.config = options;
    }
};

areaSelect.prototype = {
    init: function () {
        var config = this.config;
        var objArea = {};
        this._getDOM(config);

        objArea.$elem = $('#' + config.id);
        objArea.areaCon = objArea.$elem.next('.area-con');
        objArea.operation = objArea.areaCon.children('.operation');
        objArea.province = objArea.areaCon.children('.province');
        objArea.city = objArea.areaCon.children('.city');
        objArea.area = objArea.areaCon.children('.area');

        if (config.arrData.length > 0) {
            this._showDom(config);
        }
        this._element(objArea)._operation(objArea)._province(objArea)._overDom(objArea);

        return this;
    },

    _getArr: function () {
        var config = this.config;
        return config.arrData;
        //console.log(config.arrData)
    },

    //绑定_element的click事件
    _element: function (obj) {
        var config = this.config;
        obj.$elem.off('click').on('click', function () {
            obj.areaCon.toggle();
        });
        return this;
    },

    //绑定省市区及清空的click事件
    _operation: function (obj) {
        obj.operation.off('click.operation').on('click.operation', 'a', function () {
            $(this).addClass('on').siblings().removeClass('on');
            var mark = $(this).data('mark');
            switch (mark) {
                case 'prov':
                    obj.areaCon.children().eq(1).show().siblings('div').not(obj.operation).hide();
                    break;
                case 'city':
                    obj.areaCon.children().eq(2).show().siblings('div').not(obj.operation).hide();
                    break;
                case 'area':
                    obj.areaCon.children().eq(3).show().siblings('div').not(obj.operation).hide();
                    break;
                case 'clear':
                    obj.$elem.trigger("click");
                    obj.operation.find('a').eq(0).trigger("click");
                    break;
            }
        })
        return this;
    },

    //绑定选择区域的三个click事件
    _province: function (obj) {
        var that = this;
        var config = that.config;
        var areaObj = {
            prov: '',
            prov_num: '',
            prov_val: '',
            city: '',
            city_num: '',
            city_val: '',
            area: '',
            area_num: '',
            area_val: ''
        };

        //省
        obj.province.off('click.prov').on('click.prov', 'a', function () {
            areaObj.prov_num = $(this).data('num');
            if (!areaObj.prov_num) {
                alert("暂时没有相关内容");
                return;
            }
            areaObj.prov = that._cutField(areaObj.prov_num);
            areaObj.prov_val = that._cutCoding(areaObj.prov_num);
            var city = '';
            $.each(jsonArea[areaObj.prov_num], function (value) {
                var _val = value;
                var _isF = false;
                var cityText = that._cutField(_val);
                if (config.arrData.length > 0) {
                    $.each(config.arrData, function (index, value) {
                        if (value.city_num == _val) {
                            _isF = true;
                        }
                    });
                }
                if(_isF && !config.isArea){
                    city += '<a class="on" data-num="' + _val + '" href="javascript:">' + cityText + '</a>';
                }else{
                    city += '<a data-num="' + _val + '" href="javascript:">' + cityText + '</a>';
                }
            });
            obj.city.children('.box').html('').append(city);
            obj.operation.find('a').eq(1).trigger("click");
        });

        //市
        obj.city.off('click.city').on('click.city', 'a', function () {
            var $this = $(this);
            areaObj.city_num = $(this).data('num');
            areaObj.city = that._cutField(areaObj.city_num);
            areaObj.city_val = that._cutCoding(areaObj.city_num);
            if (config.isArea) {
                var area = '';
                $.each(jsonArea[areaObj.prov_num][areaObj.city_num], function (index, value) {
                    var _val = value;
                    var _isF = false;
                    var areaText = that._cutField(_val);
                    if (config.arrData.length > 0) {
                        $.each(config.arrData, function (index, value) {
                            if (value.area_num == _val) {
                                _isF = true;
                            }
                        });
                    }
                    if(_isF){
                        area += '<a class="on" data-num="' + _val + '" href="javascript:">' + areaText + '</a>';
                    }else{
                        area += '<a data-num="' + _val + '" href="javascript:">' + areaText + '</a>';
                    }
                });
                obj.area.children('.box').html('').append(area);
                obj.operation.find('a').eq(2).trigger("click");
            } else {
                var isIn = true;
                $.each(config.arrData, function (index, value) {
                    if (areaObj.city_val == value.city_val) {
                        isIn = false;
                    }
                });
                if (isIn) {
                    that._operate(obj,areaObj,config,$this);
                }
            }
        });

        //区
        obj.area.off('click.area').on('click.area', 'a', function () {
            var $this = $(this);
            var isIn = true;
            areaObj.area_num = $(this).data('num');
            areaObj.area = that._cutField(areaObj.area_num);
            areaObj.area_val = that._cutCoding(areaObj.area_num);

            $.each(config.arrData, function (index, value) {
                if (areaObj.area_val == value.area_val) {
                    isIn = false;
                }
            });
            if (isIn) {
                that._operate(obj,areaObj,config,$this);
            }
        });
        return that;
    },

    //提取公用操作
    _operate:function (obj,areaObj,config,$this) {
        var arr = $.extend(true, {}, areaObj);
        if (config.multiple) {
            config.arrData.push(arr);
            $this.addClass('on');
        } else {
            config.arrData = [];
            config.arrData.push(arr);
            $this.addClass('on').siblings().removeClass('on');
        }
        this._showDom(config);
        obj.$elem.trigger("click");
    },

    //截取字段
    _cutField: function (text) {
        var len = text.indexOf('_');
        var textField = text.slice(0, len);
        return textField;
    },

    //截取地域编码
    _cutCoding: function (text) {
        var len = text.indexOf('_');
        var textCoding = text.slice(len + 1, text.length);
        return textCoding;
    },

    //监听Document事件
    _overDom: function (obj) {
        $(document).on('click', function (e) {
            var target = e.target || e.srcElement;
            if (target.id == obj.$elem.attr('id')) {
                e.preventDefault();
                return;
            }
            obj.areaCon.each(function () {
                if ($(target).closest(this).length == 0 && $(this).is(':visible')) {
                    $(this).hide();
                }
            });
        });
        return this;
    },

    _showDom: function (config) {
        $('#' + config.id).closest('.area-box').find('.area-show').remove();
        var wrap = $('<div class="area-show"></div>');
        var showText = '';
        $.each(config.arrData, function (index, value) {
            var _str = '';
            var _val = '';
            if (config.isArea) {
                _str = value.prov + "-" + value.city + "-" + value.area
                _val = value.area_num;
            } else {
                _str = value.prov + "-" + value.city;
                _val = value.city_num;
            }
            showText += '<a data-num="'+ _val +'"><em>' + _str + '</em><span>×</span></a>';
        });
        wrap.append(showText);
        $('#' + config.id).closest('.area-box').prepend(wrap);
        this._removeDom(config);
        return this;
    },

    _removeDom: function (config) {
        var $show = $('#' + config.id).closest('.area-box').find('.area-show');
        $($show).off('click.remove').on('click.remove', 'a span', function () {
            var $a = $(this).closest('a');
            var index = $a.index();
            var _val = $a.data('num');
            config.arrData.splice(index, 1);
            $('a[data-num="'+ _val +'"]').removeClass('on');
            $(this).closest('a').remove();
        });
        return this;
    },

    _getDOM: function (config) {
        var wrap = $('<div class="area-box"></div>');
        var area = config.isArea ? '<a data-mark="area" href="javascript:">区县</a>' : '';
        var areaBox = config.isArea ? '<div class="area"><div class="box"></div></div>' : '';
        var str = '<div class="area-con">'
            + '<div class="operation">'
            + '<a data-mark="prov" class="on" href="javascript:">省份</a>'
            + '<a data-mark="city" href="javascript:">城市</a>' + area
            + '<a data-mark="clear" href="javascript:">关闭</a>'
            + '</div>'
            + '<div class="province" style="display:block;">'
            + '<div class="box">'
            + '<div class="sort"><span>A-G</span></div>'
            + '<div class="list"> <a data-num="安徽省_340000" href="javascript:">安徽</a> <!--<a data-num="null" href="javascript:">澳门</a>--><a data-num="北京市_110000" href="javascript:">北京</a><a data-num="重庆市_500000" href="javascript:">重庆</a><a data-num="福建省_350000" href="javascript:">福建</a><a data-num="甘肃省_620000" href="javascript:">甘肃</a><a data-num="广东省_440000" href="javascript:">广东</a><a data-num="广西壮族自治区_450000" href="javascript:">广西</a><a data-num="贵州省_520000" href="javascript:">贵州</a> </div>'
            + '</div>'
            + '<div class="box">'
            + '<div class="sort"><span>H-K</span></div>'
            + '<div class="list"> <a data-num="海南省_460000" href="javascript:">海南</a><a data-num="河北省_130000" href="javascript:">河北</a><a data-num="河南省_410000" href="javascript:">河南</a><a data-num="黑龙江省_230000" href="javascript:">黑龙江</a><a data-num="湖北省_420000" href="javascript:">湖北</a><a data-num="湖南省_430000" href="javascript:">湖南</a><a data-num="吉林省_220000" href="javascript:">吉林</a><a data-num="江苏省_320000" href="javascript:">江苏</a><a data-num="江西省_360000" href="javascript:">江西</a> </div>'
            + '</div>'
            + '<div class="box">'
            + '<div class="sort"><span>L-S</span></div>'
            + '<div class="list"> <a data-num="辽宁省_210000" href="javascript:">辽宁</a><a data-num="内蒙古自治区_150000" href="javascript:">内蒙古</a><a data-num="宁夏回族自治区_640000" href="javascript:">宁夏</a><a data-num="青海省_630000" href="javascript:">青海</a><a data-num="山东省_370000" href="javascript:">山东</a><a data-num="山西省_140000" href="javascript:">山西</a><a data-num="陕西省_610000" href="javascript:">陕西</a><a data-num="上海市_310000" href="javascript:">上海</a><a data-num="四川省_510000" href="javascript:">四川</a> </div>'
            + '</div>'
            + '<div class="box">'
            + '<div class="sort"><span>T-Z</span></div>'
            + '<div class="list"> <a data-num="天津市_120000" href="javascript:">天津</a><!--<a data-num="null" href="javascript:">台湾</a><a data-num="null" href="javascript:">香港</a>--><a data-num="西藏自治区_540000" href="javascript:">西藏</a><a data-num="新疆维吾尔自治区_650000" href="javascript:">新疆</a><a data-num="云南省_530000" href="javascript:">云南</a><a data-num="浙江省_330000" href="javascript:">浙江</a> </div>'
            + '</div>'
            + '</div>'
            + '<div class="city"><div class="box"></div></div>' + areaBox
            + '</div>';
        $('#' + config.id).wrap(wrap).after(str);
        return wrap;
    }
};

//默认配置
areaSelect.defaults = {
    isArea: true,       //默认省市区，false为省市
    multiple: false,    //默认单选，false为多选
    mul_num: 10,	    //多选时最多选择个数
    arrData: []         //选中或者回显数组
};

module.exports = areaSelect;


