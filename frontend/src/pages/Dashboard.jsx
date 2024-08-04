import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export function Dashboard(){
    const navigate=useNavigate();
    const [users,setUsers]=useState([]);
    const [filter,setFilter]=useState('');
    useEffect(()=>{
        axios.get(`http://localhost:5000/api/v1/user/bulk/?filter=${filter}`,{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        }).then((response)=>setUsers(response.data.user));
    },[filter])
    return(
        <div className="h-screen bg-slate-200">
            <div className="flex items-center justify-center bg-slate-300 border border-slate-400 px-2 py-4">
                <div className="ml-6">SwiftPay</div>
                <div className="ml-auto mr-2">Hi</div>
                <button className="w-10 h-10 border bg-slate-400 rounded-full">U</button>
            </div>
            <div className="w-full py-4 px-32">
                <input className="border border-black rounded-md w-full p-1" type="text" name="" id="" placeholder="search" onChange={(e)=>(setFilter(e.target.value))}/>
            </div>
            {users.map(user=>{
                return (
                <div className="flex justify-between border bg-white border-black rounded-xl p-6 mx-32 my-2" key={user._id}>
                    <div className="flex items-center">
                        <div className="w-8 h-8 flex items-center justify-center bg-slate-400 border rounded-full mr-2">{user.firstName[0]}</div>
                        <div>{user.firstName} {user.lastName}</div>
                    </div>
                    <button className="border border-black p-2 rounded-lg text-white bg-slate-900" onClick={()=>navigate('/Transfer',{state:{toUserId:user._id,firstName:user.firstName}})}>Send Money</button>
                </div>
                )
            })}
        </div>
    )
}