import React,{useState} from 'react';
import { useHistory } from 'react-router-dom';

export const Signup = (props) => {
    const [credentials, setCredentials] = useState({name:"",email:"",password:"",cpassword:""})
    let history = useHistory()
    const handleSubmit =async (e)=>{
        e.preventDefault()
        const {name,email,password} = credentials;
        const response = await fetch("http://localhost:1111/api/auth/createUser", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },body: JSON.stringify({name,email,password})
          });
            const json = await response.json()
            console.log(json)
            if(json.success){
              // Save auth token and redirect
            localStorage.setItem('token',json.authtoken)
            props.showAlert("Account Created Successfully","success")
            history.push("/")}
            else{
                props.showAlert("Invalid Credentials","danger")
            }

    }
    const onChange = (e)=>{
        // '...value' spread operator {actual value}, [vlaue1,value2] overwrite these value  
        setCredentials({...credentials,[e.target.name] : e.target.value})}

    return (
        <div className='container my-5' onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input type="text" className="form-control" name="name" required id="name" onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="email"  className="form-label">Email address</label>
                    <input type="email" className="form-control" name="email" id="email" onChange={onChange} aria-describedby="emailHelp"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password"  className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" minLength={5} required onChange={onChange} id="password"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword"  className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" name="cpassword" minLength={5} required onChange={onChange} id="cpassword"/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
