import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const Register = () => 
{
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { first_name, last_name, email, password, password2 } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value}) // ... spreads the data inside the formData objects into seperate arguments

    const onSubmit = async e => {
        e.preventDefault();

        if(password !== password2)
        {
            console.log("Passwords don't match")
        }
        else
        {
            // const newUser = {
            //     first_name: first_name,
            //     last_name: last_name,
            //     email: email,
            //     password: password,
            // }

            // try 
            // {
            //     const config = {
            //         headers: {
            //             'Content-Type': 'application/json'
            //         }
            //     }

            //     const body = JSON.stringify(newUser); // Makes newUser with written data into JSON object

            //     const res = await axios.post('/api/users', body, config);
            //     console.log(res.data);
            // } 
            // catch (err) 
            // {
            //     console.error(err.response.data);
            // }

            console.log('Success');
        }
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Register</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="text" placeholder="First Name" name="first_name" value={first_name} onChange={e => onChange(e)} required />
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Last Name" name="last_name" value={last_name} onChange={e => onChange(e)} required />
                </div>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required/>
                    <small className="form-text">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Password" name="password" value={password} onChange={e => onChange(e)} required minLength="8"/>
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Confirm Password" name="password2" value={password2} onChange={e => onChange(e)} required minLength="8"/>
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">Already have an account? <Link to="/login">Log In</Link></p>
        </Fragment>
    )
}

export default Register;