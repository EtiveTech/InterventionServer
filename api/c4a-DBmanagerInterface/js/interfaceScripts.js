/**
 * Created by Jacopo Magni on 13/06/2017.
 */

var _validFileExtensions = [".csv"];
function validateForm(oForm) {

    var selectedType = document.getElementById("selectType");
    var selection = selectedType.options[selectedType.selectedIndex].value;
    console.log("vediamo se la selection la prende" + selection);
    if(selection == "default"){
        $("#alert-2").show();
        return false;
    }
    var arrInputs = oForm.getElementsByTagName("input");
    for (var i = 0; i < arrInputs.length; i++) {
        var oInput = arrInputs[i];
        if (oInput.type == "file") {
            var sFileName = oInput.value;
            if (sFileName.length > 0) {
                var blnValid = false;
                for (var j = 0; j < _validFileExtensions.length; j++) {
                    var sCurExtension = _validFileExtensions[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                }
                if (!blnValid) {
                    $("#alert-1").show();
                    return false;
                }
            }
        }
    }
    return true;
}

