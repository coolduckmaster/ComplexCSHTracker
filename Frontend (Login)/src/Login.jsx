import React from 'react'
import axios from 'axios'
import { backendUrl } from './App'
import { toast } from 'react-toastify'



const Login = ({ setToken }) => {
    const [currentState, setCurrentState] = React.useState('Login')
    const [name, setName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [grade, setGrade] = React.useState("")



    const formHandler = async (event) => {
        event.preventDefault()
        try {
            if (currentState === 'Sign Up') {
                const response = await axios.post(backendUrl + '/api/user/register', {name, email, password})
                if (response.data.success) {
                    setToken(response.data.token)
                    toast.success('Account created successfully!')
                    localStorage.setItem('userId', response.data.userId);
                    localStorage.setItem('userName', response.data.fetchname);
                } else if (response.data.message === "User already exists") {
                    toast.error('User already exists. Please login instead.')
                } else if (response.data.message === "Invalid email") {
                    toast.error('Invalid email. Please enter a valid email address.')
                } else if (response.data.message === "Password must be at least 8 characters long") {
                    toast.error('Password must be at least 8 characters long.')
                } else {
                    toast.error('An error occurred during registration. Please try again.')
                }

            } else {
                const response = await axios.post(backendUrl + '/api/user/login', {email, password})
                if (response.data.success) {
                    setToken(response.data.token)
                    toast.success('Logged in successfully!')
                    localStorage.setItem('userId', response.data.userId);
                    localStorage.setItem('userName', response.data.fetchname);

                } else if (response.data.message === "User does not exist") {
                    toast.error('User does not exist. Please sign up first.')
                } else {
                    toast.error('Invalid email or password. Please try again.')
                }
            }
        } catch (error) {
            console.error('Error during authentication:', error)
            toast.error(error.message)
        }
    }
        return (
            <div className='flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black dark:text-white'>
                <form onSubmit={formHandler} className='w-full max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg space-y-6 dark:bg-mist-950 dark:text-white'>
                <div className='text-center'>
                    <p className='text-2xl font-semibold text-gray-800 dark:text-white'>{currentState}</p>
                </div>
                {currentState === 'Login' ? null : (
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nickname/Name" required className='w-full px-4 py-3 border border-gray-300 rounded-md not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500' />  
                )}
                <input type="email" placeholder="Email" value= {email} onChange={(e) => setEmail(e.target.value)} required className='w-full px-4 py-3 border border-gray-300 rounded-md dark:text-white  not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500'/>
                <input type="password" placeholder="Password" value= {password} onChange={(e) => setPassword(e.target.value)} required className='w-full px-4 py-3 border border-gray-300 rounded-md not-dark:focus:outline-none not-dark:focus:ring-2 not-dark:focus:ring-blue-500'/>
                <div className='flex justify-between text-sm text-blue-600 dark:text-blue-400'>
                    <p className='cursor-pointer hover:underline'>Forgot password</p>
                    {currentState === 'Login' ? (
                        <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer hover:underline'>
                            Create account
                        </p>
                    ) : (
                        <p onClick={() => setCurrentState('Login')} className='cursor-pointer hover:underline'>
                            Already have an account? Login
                        </p>
                    )}
                </div>
                    <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-300'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
                </form>
            </div>
                )
            }

export default Login 

