import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const Login = () => 
{
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value}) // ... spreads the data inside the formData objects into seperate arguments

    const onSubmit = async e => {
        e.preventDefault();

        // if(password !== password2)
        // {
        //     console.log("Passwords don't match")
        // }
        // else
        // {
        //     // const newUser = {
        //     //     first_name: first_name,
        //     //     last_name: last_name,
        //     //     email: email,
        //     //     password: password,
        //     // }

        //     // try 
        //     // {
        //     //     const config = {
        //     //         headers: {
        //     //             'Content-Type': 'application/json'
        //     //         }
        //     //     }

        //     //     const body = JSON.stringify(newUser); // Makes newUser with written data into JSON object

        //     //     const res = await axios.post('/api/users', body, config);
        //     //     console.log(res.data);
        //     // } 
        //     // catch (err) 
        //     // {
        //     //     console.error(err.response.data);
        //     // }

        //     console.log('Success');
        // }
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Log In</h1>
            <p className="lead"><i className="fas fa-user"></i> Log Into Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required/>
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Password" name="password" value={password} onChange={e => onChange(e)} required minLength="8"/>
                </div>
                <input type="submit" className="btn btn-primary" value="Log In" />
            </form>
            <p className="my-1">Don't have an account? <Link to="/register">Register</Link></p>
        </Fragment>
    )
}

export default Login;