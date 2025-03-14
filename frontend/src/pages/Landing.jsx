import { Link } from "react-router-dom"


const Landing = () => {
    return (
        <div className='parent-container'>
            <div className='secondary-container'>
                <h2 className='text-center text-2xl my-4'>Welcome to the FinTech platform</h2>
                <div className='flex gap-4'>
                    <Link to="/login"><button className='btn-primary'>Login</button></Link>
                    <Link to="/register"><button className='btn-primary'>Register</button></Link>                  
                </div>
            </div>
        </div>
    )
}

export default Landing