import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

export const Login = (props) => {

    const [credentials, setCredentials] = useState({ email: "", password: "" })
    let history = useHistory()
    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await fetch("http://localhost:1111/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json()
        if (json.success) {
            // Save auth token and redirect
            localStorage.setItem('token', json.authToken)
            props.showAlert("Loggedin Successfully", "success")
            history.push("/")
        }
        else {
            props.showAlert("Invalid Credentials!!!", "danger")
        }
    }
    const onChange = (e) => {
        // '...value' spread operator {actual value}, [vlaue1,value2] overwrite these value  
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <div className="container my-5">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" value={credentials.email} onChange={onChange} className="form-control" name="email" id="email" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" value={credentials.password} onChange={onChange} className="form-control" name="password" id="password" />
                </div>
                <button type="submit" className="btn btn-primary"  >Submit</button>
            </form>
        </div>
    )
}
