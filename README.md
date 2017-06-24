# citySelect

citySelect —— 省市区选择控件。

[简单示例](http://www.webcjs.com/demo/cityselect/)

```
npm install --save-dev
```

#### 数据结构：
```
{
    area: "涡阳县",
    area_num: "涡阳县_341621",
    area_val: "341621",
    city: "亳州市",
    city_num: "亳州市_341600",
    city_val: "341600",
    prov: "安徽省",
    prov_num: "安徽省_340000",
    prov_val: "340000"
}
```

#### 调用方法：
```
var d = area({
    id : myId,          //触发事件id，比如a标签，input，必填
    isArea: true,       //默认省市区选择，false为省市
    multiple: false,    //默认单选，false为多选
    arrData: []         //选中或者回显数组
}).init();

d._getArr();            //用于传值
```

