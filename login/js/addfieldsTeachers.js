function addFieldsTeacher(modify, teacher_number_set){

			if (typeof teacher_number_set === 'undefined') {
    var teacher_number = document.getElementById("teacher_number").value;
} else { var teacher_number = teacher_number_set;}
if (typeof modify === 'undefined') {
    var modify = false;
}
         
			var container_teacher = document.getElementById("teacher_block");
			
          
			while (container_teacher.hasChildNodes()) {
                container_teacher.removeChild(container_teacher.lastChild);
            }
			
			//DISCLAIMER
			
            for (i=0;i<teacher_number;i++){
				//creo l'intera form

				//ZONA NOME E COGNOME
                container_teacher.appendChild(document.createTextNode("ROLE " + (i+1)));
                var selector = document.createElement("select");
				selector.id = "tipologia_docente" + (i+1);
				selector.name = "teacher_type" + (i+1);
				container_teacher.appendChild(selector);

				var option = document.createElement("option");
				option.value = "COORDINATOR";
				option.appendChild(document.createTextNode("COORDINATOR"));
				selector.appendChild(option);
				
				option = document.createElement("option");
				option.value = "HELPER";
				option.appendChild(document.createTextNode("HELPER"));
				selector.appendChild(option);
				
                container_teacher.appendChild(document.createElement("br"));
				
				container_teacher.appendChild(document.createTextNode("NAME " + (i+1)));
                var input = document.createElement("input");
                input.type = "text";
                input.id = "first_name" + (i+1);
				input.name = "first_name" + (i+1);
				input.placeholder="NAME";
                container_teacher.appendChild(input);
                container_teacher.appendChild(document.createElement("br"));
				
				container_teacher.appendChild(document.createTextNode("SURNAME " + (i+1)));
                var input = document.createElement("input");
                input.type = "text";
                input.id = "last_name" + (i+1);
				input.name = "last_name" + (i+1);
				input.placeholder="SURNAME";
                container_teacher.appendChild(input);
                container_teacher.appendChild(document.createElement("br"));
				
				container_teacher.appendChild(document.createTextNode("EMAIL " + (i+1)));
                var input = document.createElement("input");
                input.type = "text";
                input.id = "email" + (i+1);
				input.name = "email" + (i+1);
				input.placeholder="email@email.it";
				input.onblur=function () {return checkEmail(this.id);};
                container_teacher.appendChild(input);
                container_teacher.appendChild(document.createElement("br"));
				
				container_teacher.appendChild(document.createTextNode("SCHOOL NAME " + (i+1)));
                var input = document.createElement("input");
                input.type = "text";
                input.id = "school_name_teach" + (i+1);
				input.name = "school_name_teach" + (i+1);
				input.placeholder="School";
                container_teacher.appendChild(input);
                container_teacher.appendChild(document.createElement("br"));
				
				
				container_teacher.appendChild(document.createTextNode("DISCIPLINE " + (i+1)));
                var selector = document.createElement("select");
				selector.id = "discipline" + (i+1);
				selector.name = "discipline" + (i+1);
				container_teacher.appendChild(selector);

				var option = document.createElement("option");
				option.value = "GENERAL";
				option.appendChild(document.createTextNode("GENERAL"));
				selector.appendChild(option);
				
				option = document.createElement("option");
				option.value = "HUMANITIES";
				option.appendChild(document.createTextNode("HUMANITIES"));
				selector.appendChild(option);
				
				option = document.createElement("option");
				option.value = "SCIENCE AND TECHNOLOGY";
				option.appendChild(document.createTextNode("SCIENCE AND TECHNOLOGY"));
				selector.appendChild(option);
				
				option = document.createElement("option");
				option.value = "ART AND CULTURE";
				option.appendChild(document.createTextNode("ART AND CULTURE"));
				selector.appendChild(option);
				
				option = document.createElement("option");
				option.value = "FOREIGN LANGUAGES";
				option.appendChild(document.createTextNode("FOREIGN LANGUAGES"));
				selector.appendChild(option);
				
				option = document.createElement("option");
				option.value = "RELIGIOUS STUDIES";
				option.appendChild(document.createTextNode("RELIGIOUS STUDIES"));
				selector.appendChild(option);
				
				option = document.createElement("option");
				option.value = "SPORT";
				option.appendChild(document.createTextNode("SPORT"));
				selector.appendChild(option);
				
				option = document.createElement("option");
				option.value = "OTHER";
				option.appendChild(document.createTextNode("OTHER"));
				selector.appendChild(option);
				
                container_teacher.appendChild(document.createElement("br"));
				
				
				
				container_teacher.appendChild(document.createTextNode("PHOTO " + (i+1)));
				
				var input = document.createElement("input");
                input.type = "file";
                input.id = "teacher_photo" + (i+1);
				input.name = "teacher_photo" + (i+1);
				input.placeholder="file";
                container_teacher.appendChild(input);
				
				var input = document.createElement("input");
                input.type = "hidden";
                input.id = "ordinamento" + (i+1);
				input.name = "ordinamento" + (i+1);
				input.className = "nascondi";
				input.value=""+ (i+1) + "";
                container_teacher.appendChild(input);
                
				
                container_teacher.appendChild(document.createElement("br"));
				container_teacher.appendChild(document.createElement("br"));
				container_teacher.appendChild(document.createElement("br"));
				
				
				
            }
			if (modify) {
			populateFieldsTeachers(teacher_number);
			}
}