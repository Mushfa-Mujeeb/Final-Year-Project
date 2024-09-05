// browser onload event
window.addEventListener("load", () => {

  //check ths with under PrivilegeController after deleteMapping
  userPrivilege = getServiceAjaxRequest("/privilege/byloggedusermudule/DRESS_CATALOG");

  //call table refresh function
  refreshDressTable();

  //call form refresh function
  refreshDressForm();
});

const refreshDressTable = () => {
  dresses = [];
  dresses = getServiceAjaxRequest("/dress/findAll");

  const displayProperty = [
    { dataType: "text", propertyName: "dress_code" },
    { dataType: "photoarray", propertyName: "image" },
    { dataType: "text", propertyName: "dress_name" },
    // { dataType: "function", propertyName: getDressRentalPrice },
    { dataType: "amount", propertyName: "price" },
    { dataType: "function", propertyName: getDressAvailability }

  ];

  fillDataIntoTable(
    tableDress,
    dresses,
    displayProperty,
    DressFormRefill,
    printDress,
    deleteDress,
    true,
    userPrivilege
  );

  //disable delete button
  dresses.forEach((element, index) => {
    if (element.dressavailability_id.name == "Out of Stock") {
      if (userPrivilege.delete) {
        tableDress.children[1].children[index].children[6].children[1].disabled = "disabled";
      }
    }
  });

  //call jquery datatable function
  $("#tableDress").dataTable();


  tableDress_length.children[0].style.color = "white";
  tableDress_length.children[0].children[0].style.color = "black";

  tableDress_filter.children[0].style.color = "white";
  tableDress_filter.children[0].children[0].style.color = "black";
};

//function for filter dress category and dress type
const categoryAndTypeFilterByStyle = () => {

  //get dress name list 
  dresstypesbystyle = getServiceAjaxRequest("/dresstype/bystyle/" + JSON.parse(dressStyle.value).id);
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressType, "Select Dress Type", dresstypesbystyle, "name");
  dressType.disabled = false;

  //get dress style list 
  dresscategorybystyle = getServiceAjaxRequest("/dresscategory/bystyle/" + JSON.parse(dressStyle.value).id);
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressCategory, "Select Dress Category", dresscategorybystyle, "name");
  dressCategory.disabled = false;

}

//function for automatically generate dress name from DressStyle, DressCat, DressType, DressSize
const generateDressName = () => {

  if (dressStyle.value != "" && dressCategory.value != "" && dressType.value != "" && dressSize.value != "") {

    dressName.value = JSON.parse(dressStyle.value).name + " - " + JSON.parse(dressCategory.value).name + " - " + JSON.parse(dressType.value).name + " - " + JSON.parse(dressSize.value).name; //set value
    dress.dress_name = dressName.value; //bind value
    isValid([dressName]);


  }

}


// const getDressRentalPrice = (ob) => {
//   return "Rs. " + parseFloat(ob.price).toFixed(2);
// } -----> this can be used using a function without using a common function

//function refresh dress form
const refreshDressForm = () => {

  //create empty object
  dress = {};


  //get dress name list 
  dresstypes = getServiceAjaxRequest("/dresstype/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressType, "Select Dress Type", dresstypes, "name");
  dressType.disabled = true;


  //get dress style list 
  dressstyles = getServiceAjaxRequest("/dressstyle/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressStyle, "Select Dress Style", dressstyles, "name");
  dressStyle.disabled = false;

  //get dress categories list 
  dresscategories = getServiceAjaxRequest("/dresscategory/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressCategory, "Select Dress Category", dresscategories, "name");
  dressCategory.disabled = true;

  //get dress size list 
  dresssizes = getServiceAjaxRequest("/dresssize/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressSize, "Select Dress Size", dresssizes, "name");
  dressSize.disabled = false;

  //get dress condition list 
  dressconditions = getServiceAjaxRequest("/dresscondition/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressCondition, "Select Dress Condition", dressconditions, "name");

  //get dress Availibility list 
  dressavailabilities = getServiceAjaxRequest("/dressavailability/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressAvailability, "Select Dress Availibility", dressavailabilities, "name");

  //refresh dress name and dress image
  dress.image = null;
  fileDressImage.value = null;
  imgDefaultDress.src = "/image/imagePerview.jpg"
  textDressImage.value = "";



  //set default input feild styles                                             
  dressType.className = "gradient-border form-select shadow-sm";
  dressStyle.className = "gradient-border form-select shadow-sm";
  dressCategory.className = "gradient-border form-select shadow-sm";
  dressSize.className = "gradient-border form-select shadow-sm";
  dressCondition.className = "gradient-border form-select shadow-sm";
  dressAvailability.className = "gradient-border form-select shadow-sm";

  dressName.className = "gradient-border form-control shadow-sm";
  dressPrice.className = "gradient-border form-control shadow-sm";
  imgDefaultDress.className = "gradient-border form-control shadow-sm";
  textNote.className = "gradient-border form-control shadow-sm";

  // resetIntoDefault([dressType, dressStyle, dressCategory, dressSize,dressCondition, dressAvailability, dressName, dressPrice, dressImage, textNote])

  //set to default color to feilds if after refreshing for
  // Remove validation classes
  var elements = document.getElementById("DressForm").querySelectorAll(".is-invalid");
  elements.forEach(function (element) {
    element.classList.remove("is-invalid");
  });

  //--------------------------------------//

  if (userPrivilege.insert_privilege) {
    btnEditDress.disabled = false;
    btnEditDress.style.cursor = "pointer";
  } else {
    btnEditDress.disabled = true;
    btnEditDress.style.cursor = "not-allowed";
  }


  btnEditDress.disabled = true;
  btnEditDress.style.cursor = "not-allowed";
  btnSubmitDress.disabled = false;
  btnSubmitDress.style.cursor = "pointer";
  // btnSubmitDress

}

//function for refill dress form
const DressFormRefill = (ob, rowIndex) => {
  console.log("Edit");

  dress = JSON.parse(JSON.stringify(ob)); //
  olddress = JSON.parse(JSON.stringify(ob));

  //open modal
  $("#dressForm").tab("show");
  //set value into static element
  //elementid.value = ob.relevantPropertyName

  dressName.value = dress.dress_name;
  dressPrice.value = dress.price;
  //dressImage.value = dress.image;


  if (dress.note != null) textNote.value = dress.note; else textNote.value;
  //get dress name list 
  dresstypes = getServiceAjaxRequest("/dresstype/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressType, "Select Dress Type", dresstypes, "name", dress.dress_type_id.name);
  dressType.disabled = true;


  //get dress style list 
  dressstyles = getServiceAjaxRequest("/dressstyle/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressStyle, "Select Dress Style", dressstyles, "name", dress.style_id.name);
  dressStyle.disabled = true;

  //get dress categories list 
  dresscategories = getServiceAjaxRequest("/dresscategory/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressCategory, "Select Dress Category", dresscategories, "name", dress.category_id.name);
  dressCategory.disabled = true;

  //get dress size list 
  dresssizes = getServiceAjaxRequest("/dresssize/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressSize, "Select Dress Size", dresssizes, "name", dress.sizes_id.name);
  dressSize.disabled = true;

  //get dress condition list 
  dressconditions = getServiceAjaxRequest("/dresscondition/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressCondition, "Select Dress Condition", dressconditions, "name", dress.dress_condition_id.name);

  //get dress Availibility list 
  dressavailabilities = getServiceAjaxRequest("/dressavailability/findAll");
  //call filldataintoselect function(elementid, displaymessage, datelist, displayprpertyname)
  fillDataIntoSelect(dressAvailability, "Select Dress Availibility", dressavailabilities, "name", dress.dressavailability_id.name);


  //refill image
  if (dress.image == null) {
    imgDefaultDress.src = "/image/imagePerview.jpg"
    textDressImage.value = "";
  } else {
    imgDefaultDress.src = atob(dress.image);
    textDressImage.value = dress.image_name;
  }


  //----------------------------------------------//

  if (userPrivilege.update_privilege) {
    btnEditDress.disabled = false;
    btnEditDress.style.cursor = "pointer";
  } else {
    btnEditDress.disabled = true;
    btnEditDress.style.cursor = "not-allowed";
  }

  btnSubmitDress.disabled = true;
  btnEditDress.disabled = false;

  btnSubmitDress.style.cursor = "not-allowed";
  btnEditDress.style.cursor = "pointer";

}

const getDressType = (ob) => {
  return ob.dress_type_id.name;
}

const getDressStyle = (ob) => {
  return ob.style_id.name;
}
const getDressSize = (ob) => {
  return ob.sizes_id.name;
}

const getDressAvailability = (ob) => {
  if (ob.dressavailability_id.name == 'Available') {
    return '<p style="border-radius:10px " class="btn-dressavailability-Available text-center fw-bold">' + ob.dressavailability_id.name + '</p>';
  }

  if (ob.dressavailability_id.name == 'Reserved') {
    return '<p style="border-radius:10px " class="btn-dressavailability-Reserved text-center fw-bold" >' + ob.dressavailability_id.name + '</p>';
  }

  if (ob.dressavailability_id.name == 'Under - Maintenance') {
    return '<p style="border-radius:10px " class="btn-dressavailability-Under-Maintenance text-center fw-bold">' + ob.dressavailability_id.name + '</p>';
  }

  if (ob.dressavailability_id.name == 'Out of Stock') {
    return '<p style="border-radius:10px "  class="btn-dressavailability-OutofStock text-center fw-bold">' + ob.dressavailability_id.name + '</p>';
  }

}

//define function to chech form error
const checkFormError = () => {
  let errors = '';

  if (dress.style_id == null) {
    isInValid([dressType]);
    errors = errors + "Please Select Valid Dress Style ..! \n"
  }

  if (dress.category_id == null) {
    isInValid([dressStyle]);
    errors = errors + "Please Select Valid Dress Category ..! \n"
  }

  if (dress.dress_type_id == null) {
    isInValid([dressCategory]);
    errors = errors + "Please Select Valid Dress Type ..! \n"
  }

  if (dress.sizes_id == null) {
    isInValid([dressSize]);
    errors = errors + "Please Select Valid Dress Size ..! \n"
  }

  if (dress.dress_name == null) {
    isInValid([dressName]);
    errors = errors + "Please Enter Valid Dress Name ..! \n"
  }

  if (dress.price == null) {
    isInValid([dressPrice]);
    errors = errors + "Please Enter Valid Dress Price ..! \n"
  }

  if (dress.dress_condition_id == null) {
    isInValid([dressCondition]);
    errors = errors + "Please Select Valid Dress Condition ..! \n"
  }

  if (dress.dressavailability_id == null) {
    isInValid([dressAvailability]);
    errors = errors + "Please Select Valid Dress Availability ..! \n"
  }

  return errors;
}

//function for submit dress form
const buttonDressSumbit = () => {
  //
  console.log(dress);
  // need to check form error
  let errors = checkFormError();
  if (errors == "") {
    //get user confirmation
    const userResponse = confirm("Are you sure to add following Dress Details....?" +
      "\n Dress Name : " + dress.dress_name +
      "\n Dress Price : " + dress.price);

    if (userResponse) {
      //call post service
      const postServiceResponse = getHTTPBodyAjaxRequest("/dress", "POST", dress);

      if (new RegExp("^[0-9]{3}$").test(postServiceResponse)) {

        alert("Dress form saved successfully...!");
        $('#tablDress').tab('show'); //change tab
        refreshDressTable();
        DressForm.reset(); // this is an id of dress form
        refreshDressForm(); // 
      } else {
        alert("Failed to submit dress record!\n" + postServiceResponse);
      }
    }


  } else {
    alert("Dress Form has Errors...!\n" + errors);

  }

}


const checkFormUpdate = () => {
  let updates = "";

  if (dress.style_id.name != olddress.style_id.name) {
    updates = updates + "Dress Style has changed " + olddress.style_id.name + " into " + dress.style_id.name + " \n";
  }

  if (dress.category_id.name != olddress.category_id.name) {
    updates = updates + "Dress Category has changed " + olddress.category_id.name + " into " + dress.category_id.name + " \n";
  }

  if (dress.dress_type_id.name != olddress.dress_type_id.name) {
    updates = updates + "Dress Type has changed " + olddress.dress_type_id.name + " into " + dress.dress_type_id.name + " \n";
  }

  if (dress.sizes_id.name != olddress.sizes_id.name) {
    updates = updates + "Dress Size has changed " + olddress.sizes_id.name + " into " + dress.sizes_id.name + " \n";
  }

  if (dress.dress_name != olddress.dress_name) {
    updates = updates + "Dress Name has changed....! \n";
  }

  if (dress.price != olddress.price) {
    updates = updates + "Dress Price has changed " + olddress.price + " into " + dress.price + " \n";
  }

  if (dress.dress_condition_id.name != olddress.dress_condition_id.name) {
    updates = updates + "Dress Condition has changed " + olddress.dress_condition_id.name + " into " + dress.dress_condition_id.name + " \n";
  }

  if (dress.dressavailability_id.name != olddress.dressavailability_id.name) {
    updates = updates + "Dress Availability has changed " + olddress.dressavailability_id.name + " into " + dress.dressavailability_id.name + " \n";
  }



  if (dress.note != olddress.note) {
    updates = updates + "Note has changed " + olddress.note + " into " + dress.note + " \n";
  }



  if (dress.image != olddress.image) {
    updates = updates + "Dress Image has changed " + olddress.image + " into " + dress.image + " \n";
  }


  return updates;
}

//edit dress form function
const editDress = () => {
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
        $.ajax("/dress", {
          async: false,
          type: "PUT",
          contentType: "application/json",
          data: JSON.stringify(dress),
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
          $('#tablDress').tab('show'); //change tab
          refreshDressTable();//it refreshes the Employee table
          DressForm.reset(); // this is an id of dress form and it refreshs static element
          refreshDressForm(); //it refreshs dynamic behaviour

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

};

//define function for clear image
const buttonClearImage = () => {
  if (dress.image != null) {
    const userConfirm = confirm("Are you sure to reset Dress Image..?\n")
    if (userConfirm) {
      dress.image = null;
      fileDressImage.value = null;
      imgDefaultDress.src = "/image/imagePerview.jpg"
      textDressImage.value = "";
    }
  } else {
    dress.image = null;
    imgDefaultDress.src = "/image/imagePerview.jpg"
    textDressImage.value = "";
  }
}


const printDress = () => {

}


const deleteDress = (ob, rowIndex) => {
  //get user confirmation
  const userConfirm = confirm('Are you sure to Delete following Dress..? \n' +
    "\n Dress Name : " + ob.dress_name +
    "\n Dress Price : " + ob.price);

  if (userConfirm) {
    console.log(dress);
    //call delete service response
    const deleteServiceRespone = getHTTPBodyAjaxRequest('/dress', 'DELETE', ob);
    if (deleteServiceRespone == "OK") {
      alert('Dress Deleted Successfully..!');
      refreshDressTable();
    } else {
      alert('Failed delete dress : You have folllowing errors \n' + deleteServiceRespone);
    }
  } else {
    refreshDressTable();
  }
};

