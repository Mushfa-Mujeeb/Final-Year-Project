// browser onload event
window.addEventListener("load", () => {


  //check ths with under PrivilegeController after deleteMapping
  userPrivilege = getServiceAjaxRequest("/privilege/byloggedusermudule/EMPLOYEE");

  //call table refresh function
  refreshEmployeeTable();

  //call form refresh function
  refreshEmployeeForm();
});

const refreshEmployeeTable = () => {
  employees = [];
  employees = getServiceAjaxRequest("/employee/findall");

  const displayProperty = [
    { dataType: "text", propertyName: "emp_first_name" },
    { dataType: "text", propertyName: "email" },
    { dataType: "text", propertyName: "address" },
    { dataType: "text", propertyName: "phone" },
    { dataType: "function", propertyName: getDesignation },
    { dataType: "function", propertyName: getEmployeeStatus },
  ];

  fillDataIntoTable(
    tableEmployee,
    employees,
    displayProperty,
    employeeFormRefill,
    printEmpolyee,
    deleteEmployee,
    true,
    userPrivilege
  );

  //disable delete button
  employees.forEach((element, index) => {
    if (element.employeestatus_id.name == "Deleted") {
      if (userPrivilege.delete) {
        tableEmployee.children[1].children[index].children[7].children[1].disabled = "disabled";
      }
    }
  });


  //call jquery datatable function
  $("#tableEmployee").dataTable();

  tableEmployee_length.children[0].style.color = "white";
  tableEmployee_length.children[0].children[0].style.color = "black";

  tableEmployee_filter.children[0].style.color = "white";
  tableEmployee_filter.children[0].children[0].style.color = "black";
};


const getEmployeeStatus = (ob) => {
  // return 'ss';
  //return ob.employeeStatus_id.name;
  if (ob.employeestatus_id.name == 'Working') {
    return '<p style="border-radius:10px " class="btn-dressavailability-Available p-2 text-center fw-bold">' + ob.employeestatus_id.name + '</p>'
  }

  if (ob.employeestatus_id.name == 'Resigned') {
    return '<p style="border-radius:10px" class="btn-dressavailability-Under-Maintenance p-2 text-center fw-bold">' + ob.employeestatus_id.name + '</p>'
  }

  if (ob.employeestatus_id.name == 'Deleted') {
    return '<p style="border-radius:10px" class="btn-dressavailability-OutofStock p-2 text-center fw-bold">' + ob.employeestatus_id.name + '</p>'
  }
}

const getDesignation = (ob) => {
  return ob.designation_id.name;
}

const employeeFormRefill = (ob, rowIndex) => {
  console.log("Edit");

  employee = JSON.parse(JSON.stringify(ob)); //
  oldemployee = JSON.parse(JSON.stringify(ob));

  //open modal
  $("#empForm").tab("show");
  //set value into static element
  //elementid.value = ob.relevantPropertyName
  empFName.value = employee.emp_first_name;
  empLName.value = employee.emp_last_name;
  emailId.value = employee.email;
  empAddress.value = employee.address;
  empPhoneNumber.value = employee.phone;


  if (employee.note != null) textNote.value = employee.note; else textNote.value;


  //get employee list withoutuseraccount
  designations = getServiceAjaxRequest("/designation/findall");
  designations.push(employee.designation_id); //pushing employee object which has to be refilled

  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(empDesignation, "Select Designation", designations, "name", employee.designation_id.name);



  //get employee status datalist for select element
  employeestatus = getServiceAjaxRequest("/employeestatus/findall");
  employeestatus.push(employee.employeestatus_id);

  fillDataIntoSelect(empStatus, "Select Status", employeestatus, "name", employee.employeestatus_id.name);

  //check ths with under PrivilegeController after deleteMapping



  if (userPrivilege.update_privilege) {
    btnEditEmployee.disabled = false;
    btnEditEmployee.style.cursor = "pointer";
  } else {
    btnEditEmployee.disabled = true;
    btnEditEmployee.style.cursor = "not-allowed";
  }

  btnSubmitEmployee.disabled = true;
  btnEditEmployee.disabled = false;

  btnSubmitEmployee.style.cursor = "not-allowed";
  btnEditEmployee.style.cursor = "pointer";
  // btnSubmitEmployee

};

const printEmpolyee = () => { }


const deleteEmployee = (ob, rowIndex) => {
  //get user confirmation
  const userConfirm = confirm('Are you sure to Delete following Employee..? \n'
    + '\n First Name is : ' + ob.emp_first_name
    + '\n Status is : ' + ob.employeestatus_id.name
    + '\n Email is : ' + ob.email

  );

  if (userConfirm) {
    console.log(employee);
    //call delete service response
    const deleteServiceRespone = getHTTPBodyAjaxRequest('/employee', 'DELETE', ob);
    if (deleteServiceRespone == "OK") {
      alert('Employee Deleted Successfully..!');
      refreshEmployeeTable();
    } else {
      alert('Failed delete employee : You have folllowing errors \n' + deleteServiceRespone);
    }
  } else {
    refreshEmployeeTable();
  }


};

//define function to chech form error
const checkFormError = () => {
  let errors = '';

  if (employee.emp_first_name == null) {
    isInValid([empFName]);
    errors = errors + "Please Enter Valid First Name..! \n"
  }

  if (employee.emp_last_name == null) {
    isInValid([empLName]);
    errors = errors + "Please Enter Valid Last Name..! \n"
  }

  if (employee.email == null) {
    isInValid([emailId]);
    errors = errors + "Please Enter Valid Email Address..! \n"
  }

  if (employee.address == null) {
    isInValid([empAddress]);
    errors = errors + "Please Enter Valid Address..! \n"
  }

  if (employee.phone == null) {
    isInValid([empPhoneNumber]);
    errors = errors + "Please Enter Valid Phone Number..! \n"
  }

  if (employee.designation_id == null) {
    isInValid([empDesignation]);
    errors = errors + "Please Select Designation..! \n"
  }

  if (employee.employeestatus_id == null) {
    isInValid([empStatus]);
    errors = errors + "Please Select Employee Status..! \n"
  }

  return errors;
}

const checkFormUpdate = () => {
  let updates = "";

  if (employee.emp_first_name != oldemployee.emp_first_name) {
    updates = updates + "First Name has changed " + oldemployee.emp_first_name + " into " + employee.emp_first_name + " \n";
  }

  if (employee.emp_last_name != oldemployee.emp_last_name) {
    updates = updates + "Last Name has changed " + oldemployee.emp_last_name + " into " + employee.emp_last_name + " \n";
  }

  if (employee.email != oldemployee.email) {
    updates = updates + "Email has changed " + oldemployee.email + " into " + employee.email + " \n";
  }


  if (employee.address != oldemployee.address) {
    updates = updates + "Address has changed " + oldemployee.address + " into " + employee.address + " \n";
  }

  if (employee.phone != oldemployee.phone) {
    updates = updates + "Phone Number has changed " + oldemployee.phone + " into " + employee.phone + " \n";
  }


  if (employee.designation_id.name != oldemployee.designation_id.name) {
    updates = updates + "Designation has changed " + oldemployee.designation_id.name + " into " + employee.designation_id.name + " \n";
  }

  if (employee.employeestatus_id.name != oldemployee.employeestatus_id.name) {
    updates = updates + "Employee Status has changed " + oldemployee.employeestatus_id.name + " into " + employee.employeestatus_id.name + " \n";
  }


  return updates;
}


const editEmployee = () => {
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
        $.ajax("/employee", {
          async: false,
          type: "PUT",
          contentType: "application/json",
          data: JSON.stringify(employee),
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
          $("#tableEmp").tab("show");
          refreshEmployeeTable(); //it refreshes the Employee table
          employeeForm.reset(); //it refreshs static element
          refreshEmployeeForm();//it refreshs dynamic behaviour

        } else {
          alert("Failed to Update changes...!\n" + putServiceResponse)
        }
      }



    } else {
      alert("Nothing has updated...!");
    }

  } else {
    alert("Form Has Following errors...!\n" + errors);
  }

};

//create function for refresh form area
const refreshEmployeeForm = () => {

  //create empty object
  employee = {};


  //get employee list withoutuseraccount
  designations = getServiceAjaxRequest("/designation/findall");


  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(empDesignation, "Select Designation", designations, "name");



  //get employee status datalist for select element
  employeestatus = getServiceAjaxRequest("/employeestatus/findall");

  fillDataIntoSelect(empStatus, "Select Status", employeestatus, "name");



  //set default input feild styles                                             
  empFName.className = "gradient-border form-control shadow-sm";
  empLName.className = "gradient-border form-control shadow-sm";
  emailId.className = "gradient-border form-control shadow-sm";
  empAddress.className = "gradient-border form-control shadow-sm";
  empPhoneNumber.className = "gradient-border form-control shadow-sm";
  empStatus.className = "gradient-border form-select shadow-sm";
  empDesignation.className = "gradient-border form-select shadow-sm";
  textNote.className = "gradient-border form-control shadow-sm";

  //set to default color to feilds if after refreshing for
  // Remove validation classes
  var elements = document.getElementById("employeeForm").querySelectorAll(".is-invalid");
  elements.forEach(function (element) {
    element.classList.remove("is-invalid");
  });




  if (userPrivilege.insert_privilege) {
    btnEditEmployee.disabled = false;
    btnEditEmployee.style.cursor = "pointer";
  } else {
    btnEditEmployee.disabled = true;
    btnEditEmployee.style.cursor = "not-allowed";
  }


  btnEditEmployee.disabled = true;
  btnEditEmployee.style.cursor = "not-allowed";
  btnSubmitEmployee.disabled = false;
  btnSubmitEmployee.style.cursor = "pointer";
  // btnSubmitEmployee

};



//define function for submit employee
const submitEmployee = () => {
  //console.log('submit');
  console.log(employee);

  //checking errors
  const errors = checkFormError();
  if (errors == '') {
    const userSubmitResponse = confirm('Are you sure to Submit...?');

    if (userSubmitResponse) {
      //call post service
      let postServiceResponse = getHTTPBodyAjaxRequest('/employee', 'POST', employee);

      if (postServiceResponse == "OK") {
        //if (new RegExp('^[0-9]{8}$').test(postServiceResponse)) {
        alert("Employee record successfully saved.....!\n")
        //change tab
        $('#tableEmp').tab('show')
        refreshEmployeeTable();// refresh table
        refreshEmployeeForm();//refresh employee form
        employeeForm.reset();
      } else {
        alert("Failed to submit employee record! \n" + postServiceResponse);
      }
    }
  } else {
    alert("Form has following errors...\n" + errors);
  }
};
