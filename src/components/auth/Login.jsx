import { Form, Formik, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import { useSignIn } from "react-auth-kit";
import axios from "axios";
import * as Yup from 'yup'
import './Login.css'
import { useNavigate } from "react-router-dom";

const Login = (props) => {
    const [error, setError] = useState("");

    const LoginSchema = Yup.object().shape({
        username: Yup.string()
          .required('Required'),
          password: Yup.string()
          .max(24, 'Invalid Password')
          .required('Required'),
      });

      const signIn = useSignIn();
      const navigate = useNavigate();

    const onSubmit = async (values) => {
        //Reset error on resubmit
        setError("");

        try {
            const response = await axios.post(
                "https://pizza-api-app.herokuapp.com/api/auth", 
                values
            );
            //If successful store token and return home
            signIn({
                token: response.data.access_token,
                expiresIn: 3600,
                authState: {username: values.username},
                tokenType: "Bearer"
            })
            navigate("/");
        } catch (err) {
            //check if we get error response from axios otherwise set generic login error message
            (err.response && err.response.data)? setError("Login Failure"): setError(err.message);
            console.log(err);
        }
    }



    return (
        <div className="login-wrap">
            <div className="login-html">
                <h1 className="login-header">Sign to Order Pizza</h1>
                <Formik className= ""
                initialValues= {{
                    username: "",
                    password: "",
                }}
                onSubmit = {values => {onSubmit(values)}}
                validationSchema={LoginSchema}
                >
                    {({ errors, touched }) => (
                <Form className="login-form">
                    <label className="label">UserName</label>
                    <ErrorMessage name="username" />
                    <Field className="input" name="username"  />
                    <label className="label">Password</label>
                    <ErrorMessage name="password" />
                    <Field className="input" name="password" type="password" />
                    <button className="button" type="submit">Submit</button>
                </Form>
            )}
                    
                </Formik>
                {/* Display Axios Error Message if received */}
                {error.length>0? <p>{error}</p>:null}
            </div>
        </div>
    )
}

export default Login;