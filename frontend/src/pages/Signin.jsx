import { useRef } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
export function Signin(){
    const emailRef=useRef(null);
    const passwordRef=useRef(null);
    const navigate=useNavigate();
    async function signin(){
        const response=await axios.post('http://localhost:5000/api/v1/user/signin',
            {
                email:emailRef.current.value,
                password:passwordRef.current.value
            }
        )
        localStorage.setItem('token',response.data.token);
        emailRef.current.value='';
        passwordRef.current.value='';
        navigate('/dashboard');
    }
    return(
        <div className="flex justify-center items-center min-h-screen bg-slate-500">
            <div className="flex flex-col border-2 bg-white border-black rounded-lg p-10">
                <div className="self-center text-3xl font-bold mb-2">Sign In</div>
                <div>Don't have an account create one</div>
                <div className="flex flex-col mt-2">
                    <label className="font-bold" htmlFor="email">email</label>
                    <input ref={emailRef} className="border-2 border-slate-300 rounded-md px-2 py-1 mb-2" type="email" id="email" placeholder="johndoe@gmail.com"/>                
                    <label className="font-bold" htmlFor="password">password</label>
                    <input ref={passwordRef} className="border-2 border-slate-300 rounded-md px-2 py-1 mb-2" type="password" id="password" placeholder="secret"/>
                </div>
                <button className="bg-slate-700 text-white rounded-md p-2 mt-2" onClick={signin}>Sign In</button>
                <div className="flex">
                    <div className="mr-2">Already have an account</div>
                    <div 
                        className="hover:cursor-pointer hover:text-red-500 font-medium"
                        onClick={()=>{navigate('/signup')}}>Login
                    </div>
                </div>
            </div>
        </div>
    )
}