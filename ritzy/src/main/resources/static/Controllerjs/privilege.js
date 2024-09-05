//browser onload event
window.addEventListener("load", () => {

    //check ths with under PrivilegeController after deleteMapping
    userPrivilege = getServiceAjaxRequest("/privilege/byloggedusermudule/PRIVILEGE");

    //call table refresh function
    refreshPrivilegeTable();

    //call user form function
    refreshPrivilegeForm();
});

const refreshPrivilegeTable = () => {
    //create privileges
    privileges = [];
    privileges = getServiceAjaxRequest("/privilege/findAll");


    //define display property
    //dataType: "text" -- can be used instead String, number , decimal, boolean date
    //dataType: "function" -- can be used instead object, array , boolean date

    const displaypropertyList = [
        { dataType: "function", propertyName: getRoleName },
        { dataType: "function", propertyName: getModuleName },
        { dataType: "function", propertyName: getSelectPrivilege },
        { dataType: "function", propertyName: getInsertPrivilege },
        { dataType: "function", propertyName: getUpdatePrivilege },
        { dataType: "function", propertyName: getDeletePrivilege }
    ];

    //call fill data into table function
    fillDataIntoTable(tablePrivilege, privileges, displaypropertyList, refillPrivlegeForm, printPrivlege, deletePrivlege, true,
        userPrivilege);

    //disable delete button
    privileges.forEach((element, index) => {
        if (!element.select_privilege && !element.insert_privilege && !element.update_privilege && !element.delete_privilege) {
            if (userPrivilege.delete) {
                tablePrivilege.children[1].children[index].children[7].children[1].disabled = "disabled";
            }
        }
    });


    //call jquery datatable function
    $("#tablePrivilege").dataTable();

    tablePrivilege_length.children[0].style.color = "white";
    tablePrivilege_length.children[0].children[0].style.color = "black";

    tablePrivilege_filter.children[0].style.color = "white";
    tablePrivilege_filter.children[0].children[0].style.color = "black";
}


const getRoleName = (ob) => {
    return ob.role_id.name;
}

const getModuleName = (ob) => {
    return ob.module_id.name;
}

const getSelectPrivilege = (ob) => {
    if (ob.select_privilege) {
        return "<i class='fa-solid fa-check-circle fa-2x text-success'></i>";
    } else {
        return "<i class='fa-solid fa-circle-xmark fa-2x text-danger'></i>";
    }
}

const getInsertPrivilege = (ob) => {
    if (ob.insert_privilege) {
        return "<i class='fa-solid fa-check-circle fa-2x text-success'></i>";
    } else {
        return "<i class='fa-solid fa-circle-xmark fa-2x text-danger'></i>";
    }
}

const getUpdatePrivilege = (ob) => {
    if (ob.update_privilege) {
        return "<i class='fa-solid fa-check-circle fa-2x text-success'></i>";
    } else {
        return "<i class='fa-solid fa-circle-xmark fa-2x text-danger'></i>";
    }
}

const getDeletePrivilege = (ob) => {
    if (ob.delete_privilege) {
        return "<i class='fa-solid fa-check-circle fa-2x text-success'></i>";
    } else {
        return "<i class='fa-solid fa-circle-xmark fa-2x text-danger'></i>";
    }
}

//create function for refresh form area
const refreshPrivilegeForm = () => {
    //create empty object
    privilege = {};

    //get data list for select element
    roles = getServiceAjaxRequest("/role/listwithoutadmin");
    fillDataIntoSelect(SelectRole, 'Select Role ', roles, 'name');
    SelectRole.disabled = false; //if the user selcts this only module will be able to select by this generateModuleList() function

    modules = getServiceAjaxRequest("/module/findAll");
    fillDataIntoSelect(SelectModule, 'Select Module ', modules, 'name');
    SelectModule.disabled = true; //this is disable when refreshing form bcz use could not be able to select this at first with out selecting the role

    privilege.select_privilege = false;
    privilege.insert_privilege = false;
    privilege.update_privilege = false;
    privilege.delete_privilege = false;

    labelSelectPriv.innerText = 'Select Privilege Not Granted';
    labelInsertPriv.innerText = 'Insert Privilege Not Granted';
    labelUpdatePriv.innerText = 'Update Privilege Not Granted';
    labelDeletePriv.innerText = 'Delete Privilege Not Granted';


    //
    SelectRole.className = "gradient-border form-select shadow-sm";
    SelectModule.className = "gradient-border form-select shadow-sm";


    // Remove validation classes
    var elements = document.getElementById("formPrivilege").querySelectorAll(".is-invalid");
    elements.forEach(function (element) {
        element.classList.remove("is-invalid");
    });

    //--------------------------------------//

    if (userPrivilege.insert_privilege) {
        btnEditPrivilege.disabled = false;
        btnEditPrivilege.style.cursor = "pointer";
    } else {
        btnEditPrivilege.disabled = true;
        btnEditPrivilege.style.cursor = "not-allowed";
    }


    btnEditPrivilege.disabled = true;
    btnEditPrivilege.style.cursor = "not-allowed";
    btnSubmitPrivilege.disabled = false;
    btnSubmitPrivilege.style.cursor = "pointer";
    // btnSubmitPrivilege
}

//define function form check error
const checkPrivilegeFormError = () => {
    let errors = "";
    if (privilege.select_privilege == null) {
        errors = errors + " Please Select Select Privilege..!\n";
    }

    if (privilege.insert_privilege == null) {
        errors = errors + " Please Select Insert Privilege..!\n";
    }

    if (privilege.update_privilege == null) {
        errors = errors + " Please Select Update Privilege..!\n";
    }

    if (privilege.delete_privilege == null) {
        errors = errors + " Please Select Delete Privilege..!\n";
    }

    if (privilege.role_id == null) {
        errors = errors + " Please Select Role..!\n";
    }

    if (privilege.module_id == null) {
        errors = errors + " Please Select Module..!\n"
    }

    return errors;
}


//create function for add privilege
const buttondPrivilegeAdd = () => {
    //
    console.log(privilege);
    // need to check form error
    let errors = checkPrivilegeFormError();
    if (errors == "") {
        //get user confirmation
        const userResponse = confirm("Are you sure to add following Privilege details....?" +
            "\n Role : " + privilege.role_id.name +
            "\n Module : " + privilege.module_id.name);

        if (userResponse) {
            //call post service
            const postServiceResponse = getHTTPBodyAjaxRequest("/privilege", "POST", privilege);

            if (postServiceResponse == "OK") {
                alert("Privilege form saved successfully...!");
                $('#Privtable').tab('show'); //change tab
                refreshPrivilegeTable();
                formPrivilege.reset(); // this is an id of user form
                refreshPrivilegeForm(); // 
            } else {
                alert("Privilege Form Has following Errors...!\n" + postServiceResponse);
            }
        }


    } else {
        alert("Privilege Form has Errors...!\n" + errors);
    }

}

//create refill function
const refillPrivlegeForm = (rowOb, rowId) => {

    $('#PrivForm').tab('show');

    privilege = JSON.parse(JSON.stringify(rowOb));
    oldprivilege = JSON.parse(JSON.stringify(rowOb));

    //get data list for select element
    roles = getServiceAjaxRequest("/role/listwithoutadmin");
    fillDataIntoSelect(SelectRole, 'Select Role ', roles, 'name', privilege.role_id.name);
    SelectRole.disabled = true;

    modules = getServiceAjaxRequest("/module/findAll");
    fillDataIntoSelect(SelectModule, 'Select Module ', modules, 'name', privilege.module_id.name);
    SelectModule.disabled = true;

    if (privilege.select_privilege) {
        priv_select.checked = true;
        labelSelectPriv.innerText = 'Select Privilege Granted';
    } else {
        priv_select.checked = false;
        labelSelectPriv.innerText = 'Select Privilege Not Granted';
    }


    if (privilege.insert_privilege) {
        priv_insert.checked = true;
        labelInsertPriv.innerText = 'Insert Privilege Granted';
    } else {
        priv_insert.checked = false;
        labelInsertPriv.innerText = 'Insert Privilege Not Granted';
    }

    if (privilege.update_privilege) {
        priv_update.checked = true;
        labelUpdatePriv.innerText = 'Update Privilege Granted';
    } else {
        priv_update.checked = false;
        labelUpdatePriv.innerText = 'Update Privilege Not Granted';
    }

    if (privilege.delete_privilege) {
        priv_delete.checked = true;
        labelDeletePriv.innerText = 'Delete Privilege Granted';
    } else {
        priv_delete.checked = false;
        labelDeletePriv.innerText = 'Delete Privilege Not Granted';
    };

    //----------------------------------------------//

    if (userPrivilege.update_privilege) {
        btnEditPrivilege.disabled = false;
        btnEditPrivilege.style.cursor = "pointer";
    } else {
        btnEditPrivilege.disabled = true;
        btnEditPrivilege.style.cursor = "not-allowed";
    }

    btnSubmitPrivilege.disabled = true;
    btnEditPrivilege.disabled = false;

    btnSubmitPrivilege.style.cursor = "not-allowed";
    btnEditPrivilege.style.cursor = "pointer";

}

const deletePrivlege = (rowOb, rowId) => {
    console.log(privilege);
    const userConfirm = confirm('Are you sure to Delete following Privilege....?\n'
        // + "\n Role : " + privilege.role_id.name +
        // "\n Module : " + privilege.module_id.name
    );

    if (userConfirm) {
        console.log(privilege);
        //request delete service
        const deleteServiceRespone = getHTTPBodyAjaxRequest("/privilege", "DELETE", rowOb);
        if (deleteServiceRespone == 'OK') {
            alert('Privilege Deleted Succesfully...!');
            refreshPrivilegeTable();

        } else {
            alert('Failed to delete Privlege : You have following errors..! \n' + deleteServiceRespone);
        }
    } else {
        refreshPrivilegeTable();
    }
}

//define function for get form update
const checkPrivilegeFormUpdates = () => {
    let updates = "";


    if (privilege.select_privilege != oldprivilege.select_privilege) {
        updates = updates + "Select Privilege has changed  \n";
    }
    if (privilege.insert_privilege != oldprivilege.insert_privilege) {
        updates = updates + "Insert Privilege has changed  \n";
    }
    if (privilege.update_privilege != oldprivilege.update_privilege) {
        updates = updates + "Update Privilege has changed  \n";
    }
    if (privilege.delete_privilege != oldprivilege.delete_privilege) {
        updates = updates + "Delete Privilege has changed  \n";
    }
    if (privilege.role_id.name != oldprivilege.role_id.name) {
        updates = updates + "Role has changed  \n";
    }
    if (privilege.module_id.name != oldprivilege.module_id.name) {
        updates = updates + "Module has changed  \n";
    }

    return updates;
}

//define function for user update inside view user button
const editPrivilege = () => {
    console.log(privilege);
    console.log(oldprivilege);

    console.log('edit');
    //check form error
    let errors = checkPrivilegeFormError();
    if (errors == "") {
        //check update availability
        let updates = checkPrivilegeFormUpdates();
        if (updates == "") {
            alert("Nothing updated..!")
        } else {
            //get user confirmation
            let userConfirm = confirm("Are you sure to update following changes ...? \n" + updates);
            if (userConfirm) {
                //call put Service
                let putServiceResponce = getHTTPBodyAjaxRequest("/privilege", "PUT", privilege)
                if (putServiceResponce == "OK") {
                    alert("Successfully Updated....!");
                    $('#Privtable').tab('show'); //change tab
                    formPrivilege.reset(); // this is an id of user form
                    refreshPrivilegeTable();
                    refreshPrivilegeForm();
                } else {
                    alert("Failed to update...\n Form Has following errors \n" + putServiceResponce)
                }
            }
        }
    } else {
        alert("Form has following errors..\n" + errors);
    }
}



const printPrivlege = () => {

}

//define function for filter module list by given role
const generateModuleList = () => {

    modulesByRoles = getServiceAjaxRequest("/module/findAllbyrole?roleid=" + JSON.parse(SelectRole.value).id);
    fillDataIntoSelect(SelectModule, 'Select Module ', modulesByRoles, 'name');
    SelectModule.disabled = false;
}


