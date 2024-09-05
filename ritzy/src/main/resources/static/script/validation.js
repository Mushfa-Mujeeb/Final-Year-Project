//define function for validate land no field
const textValidator = (field, pattern, object, property) => {
  const regPattern = new RegExp(pattern);

  if (field.value != "") {
    if (regPattern.test(field.value)) {
      //valid
      // field.style.borderBottom = "2px solid green";

      // field.classList.remove("is-invalid");
      // field.classList.add("is-valid");

      isValid([field]);
      window[object][property] = field.value; // data binding
    } else {
      //invalid
      // field.style.borderBottom = "2px solid red";

      // field.classList.remove("is-valid");
      // field.classList.add("is-invalid");

      isInValid([field]);
      window[object][property] = null;
    }
  } else {
    //
    window[object][property] = null;
    if (field.required) {
      // field.style.borderBottom = "2px solid red";
      field.classList.remove("is-valid");
      field.classList.add("is-invalid");
    } else {
      // field.style.borderBottom = "1px solid #ced4da";
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
    }
  }
};

//define fuction for validate select dynamic element
const selectDValidator = (field, pattern, object, property) => {
  if (field.value != "") {
    //valid
    // field.style.border = "2px solid green";

    /* field.classList.remove("is-invalid");
    field.classList.remove("gradient-border");
    field.classList.add("is-valid"); */
    isValid([field]);
    window[object][property] = JSON.parse(field.value);
  } else {
    // field.style.border = "2px solid red";
    // field.classList.remove("is-valid");
    // field.classList.add("is-invalid");

    isInValid([field]);
    window[object][property] = null;
  }
};

//define fuction for validate select dynamic element
const selectSValidator = (field, pattern, object, property) => {
  if (field.value != "") {
    //valid
    // field.classList.remove("is-invalid");
    // field.classList.add("is-valid");

    isValid([field]);
    window[object][property] = field.value; // data binding
  } else {
    field.classList.remove("is-valid");
    field.classList.add("is-invalid");
    window[object][property] = null;
  }
};


//create function for checkbox feild validator
const ckeckBoxValidator = (feildId, pattern, object, property, trueValue, falseValue, labelId, labelTrueValue, labelFalseValue) => {
  
  if (feildId.checked) {
    window[object][property] = trueValue;
    labelId.innerText = labelTrueValue;
  } else {
    window[object][property] = falseValue;
    labelId.innerText = labelFalseValue;
  }
}


const isValid = (feildIdList) => {

  for (const feildId of feildIdList) {
    feildId.classList.remove("is-invalid");
    feildId.classList.remove("gradient-border");
    feildId.classList.add("is-valid");
  }
}

const isInValid = (feildIdList) => {

  for (const feildId of feildIdList) {
    feildId.classList.remove("is-valid");
    feildId.classList.remove("gradient-border");
    feildId.classList.add("is-invalid");

  }
}

//create function for date feild validator
const dateFeildValidator= (feildId, pattern, object, property) => {
  const feildValue = feildId.value;
  const regPattern = new RegExp('^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$');

  if (feildValue !== "") {
      if (regPattern.test(feildValue)) {

          // feildId.style.border = '2px solid green';
          // bind value into object property
          //console.log(window['employee']);
          isValid([feildId]);
          window[object][property] = feildValue
      } else {
          //need to bind null
          // feildId.style.border = '2px solid red';
          isInValid([feildId]);
          window[object][property] = null;
      }


  } else {
      //need to bind null
      window[object][property] = null;
      if (feildId.required) {
          isValid([feildId]);
          // feildId.style.border = '2px solid red';
      } else {
          isInValid([feildId]);
          // feildId.style.border = '2px solid green';
      }
  }
}

// valadate function for image
const validateFileField = (feildId, object, propertyOne, propertyTwo, previewId, nameFeildId) => {
  
  if(feildId.value != ""){
    let file = feildId.files[0];
    nameFeildId.value = file['name'];
    window[object][propertyTwo] = file['name'];

    let fileReader = new FileReader();

    fileReader.onload = function (e){
      previewId.src = e.target.result;
      window[object][propertyOne] = btoa(e.target.result);
    }

    fileReader.readAsDataURL(file);
    return;
  }
  
}