function addFields(modify, number_set){

			if (typeof number_set === 'undefined') {
    var number = document.getElementById("member_number").value;
} else { var number = number_set;}
if (typeof modify === 'undefined') {
    var modify = false;
}
            
         
			var container_nome = document.getElementById("nome_cognome_form");
			var container_tipologia = document.getElementById("tipologia_form"); 
			var container_mail = document.getElementById("altri_dati_form");
			var container_disclaimer = document.getElementById("blocco_form");
			
          
			while (container_nome.hasChildNodes()) {
                container_nome.removeChild(container_nome.lastChild);
            }
			while (container_tipologia.hasChildNodes()) {
                container_tipologia.removeChild(container_tipologia.lastChild);
            }
			while (container_mail.hasChildNodes()) {
                container_mail.removeChild(container_mail.lastChild);
            }
			while (container_disclaimer.hasChildNodes()) {
                container_disclaimer.removeChild(container_disclaimer.lastChild);
            }
			
			//DISCLAIMER
			if (number>=2){
			container_disclaimer.appendChild(document.createTextNode("ATTENZIONE: IN CASO DI PIU' DOCENTI VERRANNO UTILIZZATI COME INFORMAZIONI DI CONTATTO PER LE COMUNICAZIONI SOLO QUELLE DEL PRIMO DOCENTE"));
			container_disclaimer.appendChild(document.createElement("br"));
			container_disclaimer.appendChild(document.createElement("br"));
			container_disclaimer.appendChild(document.createTextNode("IL LIVELLO SCOLASTICO DEL PRIMO DOCENTE DETERMINA LA CATEGORIA DEL CONCORSO"));
			container_disclaimer.appendChild(document.createElement("br"));
			container_disclaimer.appendChild(document.createElement("br"));
			container_disclaimer.appendChild(document.createTextNode("NEL CASO PARTECIPINO CLASSI DI DIVERSO LIVELLO SCOLASTICO SI PREGA DI CONTATTARE LO STAFF"));
			container_disclaimer.appendChild(document.createElement("br"));
			container_disclaimer.appendChild(document.createElement("br"));
			}
            for (i=0;i<number;i++){
				//creo l'intera form

				//ZONA NOME E COGNOME
                container_nome.appendChild(document.createTextNode("Docente " + (i+1)));
                var input = document.createElement("input");
                input.type = "text";
                input.id = "first_name" + (i+1);
				input.name = "first_name" + (i+1);
				input.placeholder="Nome";
                container_nome.appendChild(input);
                container_nome.appendChild(document.createElement("br"));
				
				
                var input = document.createElement("input");
                input.type = "text";
                input.id = "last_name" + (i+1);
				input.name = "last_name" + (i+1);
				input.placeholder="Cognome";
                container_nome.appendChild(input);
                container_nome.appendChild(document.createElement("br"));
				
				 var input = document.createElement("input");
                input.type = "hidden";
                input.id = "ordinamento" + (i+1);
				input.name = "ordinamento" + (i+1);
				input.className = "nascondi";
				input.value=""+ (i+1) + "";
                container_nome.appendChild(input);
                container_nome.appendChild(document.createElement("br"));
				
				//FINE ZONA NOME E COGNOME
				
				//ZONA TIPOLOGIA
                container_tipologia.appendChild(document.createTextNode("RUOLO DOCENTE " + (i+1)));				
				
				var selector = document.createElement("select");
				selector.id = "tipologia_docente" + (i+1);
				selector.name = "tipologia_docente" + (i+1);
				container_tipologia.appendChild(selector);

				var option = document.createElement("option");
				option.value = "COORDINATORE";
				option.appendChild(document.createTextNode("COORDINATORE"));
				selector.appendChild(option);
				
				option = document.createElement("option");
				option.value = "DI SUPPORTO";
				option.appendChild(document.createTextNode("DI SUPPORTO"));
				selector.appendChild(option);
				
                container_tipologia.appendChild(document.createElement("br"));


				
				container_tipologia.appendChild(document.createTextNode("AREA DISCIPLINARE DOCENTE " + (i+1)));				
				
				var selector = document.createElement("select");
				selector.id = "disciplina" + (i+1);
				selector.name = "disciplina"  + (i+1);
				container_tipologia.appendChild(selector);

				var option = document.createElement("option");
				option.value = "DOCENTE UNICO";
				option.appendChild(document.createTextNode("DOCENTE UNICO"));
				selector.appendChild(option);

				option = document.createElement("option");
				option.value = "SCIENTIFICA TECNOLOGICA";
				option.appendChild(document.createTextNode("SCIENTIFICA, TECNOLOGICA"));
				selector.appendChild(option);
				
				option = document.createElement("option");
				option.value = "UMANISTICA";
				option.appendChild(document.createTextNode("UMANISTICA"));
				selector.appendChild(option);
				
								var option = document.createElement("option");
				option.value = "LINGUE STRANIERE";
				option.appendChild(document.createTextNode("LINGUE STRANIERE"));
				selector.appendChild(option);
				
								var option = document.createElement("option");
				option.value = "RELIGIONE";
				option.appendChild(document.createTextNode("RELIGIONE"));
				selector.appendChild(option);
				
								var option = document.createElement("option");
				option.value = "SOSTEGNO";
				option.appendChild(document.createTextNode("SOSTEGNO"));
				selector.appendChild(option);
				
								var option = document.createElement("option");
				option.value = "SCIENZE MOTORIE";
				option.appendChild(document.createTextNode("SCIENZE MOTORIE"));
				selector.appendChild(option);
				
								var option = document.createElement("option");
				option.value = "DIRITTO, SCIENZE SOCIALI";
				option.appendChild(document.createTextNode("DIRITTO, SCIENZE SOCIALI"));
				selector.appendChild(option);
				
								var option = document.createElement("option");
				option.value = "TURISTICA, ALBERGHIERA";
				option.appendChild(document.createTextNode("TURISTICA, ALBERGHIERA"));
				selector.appendChild(option);
				
                container_tipologia.appendChild(document.createElement("br"));
				
				
				container_tipologia.appendChild(document.createTextNode("LIVELLO SCOLASTICO " + (i+1)));				
				
				var selector = document.createElement("select");
				selector.id = "livello" + (i+1);
				selector.name = "livello" + (i+1);
				selector.onblur=function () {return checkIfSecondary();};
				container_tipologia.appendChild(selector);

				var option = document.createElement("option");
				option.value = "INFANZIA";
				option.appendChild(document.createTextNode("INFANZIA"));
				selector.appendChild(option);

				option = document.createElement("option");
				option.value = "PRIMARIA";
				option.appendChild(document.createTextNode("PRIMARIA"));
				selector.appendChild(option);
				
				option = document.createElement("option");
				option.value = "SECONDARIA I GRADO";
				option.appendChild(document.createTextNode("SECONDARIA I GRADO"));
				selector.appendChild(option);
				
								var option = document.createElement("option");
				option.value = "SECONDARIA II GRADO";
				option.appendChild(document.createTextNode("SECONDARIA II GRADO"));
				selector.appendChild(option);
				
				   container_tipologia.appendChild(document.createElement("br"));
				
				
				
				//FINE ZONA TIPOLOGIA
				
				//ZONA MAIL E FOTO
                container_mail.appendChild(document.createTextNode("Mail Docente " + (i+1)));
                var input = document.createElement("input");
                input.type = "text";
                input.id = "email" + (i+1);
				input.name = "email" + (i+1);
				input.placeholder="email@email.it";
				input.onblur=function () {return checkEmail(this.id);};
                container_mail.appendChild(input);
                container_mail.appendChild(document.createElement("br"));
				
				container_mail.appendChild(document.createTextNode("Telefono Docente " + (i+1)));
                var input = document.createElement("input");
                input.type = "text";
                input.id = "telefono" + (i+1);
				input.name = "telefono" + (i+1);
				input.placeholder="numero";
                container_mail.appendChild(input);
                container_mail.appendChild(document.createElement("br"));
				
				container_mail.appendChild(document.createTextNode("Foto Docente " + (i+1)));
                var input = document.createElement("input");
                input.type = "file";
                input.id = "photo" + (i+1);
				input.name = "photo" + (i+1);
				input.placeholder="file";
                container_mail.appendChild(input);
                container_mail.appendChild(document.createElement("br"));
				//FINE ZONA MAIL E FOTO
				
            }
			if (modify) {
			populateFields(number);
			}
}