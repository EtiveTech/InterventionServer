function addFieldsSchool(modify, number_school_set){

			if (typeof number_school_set === 'undefined') {
    var number_school = document.getElementById("school_number").value;
} else { var number_school = number_school_set;}
if (typeof modify === 'undefined') {
    var modify = false;
}

while (teacher_number.hasChildNodes()) {
                teacher_number.removeChild(teacher_number.lastChild);
            }
var max = number_school * 4;
select = document.getElementById('teacher_number');

for (var i = 1; i<=max; i++){
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = i;
    select.appendChild(opt);
}
         
			var container_school = document.getElementById("school_block");
			
          
			while (container_school.hasChildNodes()) {
                container_school.removeChild(container_school.lastChild);
            } 
			
			
			
            for (i=0;i<number_school;i++){
				//creo l'intera form

				 //ZONA NOME E COGNOME
                container_school.appendChild(document.createTextNode("SCHOOL NAME " + (i+1)));
                var input = document.createElement("input");
                input.type = "text";
                input.id = "school_name" + (i+1);
				input.placeholder="School Name";
				input.name = "school_name" + (i+1);
                container_school.appendChild(input);
                container_school.appendChild(document.createElement("br"));
				
				container_school.appendChild(document.createTextNode("SCHOOL ADDRESS " + (i+1)));
                var input = document.createElement("input");
                input.type = "text";
                input.id = "address_school1" + (i+1);
				input.placeholder="ADDRESS";
				input.name = "address_school1" + (i+1);
                container_school.appendChild(input);
                container_school.appendChild(document.createElement("br"));
				
                var input = document.createElement("input");
                input.type = "text";
                input.id = "address_school2" + (i+1);
				input.placeholder="ZIP CODE";
				input.name = "address_school2" + (i+1);
                container_school.appendChild(input);
                container_school.appendChild(document.createElement("br"));
				
				var input = document.createElement("input");
                input.type = "text";
                input.id = "address_school3" + (i+1);
				input.placeholder="CITY";
				input.name = "address_school3" + (i+1);
                container_school.appendChild(input);
                container_school.appendChild(document.createElement("br"));
				
				var input = document.createElement("input");
                input.type = "text";
                input.id = "address_school4" + (i+1);
				input.placeholder="REGION/STATE";
				input.name = "address_school4" + (i+1);
                container_school.appendChild(input);
                container_school.appendChild(document.createElement("br"));
				
				var input = document.createElement("input");
                input.type = "text";
                input.id = "address_school5" + (i+1);
				input.placeholder="COUNTRY";
				input.name = "address_school5" + (i+1);
                container_school.appendChild(input);
                container_school.appendChild(document.createElement("br"));
				
				container_school.appendChild(document.createTextNode("SCHOOL PHOTO " + (i+1)));
				
				var input = document.createElement("input");
                input.type = "file";
                input.id = "photo_school" + (i+1);
				input.name = "photo_school" + (i+1);
                container_school.appendChild(input);
                container_school.appendChild(document.createElement("br"));
				container_school.appendChild(document.createElement("br"));
				container_school.appendChild(document.createElement("br")); 
				
				addFieldsTeacher();
				
            }
			if (modify) {
			populateFieldsSchool(number_school);
			}
}