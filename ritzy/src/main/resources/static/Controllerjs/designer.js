// browser onload event
window.addEventListener("load", () => {

    //check ths with under PrivilegeController after deleteMapping
    userPrivilege = getServiceAjaxRequest("/privilege/byloggedusermudule/DESIGNER");


    //call table refresh function
    refreshDesignerTable();

    //call form refresh function
    refreshDesignerForm();
});

const refreshDesignerTable = () => {
    designers = [];
    designers = getServiceAjaxRequest("/designer/findAll");

    const displayProperty = [
        { dataType: "text", propertyName: "designer_name" },
        { dataType: "text", propertyName: "email" },
        { dataType: "text", propertyName: "address" },
        { dataType: "text", propertyName: "phone" },
        { dataType: "text", propertyName: "nic" },
        { dataType: "function", propertyName: getDesignerStatus }
    ];

    fillDataIntoTable(
        designerTable,
        designers,
        displayProperty,
        designerFormRefill,
        printDesigner,
        deleteDesigner,
        true,
        userPrivilege
    );

    //disable delete button
    designers.forEach((element, index) => {
        if (element.designer_status_id.name == "In-Active Collaboration") {
            if (userPrivilege.delete) {
                designerTable.children[1].children[index].children[7].children[1].disabled = "disabled";
            }
        }
    });


    //call jquery datatable function
    $("#designerTable").dataTable();

    designerTable_length.children[0].style.color = "white";
    designerTable_length.children[0].children[0].style.color = "black";

    designerTable_filter.children[0].style.color = "white";
    designerTable_filter.children[0].children[0].style.color = "black";
};

const getDesignerStatus = (ob) => {
    if (ob.designer_status_id.name == 'Active Collaboration') {
        return '<p style="border-radius:10px" class="btn-dressavailability-Available text-center fw-bold">' + ob.designer_status_id.name + '</p>';
    }

    if (ob.designer_status_id.name == 'In-Active Collaboration') {
        return '<p style="border-radius:10px" class="btn-dressavailability-OutofStock text-center fw-bold">' + ob.designer_status_id.name + '</p>';
    }

}

const refreshDesignerForm = () => {

    //create empty object
    designer = {};

    //get designer status datalist for select element
    designerstatus = getServiceAjaxRequest("/designerstatus/findall");

    fillDataIntoSelect(designerStatus, "Select Status", designerstatus, "name");



    //set default input feild styles                                             
    textDesignerName.className = "gradient-border form-control shadow-sm";
    emailId.className = "gradient-border form-control shadow-sm";
    designerNIC.className = "gradient-border form-control shadow-sm";
    DesignerAddress.className = "gradient-border form-control shadow-sm";
    designerPH.className = "gradient-border form-control shadow-sm";
    dsnAdditionalPH.className = "gradient-border form-control shadow-sm";
    designerStatus.className = "gradient-border form-select shadow-sm";
    textNote.className = "gradient-border form-control shadow-sm";

    //set to default color to feilds if after refreshing for
    // Remove validation classes
    var elements = document.getElementById("formDesigner").querySelectorAll(".is-invalid");
    elements.forEach(function (element) {
        element.classList.remove("is-invalid");
    });


    //--------------------------------------//

    if (userPrivilege.insert_privilege) {
        btnEditDesigner.disabled = false;
        btnEditDesigner.style.cursor = "pointer";
    } else {
        btnEditDesigner.disabled = true;
        btnEditDesigner.style.cursor = "not-allowed";
    }


    btnEditDesigner.disabled = true;
    btnEditDesigner.style.cursor = "not-allowed";
    btnSubmitDesigner.disabled = false;
    btnSubmitDesigner.style.cursor = "pointer";
    // btnSubmitDesigner

}


const designerFormRefill = (ob, rowIndex) => {
    console.log("Edit");

    designer = JSON.parse(JSON.stringify(ob)); //
    olddesigner = JSON.parse(JSON.stringify(ob));

    //open modal
    $("#dsignrForm").tab("show");
    //set value into static element
    //elementid.value = ob.relevantPropertyName
    textDesignerName.value = designer.designer_name;
    emailId.value = designer.email;
    designerNIC.value = designer.nic;
    DesignerAddress.value = designer.address;
    designerPH.value = designer.phone;
    dsnAdditionalPH.value = designer.additional_phone;


    if (designer.note != null) textNote.value = designer.note; else textNote.value;

    //get customer status datalist for select element
    designerstatus = getServiceAjaxRequest("/designerstatus/findall");
    designerstatus.push(designer.designer_status_id);

    fillDataIntoSelect(designerStatus, "Select Status", designerstatus, "name", designer.designer_status_id.name);


    //----------------------------------------------//

    if (userPrivilege.update_privilege) {
        btnEditDesigner.disabled = false;
        btnEditDesigner.style.cursor = "pointer";
    } else {
        btnEditDesigner.disabled = true;
        btnEditDesigner.style.cursor = "not-allowed";
    }

    btnSubmitDesigner.disabled = true;
    btnEditDesigner.disabled = false;

    btnSubmitDesigner.style.cursor = "not-allowed";
    btnEditDesigner.style.cursor = "pointer";

}

//define function to check form error
const checkFormError = () => {
    let errors = '';

    if (designer.designer_name == null) {
        isInValid([textDesignerName]);
        errors = errors + "Please Enter Valid Designer Name..! \n"
    }

    if (designer.email == null) {
        isInValid([emailId]);
        errors = errors + "Please Enter Valid Email Address..! \n"
    }

    if (designer.nic == null) {
        isInValid([designerNIC]);
        errors = errors + "Please Enter Valid NIC..! \n"
    }

    if (designer.address == null) {
        isInValid([DesignerAddress]);
        errors = errors + "Please Enter Valid Address..! \n"
    }

    if (designer.phone == null) {
        isInValid([designerPH]);
        errors = errors + "Please Enter Valid Phone Number..! \n"
    }

    if (designer.designer_status_id == null) {
        isInValid([designerStatus]);
        errors = errors + "Please Enter Valid Designer Status..! \n"
    }

    return errors;
}

const submitDesigner = () => {
    //console.log('submit');
    console.log(designer);

    //checking errors
    const errors = checkFormError();
    if (errors == '') {
        const userSubmitResponse = confirm('Are you sure to Submit...?' +
        "\n Designer Name : " + designer.designer_name +
        "\n Designer NIC : " + designer.nic);

        if (userSubmitResponse) {
            //call post service
            let postServiceResponse = getHTTPBodyAjaxRequest('/designer', 'POST', designer);

            if (postServiceResponse == "OK") {
                //if (new RegExp('^[0-9]{8}$').test(postServiceResponse)) {
                alert("Designer record successfully saved.....!\n")
                //change tab
                $('#tableDsignr').tab('show');
                refreshDesignerTable();// refresh table
                refreshDesignerForm();//refresh designer form
                formDesigner.reset();
            } else {
                alert("Failed to submit designer record! \n" + postServiceResponse);
            }
        }
    } else {
        alert("Form has following errors...\n" + errors);
    }
}

const checkFormUpdate = () => {
    let updates = "";

    if (designer.designer_name != olddesigner.designer_name) {
        updates = updates + "Designer Name has changed " + olddesigner.designer_name + " into " + designer.designer_name + " \n";
    }

    if (designer.email != olddesigner.email) {
        updates = updates + "Email has changed " + olddesigner.email + " into " + designer.email + " \n";
    }

    if (designer.nic != olddesigner.nic) {
        updates = updates + "Designer NIC has changed " + olddesigner.nic + " into " + designer.nic + " \n";
    }


    if (designer.address != olddesigner.address) {
        updates = updates + "Address has changed " + olddesigner.address + " into " + designer.address + " \n";
    }

    if (designer.phone != olddesigner.phone) {
        updates = updates + "Phone Number has changed " + olddesigner.phone + " into " + designer.phone + " \n";
    }

    if (designer.additional_phone != olddesigner.additional_phone) {
        updates = updates + "Additional Phone Number has changed " + olddesigner.additional_phone + " into " + designer.additional_phone + " \n";
    }



    if (designer.designer_status_id.name != olddesigner.designer_status_id.name) {
        updates = updates + "Designer Status has changed " + olddesigner.designer_status_id.name + " into " + designer.designer_status_id.name + " \n";
    }


    return updates;
}


const EditDesignerButton = () => {
    console.log('Edit');
    //check form error
    let errors = checkFormError();
    if (errors == "") {

        //check form update
        let updates = checkFormUpdate();
        if (updates != "") {
            //user confirmation
            let userConfirm = confirm(updates + "\n Are you sure to update following changes ?");
            if (userConfirm) {
                //call put serive request
                let putServiceResponse;
                $.ajax("/designer", {
                    async: false,
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(designer),
                    success: function (successOb) {
                        console.log("Success");
                        putServiceResponse = successOb;
                    },
                    error: function (errorOb) {
                        console.log("error");
                        putServiceResponse = errorOb;
                    }
                });

                //check put service responce
                if (putServiceResponse == "OK") {
                    alert("Succesfully updated...!");
                    $('#tableDsignr').tab('show');
                    refreshDesignerTable(); //it refreshes the Employee table
                    formDesigner.reset(); //it refreshs static element
                    refreshDesignerForm();//it refreshs dynamic behaviour

                } else {
                    alert("Failed to Update changes...!\n" + putServiceResponse)
                }
            }



        } else {
            alert("Nothing has updated...!")
        }

    } else {
        alert("Form Has Following errors...!\n" + errors);
    }

}


const printDesigner = () => {

}

const deleteDesigner = (ob, rowIndex) => {
    //get user confirmation
    const userConfirm = confirm('Are you sure to Delete following Designer..? \n'
        + '\n Designer Name is : ' + ob.designer_name
        + '\n Status is : ' + ob.designer_status_id.name
        + '\n Email is : ' + ob.email

    );

    if (userConfirm) {
        console.log(designer);
        //call delete service response
        const deleteServiceRespone = getHTTPBodyAjaxRequest('/designer', 'DELETE', ob);
        if (deleteServiceRespone == "OK") {
            alert('Designer Deleted Successfully..!');
            refreshDesignerTable();
        } else {
            alert('Failed to delete designer : You have folllowing errors \n' + deleteServiceRespone);
        }
    } else {
        refreshDesignerTable();
    }
}