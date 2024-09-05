//browser onload event
window.addEventListener("load", () => {


  //check ths with under PrivilegeController after deleteMapping
  userPrivilege = getServiceAjaxRequest("/privilege/byloggedusermudule/USER");

  //call table refresh function
  refreshUserTable();

  //call user form function
  refreshUserForm();
});

//define function table refresh
const refreshUserTable = () => {
  //create array for store user find all data
  // users = new Object();
  users = getServiceAjaxRequest("/user/findall");

  //define display property
  const displaypropertyList = [
    { dataType: "function", propertyName: getEmployeeName },
    { dataType: "text", propertyName: "username" },
    { dataType: "text", propertyName: "email" },
    { dataType: "function", propertyName: getUserRole },
    { dataType: "function", propertyName: getUserStatus },
  ];

  //call filldatainto table function
  fillDataIntoTable(
    tableUser,
    users,
    displaypropertyList,
    refillUserForm,
    printUser,
    deleteUser,
    true,
    userPrivilege
  );

  //disable delete button
  users.forEach((element, index) => {
    if (!element.status) {
      if (userPrivilege.delete) {
        tableUser.children[1].children[index].children[6].children[1].disabled = "disabled";
      }
    }
  });

  //call jQuery dataTables
  $('#tableUser').dataTable();

  tableUser_length.children[0].style.color = "white";
  tableUser_length.children[0].children[0].style.color = "black";

  tableUser_filter.children[0].style.color = "white";
  tableUser_filter.children[0].children[0].style.color = "black";
};

const getEmployeeName = (ob) => {
  return ob.employee_id.emp_first_name; // check the correct spelling .employee_id.emp_first_name from /user/findall
};

const getUserRole = (ob) => {
  // return "role";
  // let userRloe = "";
  // ob.roles.forEach(element => {
  //   userRloe = userRloe + element.name + " | ";
  // });

  // return userRoles;
  //return "Role";

  let userRoles = "";
  ob.roles.forEach((element, index) => {
    if (index == ob.roles.length - 1) {
      userRoles = userRoles + element.name;
    } else {
      userRoles = userRoles + element.name + " | ";
    }
  });
  return userRoles;
};

const getUserStatus = (ob) => {
  if (ob.status) {
    return '<p style="border-radius: 10px ;" class="btn-dressavailability-Available fw-bold text-center p-2">Active</p>';
  } else {
    return '<p style="border-radius: 10px ;" class="btn-dressavailability-OutofStock fw-bold text-center p-2">In-Active</p>';
  }
};

const refillUserForm = (ob, rowob) => {
  console.log('Refill');
  user = JSON.parse(JSON.stringify(ob));
  olduser = JSON.parse(JSON.stringify(ob));

  $('#userform').tab('show');

  //get employee list withoutuseraccount
  employeeListWithoutUserAccount = getServiceAjaxRequest("/employee/listbywithoutuseraccount");
  employeeListWithoutUserAccount.push(user.employee_id); //pushing employee object which has to be refilled

  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(selectEmployee, "Select Employee", employeeListWithoutUserAccount, "emp_first_name", user.employee_id.emp_first_name);

  userName.value = user.username;
  emailId.value = user.email;


  // role
  roles = getServiceAjaxRequest("/role/listwithoutadmin");
  selectRole.innerHTML = "";
  selectRole.className = "shadow-sm gradient-border row m-0";
  roles.forEach(role => {

    div = document.createElement('div');
    div.className = "form-check form-check-inline col-4";
    inputCHK = document.createElement('input');
    inputCHK.type = "checkbox";
    inputCHK.className = "form-check-input mt-2 m-2";
    label = document.createElement('label');
    label.className = "form-check-label checkbx-text-customization mt-1 m-2"
    label.innerText = role.name;


    //this code section is to push selected checkboxes properly
    inputCHK.onchange = function () {
      if (this.checked) {
        user.roles.push(role);
      } else {
        //if unchecked/unticked this else section works 
        let extIndex = user.roles.map(element => element.name).indexOf(role.name);
        if (extIndex != -1) {
          user.roles.splice(extIndex, 1);
        }
      }
    }


    div.appendChild(inputCHK);
    div.appendChild(label)

    selectRole.appendChild(div)

    //get user role to refill
    let existingURoleIndex = user.roles.map(item => item.name).indexOf(role.name);
    if (existingURoleIndex != -1) {
      inputCHK.checked = true;
    }

  });

  if (user.status) {
    SelectStatus.checked = true;
    labelUserStatus.innerText = "User Account is Active";
  } else {
    SelectStatus.checked = false;
    labelUserStatus.innerText = "User Account is  In-Active";
  }

  selectEmployee.disabled = true;
  textPassword.disabled = true;
  rePassword.disabled = true;



  //----------------------------------------------//

  if (userPrivilege.update_privilege) {
    btnEditUser.disabled = false;
    btnEditUser.style.cursor = "pointer";
  } else {
    btnEditUser.disabled = true;
    btnEditUser.style.cursor = "not-allowed";
  }

  btnSubmitUser.disabled = true;
  btnEditUser.disabled = false;

  btnSubmitUser.style.cursor = "not-allowed";
  btnEditUser.style.cursor = "pointer";

}

//define function form check error
const checkUserFormErrors = () => {
  let errors = "";
  if (user.employee_id == null) {
    isInValid([selectEmployee]);
    errors = errors + " Please Select Employee.....\n";
  }

  if (user.username == null) {
    isInValid([userName]);
    errors = errors + " Please Enter Username....\n";
  }

  if (user.password == null) {
    isInValid([textPassword]);
    errors = errors + " Please Enter Password....\n";
  }

  if (olduser == null) {
    if (rePassword.value == "") {
      isInValid([rePassword]);
      errors = errors + " Please Re-type the Password....\n";
    }
  }

  if (user.email == null) {
    isInValid([emailId]);
    errors = errors + " Please Enter Email....\n";
  }

  if (user.roles.length == 0) {
    errors = errors + " Please Select Role.....!\n"
  }

  return errors;
}

//define function for get form update
const checkUserFormUpdates = () => {
  let updates = "";


  if (user.employee_id.id != olduser.employee_id.id) {
    updates = updates + "Employee is changed  \n";
  }

  if (user.username != olduser.username) {
    updates = updates + "Username is changed " + olduser.username + " into " + user.username + " \n";
  }

  if (user.email != olduser.email) {
    updates = updates + "Email is changed " + olduser.email + " into " + user.email + " \n";
  }

  // if (user.password != olduser.password) {
  //   updates = updates + "Password is changed " + olduser.password + " into " + user.password + " \n";
  // }


  if (user.status != olduser.status) {
    updates = updates + "Status is changed \n";
  }


  if (user.roles.length != olduser.roles.length) { //will be usefull for attendance
    updates = updates + "Roles is changed  \n";
  } else {
    let extcount = 0;
    for (let newrole of user.roles) { //have to check element count in list 
      for (let oldrole of olduser.roles) {
        if (newrole.id == oldrole.id) { //
          extcount = extcount + 1;
        }
      }

    }

    if (user.roles.length != extcount) {
      updates = updates + "Roles is changed  \n";
    }
  }
  return updates;
}


const printUser = () => { }



const deleteUser = (ob, rowIndex) => {  //userController ---> line 68 
  console.log(user);
  const userConfirm = confirm('Are you sure to Delete following User account....?\n' +
    '\n Employee is : ' + ob.employee_id.emp_first_name +
    '\n Username is : ' + ob.username +
    '\n email is : ' + ob.email);

  if (userConfirm) {
    //request delete service
    const deleteServiceRespone = getHTTPBodyAjaxRequest("/user", "DELETE", ob);
    if (deleteServiceRespone == 'OK') {
      alert('User Deleted Succesfully...!');
      refreshUserTable();
    } else {
      alert('Failed to delete User : You have following errors..! \n' + deleteServiceRespone);
    }
  } else {
    refreshUserTable();
  }
}

//define function for user update inside view user button
const editUser = () => {
  console.log(user);
  console.log(olduser);

  console.log('edit');
  //check form error
  let errors = checkUserFormErrors();
  if (errors == "") {
    //check update availability
    let updates = checkUserFormUpdates();
    if (updates == "") {
      alert("Nothing updated..!")
    } else {
      //get user confirmation
      let userConfirm = confirm("Are you sure to update following changes ...? \n" + updates);
      if (userConfirm) {
        //call put Service
        let putServiceResponce = getHTTPBodyAjaxRequest("/user", "PUT", user)
        if (putServiceResponce == "OK") {
          alert("Successfully Updated....!");
          $('#userform').tab('show'); //change tab
          userForm.reset();
          refreshUserTable();
          refreshUserForm();
        } else {
          alert("Failed to update...\n Form Has following errors \n" + putServiceResponce)
        }
      }
    }
  } else {
    alert("Form has following errors..\n" + errors);
  }
}



//define function user form refresh
const refreshUserForm = () => {
  //create new object call user
  user = new Object();
  olduser = null;


  user.roles = new Array(); // to store roles

  //employee list without user account
  employeeListWithoutUserAccount = getServiceAjaxRequest("/employee/listwithoutuseraccount");
  fillDataIntoSelect(selectEmployee, 'Select Employee', employeeListWithoutUserAccount, 'emp_first_name');

  //set auto binding
  user.status = true;
  labelUserStatus.innerText = "User Account is Active";

  //set default input feild styles                                             
  selectEmployee.className = "gradient-border form-select shadow-sm";
  userName.className = "gradient-border form-control shadow-sm";  
  textPassword.className = "gradient-border form-control shadow-sm";
  rePassword.className = "gradient-border form-control shadow-sm";
  emailId.className = "gradient-border form-control shadow-sm";
  textNote.className = "gradient-border form-control shadow-sm";

  // role
  roles = getServiceAjaxRequest("/role/listwithoutadmin");
  selectRole.innerHTML = "";
  selectRole.className = "shadow-sm gradient-border row m-0";
  roles.forEach(role => {

    div = document.createElement('div');
    div.className = "form-check form-check-inline col-4";
    inputCHK = document.createElement('input');
    inputCHK.type = "checkbox";
    inputCHK.className = "form-check-input mt-2 m-2";
    label = document.createElement('label');
    label.className = "form-check-label checkbx-text-customization mt-1 m-2"
    label.innerText = role.name;


    //this code section is to push selected checkboxes properly
    inputCHK.onchange = function () {
      if (this.checked) {
        user.roles.push(role);
      } else {
        //if unchecked/unticked this else section works 
        let extIndex = user.roles.map(element => element.name).indexOf(role.name);
        if (extIndex != -1) {
          user.roles.splice(extIndex, 1);
        }
      }
    }


    div.appendChild(inputCHK);
    div.appendChild(label)

    selectRole.appendChild(div)
  });

  // Remove validation classes
  var elements = document.getElementById("userForm").querySelectorAll(".is-invalid");
  elements.forEach(function (element) {
    element.classList.remove("is-invalid");
  });


  //--------------------------------------//

  if (userPrivilege.insert_privilege) {
    btnEditUser.disabled = false;
    btnEditUser.style.cursor = "pointer";
  } else {
    btnEditUser.disabled = true;
    btnEditUser.style.cursor = "not-allowed";
  }


  btnEditUser.disabled = true;
  btnEditUser.style.cursor = "not-allowed";
  btnSubmitUser.disabled = false;
  btnSubmitUser.style.cursor = "pointer";
  // btnSubmitUser

}

// define function for password re enter
const passwordRetypeValidator = () => {
  if (textPassword.value != "") {
    if (rePassword.value == textPassword.value) {
      textPassword.classList.remove("is-invalid");
      rePassword.classList.add("is-valid");
      // textPassword.style.borderBottom = "2px solid green";
      // rePassword.style.borderBottom = "2px solid green";
      user.password = textPassword.value;
    } else {
      rePassword.classList.remove("is-valid");
      textPassword.classList.add("is-invalid");
      // textPassword.style.borderBottom = "2px solid red";
      // rePassword.style.borderBottom = "2px solid red";
      user.password = null
    }
  } else {
    alert("Please fill Password feild...!");
    // textPassword.style.borderBottom = "2px solid red";
    // rePassword.style.borderBottom = "2px solid red";
    rePassword.classList.remove("is-valid");
    textPassword.classList.add("is-invalid");
    user.password = null;
  }
}

//define function for check user form error
// const checkUserFormErrors = () => {
//   let errors = "";

//   if (user.employee_id == null) {
//     errors = errors + "Please Select Employee..!\n";
//   }

//   if (user.username == null) {
//     errors = errors + "Please Enter Valid Username..!\n";
//   }

//   if (user.password == null) {
//     errors = errors + "Please Enter Valid Password..!\n";
//   }

//   if (rePassword.value == "") { //here the password doesn't parse from backend.. this works from the above passwordRetypeValidator() function
//     errors = errors + "Please Re-Enter Password..!\n";
//   }

//   if (user.email == null) {
//     errors = errors + "Please Enter Valid Email Address..!\n";
//   }


//   return errors;
// }

//define function for submit user object
const buttonUserSumbit = () => {
  //
  console.log(user);
  // need to check form error
  let errors = checkUserFormErrors();
  if (errors == "") {
    //get user confirmation
    const userResponse = confirm("Are you sure to add following User details....?" +
      "\n User Name : " + user.username +
      "\n Email : " + user.email +
      "\n Employee : " + user.employee_id.emp_first_name);

    if (userResponse) {
      //call post service
      const userPostServiceResponse = getHTTPBodyAjaxRequest("/user", "POST", user);

      if (userPostServiceResponse == "OK") {
        alert("User form saved successfully...!");
        $('#tableuser').tab('show'); //change tab
        refreshUserTable();
        userForm.reset(); // this is an id of user form
        refreshUserForm(); // 
      } else {
        alert("User Form Has Errors...!\n" + userPostServiceResponse);
      }
    }


  } else {
    alert("User Form has Errors...!\n" + errors);
  }

}

//define funtion for generate user email automatically
const generateEmail = () => {
  //console.log(JSON.parse(selectEmployee.value).email); 
  //console.log(selectEmployee.value);  //this shows that we cant get email without parse from JSON

  emailId.value = JSON.parse(selectEmployee.value).email; //set value
  user.email = emailId.value; //bind value
  isValid([emailId]);
}

