function tp(){
    let lauda = document.getElementsByClassName("ant-table-row");
    let existe = "nao";
    for(let x = 0; x < lauda .length; x++){
    	let tp = lauda[x].getElementsByClassName("ant-table-cell")[9].innerText;
    	if(tp == "TP"){
	    existe = "sim";
	    break;
    	}
    }
    for(let x = 0; x < lauda .length; x++){
        let tp = lauda[x].getElementsByClassName("ant-table-cell")[9].innerText;
	let merchan = lauda[x].getElementsByClassName("ant-table-cell")[2].innerText;
        if(existe == "sim" && tp != "TP" && merchan != "MERC"){
            lauda[x].style.backgroundColor = "red";
        }
	if(merchan == "MERC"){
	    lauda[x].style.backgroundColor = "green";
	}
        if(tp == "TP"){
	    for(x; x < lauda.length; x++){
		let stylee = lauda[x].style.backgroundColor;
	        let merchan = lauda[x].getElementsByClassName("ant-table-cell")[2].innerText;
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
setInterval(tp,1000);





//TAMANHO!!
var t = 12;
function aumentar(){
    t = t+1;
    let tabela = document.getElementsByTagName("table");
    let tr = tabela[0].getElementsByTagName("tr");
    for(let x = 0; x < tr.length; x++){
    let td = tr[x].getElementsByTagName("td");
    	for(let i = 0; i < td.length; i++){
	    td[i].style.removeProperty('max-height');
	    td[i].style.fontSize = t+"px";
        }
    }
}
function diminuir(){
    t = t-1;
    let tabela = document.getElementsByTagName("table");
    let tr = tabela[0].getElementsByTagName("tr");
    for(let x = 0; x < tr.length; x++){
    let td = tr[x].getElementsByTagName("td");
    	for(let i = 0; i < td.length; i++){
	    td[i].style.removeProperty('max-height');
	    td[i].style.fontSize = t+"px";
        }
    }
}
var elemento_pai = document.body;
var b1 = document.createElement('button');
var b2 = document.createElement('button');
b1.addEventListener('click',aumentar);
b2.addEventListener('click',diminuir);
var bb1 = document.createTextNode("+");
var bb2 = document.createTextNode("-");
b1.appendChild(bb1);
b2.appendChild(bb2);
elemento_pai.appendChild(b1);
elemento_pai.appendChild(b2);
b1.style.height = "30px";
b1.style.width = "30px";
b2.style.height = "30px";
b2.style.width = "30px";
b1.style.marginLeft = "90%";
