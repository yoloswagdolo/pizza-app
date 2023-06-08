import { Form, Formik, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import { useSignIn } from "react-auth-kit";
import axios from "axios";
import * as Yup from 'yup'
import './Login.css'
import { useNavigate } from "react-router-dom";

const Login = (props) => {

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
            //check if we get error response from axios otherwise set error message
            (err.response && err.response.data)? setError(err.response.data.message): setError(err.message);
            console.log(err);
        }
    }



    return (
        <div className="login-wrap">
            <div className="login-html">
                <h1>Sign to Order Pizza</h1>
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
            </div>
        </div>

    )
}

export default Login;