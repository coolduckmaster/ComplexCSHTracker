import React from 'react'
import Onboarding from './Onboarding';
import axios from 'axios';
import { backendUrl } from './App';
import Dashboard from './Dashboard';

const Home = ({ setToken } ) => {

const [isFaded, setIsFaded] = React.useState(false)
const [showNext, setShowNext] = React.useState(false)
const [completeOnboard, setCompleteOnboard] = React.useState(false)
const [isLoading, setIsLoading] = React.useState(true)
const storedName = localStorage.getItem('userName') || 'User';

React.useEffect(() =>{
    const userId = localStorage.getItem('userId')
    const localstatus= localStorage.getItem("CompleteOnboard")

    if (localstatus === true) {
            setCompleteOnboard(true)
            setIsLoading(false);
            return
        }

    const checkonboard = async () => {
        try {
            const response = await axios.post(backendUrl + "/api/user/onboarding", {
                userId
            })
            if (response.data.completeOnboard === "true" || response.data.message === "User has already completed."){
                setCompleteOnboard(true)
                localStorage.setItem("CompleteOnboard", true)
            }
            return

        } catch (error) {
        console.log(error)
        } finally{
            setIsLoading(false)
        }
    
    

}
checkonboard()
}, [])

if (isLoading){
    return
}

if (completeOnboard === true) {
    return <Dashboard setToken={setToken} />
}

const handleClick = () =>{
    if (isFaded) return;
    setIsFaded(true);
    setTimeout(() => {
        setShowNext(true)
    }, 1000)
}

return (
    <div className = 'bg-white dark:bg-black'>
        {showNext === false  && completeOnboard === false ? (
        <div onClick={handleClick}
            className={`flex justify-center items-center min-h-screen bg-gray-100 dark:bg-black dark:text-white cursor-pointer select-none
            transition-opacity duration-1000 ease-in-out
            ${isFaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} >
            <p className = 'font-mono text-3xl' > Welcome {storedName} </p> 
        </div>
        ) : (
        <Onboarding startVisible={true}  
        
        SetOnboard={() => setCompleteOnboard(true)}/>
        
    )}
    </div>
)
}

export default Home

