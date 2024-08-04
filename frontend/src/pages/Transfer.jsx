import axios from "axios";
import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom"
export function Transfer(){
    const navigate=useNavigate();
    const location=useLocation();
    const {toUserId,firstName}=location.state;
    const amountRef=useRef(null);
    async function transferMoney(){
        try {
            await axios.post('http://localhost:5000/api/v1/account/transfer',{
                amount: amountRef.current.value,
                to:toUserId
            },{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate('/dashboard');
        } catch (error) {
            
        }
    }
    return(
        <div className="flex justify-center items-center min-h-screen bg-slate-500">
            <div className="flex flex-col border-2 bg-white border-black rounded-lg p-10">
                <div className="self-center text-3xl font-bold mb-2">Send Money</div>
                <div className="flex justify-center">
                    <div className="border rounded-full bg-slate-400 px-1.5 mr-2">{firstName[0]}</div>
                    <div>{firstName}</div>
                </div>
                <div className="flex flex-col mt-2">               
                    <label className="font-bold" htmlFor="amount">Amount in Rs.</label>
                    <input ref={amountRef} className="border-2 border-slate-300 rounded-md px-2 py-1 mb-2" type="text" id="amount" placeholder="Enter Amount"/>
                </div>
                <button className="bg-slate-700 text-white rounded-md p-2 mt-2" onClick={transferMoney}>Initiate Transfer</button>
            </div>
        </div>
    )
}