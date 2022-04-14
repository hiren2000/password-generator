import React, {useState} from 'react';
import './PasswordForm.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import {UpperCaseLetters, LowerCaseLetters, Numbers, SpecialCharacters} from "../Characters";
import { ToastContainer, toast } from 'react-toastify';
import '../../../node_modules/react-toastify/dist/ReactToastify.css';
import PasswordStrengthBar from "react-password-strength-bar";
// import zxcvbn from 'zxcvbn';

const initialValues = {
  length: 8,
  checked_options: ["Uppercase", "Lowercase"],
}

const validationSchema = Yup.object({
  length: Yup.number()
    .required('Required')
    .positive()
    .integer()
    .min(6, "length must be minimum 6 characters")
    .max(25, "not more than 25 characters"),
  checked_options: Yup.array().min(1, 'Select at least one option').required(),
})




function PasswordForm() {
  const [password, setPassword] = useState('');

  const notify = (status) => {
    if(status === 'success') {
      toast.success('Password copied to clipboard', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
    else if(status === 'error'){
      toast.error('No value to copy', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
  }


  const onSubmit = (values) => {
    // alert(JSON.stringify(values));
    const len = values.length;
    let char = values.checked_options;
    let passwordString = '';
    for(let i = 0; i < char.length; i++) {
      if(char[i] === "Uppercase"){
        passwordString += UpperCaseLetters;
      } 
      else if(char[i] === "Lowercase"){
        passwordString += LowerCaseLetters;
      }
      else if(char[i] === "Number"){
        passwordString += Numbers;
      }
      else if(char[i] === "Special"){
        passwordString += SpecialCharacters
      }
    }
    console.log(passwordString);
    setPassword(createPassword(passwordString, len));
  }


  const createPassword = (passwordString, len) => {
    let pswd = '';
    const passwordStringLength = passwordString.length;
    for(let i = 1; i <= len; i++) {
      const passwordStringIndex = Math.floor(Math.random() * passwordStringLength)
      pswd += passwordString.charAt(passwordStringIndex);
    }
    return pswd;
  }


  const copyPasswordToClipboard = () => {
    if(password === ''){
      notify("error");
    }
    else{
      const pwd = document.getElementById("pwd");
      pwd.select();
      navigator.clipboard.writeText(pwd.value);
      notify("success");
    }
  }




  return (
    <div className="pswd-gen-form">
      <Formik 
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
      <Form>
        <div className="form-header">
          <h2>Password Generator</h2>
        </div>


        <div className="input-group mb-3">
          <input type="text" className="form-control" id="pwd" value={password} disabled/>
          <button className="btn btn-outline-secondary" type="button" id="button-addon2"
          onClick={() => copyPasswordToClipboard()}>
            {/* <i className='fa-regular fa-clipboard' /> */}
            Copy
          </button>
        </div>
        <PasswordStrengthBar className='mb-3' password={password} scoreWords={{isRequired: false}} />

        

        
        <div className="form-data">
          <div className="d-flex justify-content-between align-items-baseline">
            <span>Length</span>
            <Field
              type="number"
              name="length"
              className="form-control w-25"
            />
          </div>
          <ErrorMessage name="length">
            {
              (errorMsg) => <div className='w-100 text-left' style={{color: '#ff1c1c'}}>{errorMsg}</div>
            }
          </ErrorMessage>


          <div className="checkbox-group">
            <div className="d-flex justify-content-between align-items-baseline">
              <span>Include Uppercase Letters</span>
              <Field type="checkbox" name="checked_options" value="Uppercase" />
            </div>
            <div className="d-flex justify-content-between align-items-baseline">
              <span>Include Lowercase Letters</span>
              <Field type="checkbox" name="checked_options" value="Lowercase" />
            </div>
            <div className="d-flex justify-content-between align-items-baseline">
              <span>Include Number</span>
              <Field type="checkbox" name="checked_options" value="Number" />
            </div>
            <div className="d-flex justify-content-between align-items-baseline">
              <span>Include Special Characters</span>
              <Field type="checkbox" name="checked_options" value="Special" />
            </div>
          </div>
          <ErrorMessage name="checked_options">
            {
              (errorMsg) => <div className='w-100 text-left' style={{color: '#ff1c1c'}}>{errorMsg}</div>
            }
          </ErrorMessage>

          <button type="submit" className="btn btn-primary generate">
            Generate Password
          </button>

          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
          />


        </div>

      </Form>
    </Formik>
    </div>
  )
}

export default PasswordForm;