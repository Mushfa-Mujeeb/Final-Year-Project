// browser onload event
window.addEventListener("load", () => {

    //check ths with under PrivilegeController after deleteMapping
    userPrivilege = getServiceAjaxRequest("/privilege/byloggedusermudule/CUSTOMER");


    //call table refresh function
    refreshCustomerTable();

    //call form refresh function
    refreshCustomerForm();
});

const refreshCustomerTable = () => {
    customers = [];
    customers = getServiceAjaxRequest("/customer/findAll");

    const displayProperty = [
        { dataType: "text", propertyName: "first_name" },
        { dataType: "text", propertyName: "email" },
        { dataType: "text", propertyName: "address" },
        { dataType: "text", propertyName: "phone" },
        { dataType: "function", propertyName: getCustomerStatus }
    ];

    fillDataIntoTable(
        tableCustomer,
        customers,
        displayProperty,
        customerFormRefill,
        printCustomer,
        deleteCustomer,
        true,
        userPrivilege
    );

    //disable delete button
    customers.forEach((element, index) => {
        if (element.customerstatus_id.name == "In-active") {
            if (userPrivilege.delete) {
                tableCustomer.children[1].children[index].children[6].children[1].disabled = "disabled";
            }
        }
    });


    //call jquery datatable function
    $("#tableCustomer").dataTable();

    tableCustomer_length.children[0].style.color = "white";
    tableCustomer_length.children[0].children[0].style.color = "black";

    tableCustomer_filter.children[0].style.color = "white";
    tableCustomer_filter.children[0].children[0].style.color = "black";
};


const getCustomerStatus = (ob) => {
    if (ob.customerstatus_id.name == 'Active') {
        return '<p style="border-radius:10px" class="btn-dressavailability-Available text-center fw-bold">' + ob.customerstatus_id.name + '</p>';
    }

    if (ob.customerstatus_id.name == 'In-active') {
        return '<p style="border-radius:10px" class="btn-dressavailability-OutofStock text-center fw-bold">' + ob.customerstatus_id.name + '</p>';
    }

}

const refreshCustomerForm = () => {

    //create empty object
    customer = {};

    //get customer status datalist for select element
    customerstatus = getServiceAjaxRequest("/customerstatus/findall");

    fillDataIntoSelect(custStatus, "Select Status", customerstatus, "name");



    //set default input feild styles                                             
    custFName.className = "gradient-border form-control shadow-sm";
    custLName.className = "gradient-border form-control shadow-sm";
    emailId.className = "gradient-border form-control shadow-sm";
    customerNIC.className = "gradient-border form-control shadow-sm";
    custAddress.className = "gradient-border form-control shadow-sm";
    custPhoneNumber.className = "gradient-border form-control shadow-sm";
    custStatus.className = "gradient-border form-select shadow-sm";
    textNote.className = "gradient-border form-control shadow-sm";

    //set to default color to feilds if after refreshing for
    // Remove validation classes
    var elements = document.getElementById("customerForm").querySelectorAll(".is-invalid");
    elements.forEach(function (element) {
        element.classList.remove("is-invalid");
    });


    //--------------------------------------//

    if (userPrivilege.insert_privilege) {
        btnEditCustomer.disabled = false;
        btnEditCustomer.style.cursor = "pointer";
    } else {
        btnEditCustomer.disabled = true;
        btnEditCustomer.style.cursor = "not-allowed";
    }


    btnEditCustomer.disabled = true;
    btnEditCustomer.style.cursor = "not-allowed";
    btnSubmitCustomer.disabled = false;
    btnSubmitCustomer.style.cursor = "pointer";
    // btnSubmitCustomer

}

const customerFormRefill = (ob, rowIndex) => {
    console.log("Edit");

    customer = JSON.parse(JSON.stringify(ob)); //
    oldcustomer = JSON.parse(JSON.stringify(ob));

    //open modal
    $("#custForm").tab("show");
    //set value into static element
    //elementid.value = ob.relevantPropertyName
    custFName.value = customer.first_name;
    custLName.value = customer.last_name;
    emailId.value = customer.email;
    customerNIC.value = customer.nic;
    custAddress.value = customer.address;
    custPhoneNumber.value = customer.phone;


    if (customer.note != null) textNote.value = customer.note; else textNote.value;

    //get customer status datalist for select element
    customerstatus = getServiceAjaxRequest("/customerstatus/findall");
    customerstatus.push(customer.customerstatus_id);

    fillDataIntoSelect(custStatus, "Select Status", customerstatus, "name", customer.customerstatus_id.name);

    //----------------------------------------------//

    if (userPrivilege.update_privilege) {
        btnEditCustomer.disabled = false;
        btnEditCustomer.style.cursor = "pointer";
    } else {
        btnEditCustomer.disabled = true;
        btnEditCustomer.style.cursor = "not-allowed";
    }

    btnSubmitCustomer.disabled = true;
    btnEditCustomer.disabled = false;

    btnSubmitCustomer.style.cursor = "not-allowed";
    btnEditCustomer.style.cursor = "pointer";


}


const printCustomer = () => {

}


const deleteCustomer = (ob, rowIndex) => {
    //get user confirmation
    const userConfirm = confirm('Are you sure to Delete following Employee..? \n'
        + '\n Customer Name is : ' + ob.first_name
        + '\n Status is : ' + ob.customerstatus_id.name
        + '\n Email is : ' + ob.email

    );

    if (userConfirm) {
        console.log(customer);
        //call delete service response
        const deleteServiceRespone = getHTTPBodyAjaxRequest('/customer', 'DELETE', ob);
        if (deleteServiceRespone == "OK") {
            alert('Customer Deleted Successfully..!');
            refreshCustomerTable();
        } else {
            alert('Failed to delete customer : You have folllowing errors \n' + deleteServiceRespone);
        }
    } else {
        refreshCustomerTable();
    }
}


//define function to check form error
const checkFormError = () => {
    let errors = '';

    if (customer.first_name == null) {
        isInValid([custFName]);        
        errors = errors + "Please Enter Valid First Name..! \n"
    }

    if (customer.last_name == null) {
        isInValid([custLName]);        
        errors = errors + "Please Enter Valid Last Name..! \n"
    }

    if (customer.email == null) {
        isInValid([emailId]);
        errors = errors + "Please Enter Valid Email Address..! \n"
    }

    if (customer.nic == null) {
        isInValid([customerNIC]);
        errors = errors + "Please Enter Valid NIC..! \n"
    }

    if (customer.address == null) {
        isInValid([custAddress]);
        errors = errors + "Please Enter Valid Address..! \n"
    }

    if (customer.phone == null) {
        isInValid([custPhoneNumber]);
        errors = errors + "Please Enter Valid Phone Number..! \n"
    }

    if (customer.customerstatus_id == null) {
        isInValid([custStatus]);
        errors = errors + "Please Select Customer Status..! \n"
    }

    return errors;
}

const checkFormUpdate = () => {
    let updates = "";

    if (customer.first_name != oldcustomer.first_name) {
        updates = updates + "First Name has changed " + oldcustomer.first_name + " into " + customer.first_name + " \n";
    }

    if (customer.last_name != oldcustomer.last_name) {
        updates = updates + "Last Name has changed " + oldcustomer.last_name + " into " + customer.last_name + " \n";
    }

    if (customer.email != oldcustomer.email) {
        updates = updates + "Email has changed " + oldcustomer.email + " into " + customer.email + " \n";
    }

    if (customer.nic != oldcustomer.nic) {
        updates = updates + "NIC has changed " + oldcustomer.nic + " into " + customer.nic + " \n";
    }


    if (customer.address != oldcustomer.address) {
        updates = updates + "Address has changed " + oldcustomer.address + " into " + customer.address + " \n";
    }

    if (customer.phone != oldcustomer.phone) {
        updates = updates + "Phone Number has changed " + oldcustomer.phone + " into " + customer.phone + " \n";
    }



    if (customer.customerstatus_id.name != oldcustomer.customerstatus_id.name) {
        updates = updates + "Customer Status has changed " + oldcustomer.customerstatus_id.name + " into " + customer.customerstatus_id.name + " \n";
    }


    return updates;
}

//define function for submit Customer
const submitCustomer = () => {
    //console.log('submit');
    console.log(customer);

    //checking errors
    const errors = checkFormError();
    if (errors == '') {
        const userSubmitResponse = confirm('Are you sure to Submit...?'+
        "\n Customer First Name : " + customer.first_name +
        "\n Customer NIC : " + customer.nic);

        if (userSubmitResponse) {
            //call post service
            let postServiceResponse = getHTTPBodyAjaxRequest('/customer', 'POST', customer);

            if (postServiceResponse == "OK") {
                //if (new RegExp('^[0-9]{8}$').test(postServiceResponse)) {
                alert("Customer record successfully saved.....!\n")
                //change tab
                $('#tableCust').tab('show');
                refreshCustomerTable();// refresh table
                refreshCustomerForm();//refresh customer form
                customerForm.reset();
            } else {
                alert("Failed to submit customer record! \n" + postServiceResponse);
            }
        }
    } else {
        alert("Form has following errors...\n" + errors);
    }
};

EditCustomerButton = () => {
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
                $.ajax("/customer", {
                    async: false,
                    type: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(customer),
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
                    $('#tableCust').tab('show');
                    refreshCustomerTable(); //it refreshes the Employee table
                    customerForm.reset(); //it refreshs static element
                    refreshCustomerForm();//it refreshs dynamic behaviour

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