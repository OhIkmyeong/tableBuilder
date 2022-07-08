import { TableBuilderSetting } from "./TableBuilder.js";

const wrap1 = document.getElementById('wrap-1');
const wrap2 = document.getElementById('wrap-2');
const wrap3 = document.getElementById('wrap-3');

//th가 세로로 배열 (데이터 방향 >>>)
new TableBuilderSetting()
.setCaption("테이블-1-가로")
.setWrapper(wrap1)
.getData('./../data/tbl-1.json')
.setColGroup(["15%",null,null,null])
.setTHtbody([{
    row : true,
    col : [0]
}])
.init();

new TableBuilderSetting()
.setCaption("테이블-1-가로(2)")
.setWrapper(wrap2)
.getData('./../data/tbl-1.json')
.setColGroup(4)
.setTHtbody([{
    row : [1,3],
    col : [0,2]
}])
.init();

new TableBuilderSetting()
.setCaption("테이블-2-세로")
.setWrapper(wrap3)
.getData('./../data/tbl-2.json')
.setColGroup(4)
.isThead(true)
.init();

//얘는 상속으로 rowspan...colspan...class 달기...
new TableBuilderSetting()
.setCaption("테이블-2-세로(3)")
.getData('./../data/tbl-3.json')
.setColGroup(["200px","200px",null])
.isThead(true,2)
.init();