import {useEffect , useState} from "react";
import { Link , useNavigate } from "react-router";
import api from "../api/axios";

export default function Navbar() {

    const navigate = useNavigate()
    const [cartCount , setCartCount] = useState(0)
    const userId = sessionStorage.getItem("userId")

    const loadCart = async()=>{
        try{
            if(!userId) return setCartCount(0)
            const res = await api.get(`/cart/${userId}`)
            const total = res.data.items.reduce(
                (sum ,item) => sum + item.quantity , 0 
            )
            setCartCount(total)
        }
        catch(error){
            console.error(error.message)
        }
    }

    useEffect(()=>{
        loadCart() 
    },[])

    const logout = ()=>{
        sessionStorage.clear();
        setCartCount(0)
        navigate('/login')
    }

}