import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { BACKEND_URI } from "../enviroment";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type UserType = {
    name: string
    email: string
}

interface AuthContextIf {
    registerUser: (name: string, email: string, password: string) => any
    loginUser: (email: string, password: string) => any
    profileUser: (token:string) => any
    user: UserType
    setUser: React.Dispatch<React.SetStateAction<UserType>>
    logoutUser:()=>void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextIf>({
    registerUser() {
        //
    },
    loginUser() {
    },
    user: {
        email: '',
        name: ''
    },
    profileUser() { },
    setUser: function (): void { 
        //
    },
    logoutUser:()=>{},
    isLoading: false
})

export const useAuth = ()=>{
    return useContext(AuthContext)
}

export const AuthProvider = ({children}:{children:ReactNode})=>{
   
    const [user, setUser] = useState<UserType>({email:'',name:''})
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    // Check for existing token and load user profile on app start
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            profileUser(token)
        } else {
            setIsLoading(false)
        }
    }, [])

    const registerUser=async(name:string, email:string, password:string)=> {
        const response = await fetch(BACKEND_URI+"/auth/register",{
            body:JSON.stringify({
                name,
                email,
                password
            }),
            headers:{
                'Content-Type':'application/json'
            },
            method:'POST'
        }) 

        const data = await response.json()
        if(data.statusCode ===400){
            throw new Error(data.message)
        }
        return data
    }

    const loginUser = async ( email: string, password: string) => {
        const response = await fetch(BACKEND_URI + "/auth/login", {
            body: JSON.stringify({
                email,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })

        const data = await response.json()
        if (data.statusCode === 400) {
            throw new Error(data.message)
        }

        // Store token and fetch user profile
        localStorage.setItem("token", data.token)
        await profileUser(data.token)
        
        return data
    }

    const profileUser = async (token:string) => {
        try {
            const response = await fetch(BACKEND_URI + "/auth/profile", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':'Bearer '+token
                },
                method: 'GET'
            })

            const data = await response.json()

            if (data.statusCode === 400) {
                throw new Error(data.message)
            } else {
                setUser(data.user)
            }
        } catch (error: any) {
            // If profile fetch fails, remove invalid token
            localStorage.removeItem("token")
            setUser({email:'', name:''})
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logoutUser = async()=>{
        try {
            localStorage.removeItem("token");
            toast.success("Logout successful")
            setUser({
                email:'',
                name:''
            })
            navigate("/auth/login")
        } catch (error:any) {
            toast.error(error.message)
        }
    }

    return <AuthContext.Provider value={{ registerUser, loginUser, profileUser, user, setUser, logoutUser, isLoading }}>
            {children}
        </AuthContext.Provider>
}
