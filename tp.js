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




var tamanho = 10;
function fonte(){
    let tabela = document.getElementsByTagName("table");
    let tr = tabela[0].getElementsByTagName("tr");
    for(let x = 0; x < tr.length; x++){
    let td = tr[x].getElementsByTagName("td");
        for(let i = 0; i < td.length; i++){td[i].style = "";
            td[i].style.fontSize = tamanho+"px";
        }
    }
}
setInterval(fonte,1000);
