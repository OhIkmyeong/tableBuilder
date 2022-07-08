export class TableBuilderSetting{
    /* 테이블 넣을 wrapper */
    setWrapper($dom){
        this.$dom = $dom;
        return this;
    }
    /* data fetch 할 url 받아오기 */
    getData(url){
        this.url = url;
        return this;}

    /* set caption */
    setCaption(str){
        this.caption = str;
        return this;
    }

    /* set colgroup */
    setColGroup(colgroup){
        this.colgroup = colgroup;
        return this;
    }//setColGroup

    /* thead가 있는지 없는지 */
    isThead(bool,num = 1){
        this.hasThead = bool;
        this.theadRowNum = bool && num;
        return this;
    }

    /* tbody에서 th가 될 부분 */
    setTHtbody(arr){
        this.bodyTH = arr; 
        return this;
    }//setTHtbody
        
    /* 실행 */
    init(){ return new TableBuilder(this);}
}//TableBuilderSetting

class TableBuilder{
    constructor(Setting){
        this.$dom = Setting.$dom ? Setting.$dom : document.body;
        this.data = undefined;
        if(Setting.url) this.url = Setting.url;
        if(Setting.caption) this.caption = Setting.caption;
        if(Setting.colgroup) this.colgroup = Setting.colgroup;
        if(Setting.hasThead) this.hasThead = Setting.hasThead;
        if(Setting.theadRowNum) this.theadRowNum = Setting.theadRowNum;
        if(Setting.bodyTH) this.bodyTH = Setting.bodyTH;
        
        this.$tbl = document.createElement('TABLE');

        this.init();
    }//constructor

    async init(){
        console.log(this);

        await this.set_data();
        //caption 세팅
        const $caption = domMaker('CAPTION', this.caption);
        
        //colgroup 세팅
        const $colgroup = this.draw_colgroup();

        //thead가 있는지 판별하고 그림
        const $thead = this.draw_thead();
        
        //tbody 그리기
        const $tbody = this.draw_tbody();

        //요소들 tbl에추가
        this.$tbl.appendChild($caption);
        $colgroup && this.$tbl.appendChild($colgroup);
        $thead && this.$tbl.appendChild($thead);
        $tbody && this.$tbl.appendChild($tbody);

        //최종 추가
        this.$dom.appendChild(this.$tbl);
    }//init

    async set_data(){
        this.data = await this.fetch_data(this.url);
    }//set_data

    fetch_data(url){
        return fetch(url).then(res=>res.json()).then(json=>json.data);
    }//fetch_data

    
    /* colgroup 만들기 */
    draw_colgroup(){
        const $cg = domMaker('COLGROUP');
        this.set_per();
        
        for(let i=0; i< this.per; i++){
            const $col = domMaker('COL');
            if(typeof this.colgroup == "object"){
                if(this.colgroup[i]) $col.style.width = this.colgroup[i];
            }
            $cg.appendChild($col);
        }//for

        return $cg;
    }//draw_colgroup

    set_per(){
        const isObject = typeof this.colgroup == "object"; 
        this.per =  isObject ? this.colgroup.length : this.colgroup;
    }//set_per

    /* THEAD 만들기 */
    draw_thead(){
        if(!this.hasThead){return;}
        const $thead = domMaker('THEAD'); 

        for(let i=0; i<this.theadRowNum; i++){
            const $tr = domMaker('TR');
            const start = i * this.per;
            const end = start + this.per;
            const DATA = this.data.slice(start,end);
            for(const data of DATA){
                const title = Object.keys(data)[0];
                const $th = domMaker('TH',data[title]);
                $tr.appendChild($th);
            }//for-th
            $thead.appendChild($tr);
        }//for-tr
        
        return $thead;
    }//draw_thead
    
    /* TBODY 만들기 */
    draw_tbody(){
        const $tbody = domMaker("TBODY");
        const start = this.hasThead ? this.per * (this.theadRowNum ?? 1) : 0;
        const DATA = this.data.slice(start);
        const rowNum = DATA.length / this.per;

        for(let i=0; i<rowNum; i++){
            const $tr = domMaker("TR");
            for(let k=0; k<this.per; k++){
                const $tt = this.th_or_td_tbody(i,k);
                console.log($tt);
                const [key,val] = Object.entries(DATA[i*this.per + k])[0];
                const $span = domMaker('SPAN',val);
                $span.title = key;
                $tt.appendChild($span);
                $tr.appendChild($tt);
            }//for-td,th
            $tbody.appendChild($tr);
        }//for-row
        return $tbody;
    }//draw_tbody

    /* tbody에 TH를 넣을건지 TD를 넣을건지 판별 */
    th_or_td_tbody(i,k){
        if(!this.bodyTH){return domMaker('TD');}

        const {row,col} = this.bodyTH[0];
        
        if(row == true || row.includes(i)){
            if(col == true || col.includes(k)) return domMaker('TH');
        }

        return domMaker('TD');
    }//th_or_td_tbody
}//TableBuilder

function domMaker(type,content = null,clssList = []){
    const $dom = document.createElement(type);
    if(content){$dom.textContent = content;}
    if(clssList.length > 0){
        clssList.forEach(clss => $dom.classList.add(clss));
    }
    return $dom;
}//domMaker