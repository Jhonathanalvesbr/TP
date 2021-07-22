var iniciarLoop;
var bool = 0;
function procuraTP(coluna){
	var procurarTP = document.getElementsByTagName("tr")[0].getElementsByTagName("th")
	for(let x = 0; x < procurarTP.length; x++){
		if(procurarTP[x].innerText === coluna){
		    return x;    
		}
	}
}
var lauda;
function tp(){
    /*let e = document.getElementsByTagName("td");
    for(let x = 0; x < e.length; x++){
        e[x].style.padding = "1px";
    }*/
    let e = document.getElementsByTagName("table");
    for(let x = 0; x < e.length; x++){
	e[x].style.tableLayout = "auto";
    }
    e = document.getElementsByTagName("td");
    e[3].style.width = "50%";
    lauda = document.getElementsByClassName("ant-table-row");
    let existe = "nao";
    for(let x = 0; x < lauda .length; x++){
    	let tp = lauda[x].getElementsByClassName("ant-table-cell")[procuraTP("TP")].innerText;
    	if(tp == "TP"){
	    existe = "sim";
	    break;
    	}
    }
    for(let x = 0; x < lauda .length; x++){
        let tp = lauda[x].getElementsByClassName("ant-table-cell")[procuraTP("TP")].innerText;
	let merchan = lauda[x].getElementsByClassName("ant-table-cell")[procuraTP("Tipo")].innerText;
        if(existe == "sim" && tp != "TP" && merchan != "MERC"){
            lauda[x].style.backgroundColor = "red";
        }
	if(merchan == "MERC"){
	    lauda[x].style.backgroundColor = "green";
	    var td = lauda[x].getElementsByTagName("td")
		for(var i = 0; i < td.length; i++){
			td[i].style.backgroundColor = "green";
		}
	}
	if(merchan == "PSG"){
	    lauda[x].style.backgroundColor = "blue";
	    var td = lauda[x].getElementsByTagName("td")
		for(var i = 0; i < td.length; i++){
			td[i].style.color = "white";
		}
	}
	if(merchan == "ENC"){
	    lauda[x].style.backgroundColor = "blue";
	    var td = lauda[x].getElementsByTagName("td")
		for(var i = 0; i < td.length; i++){
			td[i].style.color = "white";
		}
	}
        if(tp == "TP"){
	    for(x; x < lauda.length; x++){
		let stylee = lauda[x].style.backgroundColor;
	        let merchan = lauda[x].getElementsByClassName("ant-table-cell")[procuraTP("Tipo")].innerText;
	        if(merchan == "MERC"){
	            lauda[x].style.backgroundColor = "green";
	        }
		if(stylee == "red"){
		    lauda[x].style.backgroundColor = lauda[x-1].style.backgroundColor;
		}
            }
            break;
        }
    }
}
function iniciar(){
	if(bool == 0){
		iniciarLoop = setInterval(tp,1000);
		bool = bool + 1;
	}
}
function parar(){
	clearInterval(iniciarLoop);
	bool = 0;
}
var elemento_pai = document.body.getElementsByClassName("emotion-cache-1ku6cjw")[0];
var b1 = document.createElement('button');
var b2 = document.createElement('button');
var bb1 = document.createTextNode("Iniciar");
var bb2 = document.createTextNode("Parar");
b1.addEventListener('click',iniciar);
b2.addEventListener('click',parar);
b1.appendChild(bb1);
b2.appendChild(bb2);
var div1 = document.createElement('div');
var div2 = document.createElement('div');
var div3 = document.createElement('div');
div1.innerHTML = "&nbsp;"
div1.classList.add("emotion-cache-1qmjjc1");
div2.appendChild(div1);
elemento_pai.appendChild(div2);
b1.type = "button";
b1.classList.add("ant-btn");
div3.classList.add("emotion-cache-1qmjjc1");
div3.style = "height: 22px;";
div2.appendChild(div3);
div3.appendChild(b1);
var div11 = document.createElement('div');
var div22 = document.createElement('div');
var div33 = document.createElement('div');
div11.innerHTML = "&nbsp;"
div11.classList.add("emotion-cache-1qmjjc1");
div22.appendChild(div11);
elemento_pai.appendChild(div22);
b2.type = "button";
b2.classList.add("ant-btn");
div33.classList.add("emotion-cache-1qmjjc1");
div33.style = "height: 22px;";
div22.appendChild(div33);
div33.appendChild(b2);

