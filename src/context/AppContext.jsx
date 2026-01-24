import { createContext, use, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { dummyUserData, dummyChats } from "../assets/assets";    

const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState([]);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const fetchUser = async () => {
        setUser(dummyUserData)
    }

    const fetchUserChats = async () => {
        setChats(dummyChats)
        setSelectedChat(dummyChats[0])
    }

    // useEffect(() => {
    //     if (theme === "dark") {
    //         document.documentElement.classList.add("dark");
    //     } else {
    //         document.documentElement.classList.remove("dark");
    //     }
    // }, [theme])

    useEffect(()=>{
        if(user){
            fetchUserChats()
        }
        else{
            setChats([])
            setSelectedChat(null)
        }
    },[user])

    useEffect(() => {
        fetchUser()
    }, [])
 


    const value = { user, setUser, navigate, chats, setChats, selectedChat, setSelectedChat, theme, setTheme }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext) 