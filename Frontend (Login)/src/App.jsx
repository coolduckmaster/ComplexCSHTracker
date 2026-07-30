import React from 'react'
import Login from './Login'
import { ToastContainer } from 'react-toastify'
import Home from './Home'


export const backendUrl = "http://localhost:4000"


const App = () => {
  const [token, setToken] = React.useState(localStorage.getItem('token') || "")

  React.useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
    <div>
      <ToastContainer />
        {
          token === "" ? (
            <Login setToken={setToken} />
          ) : (
            <div>
            <Home setToken={setToken}/>
            <button onClick={() => setToken("")} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" >
            Logout
            </button>
       
            </div>
          )
        }
    </div>
   
  )
}

export default App
