import {Link, useNavigate} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'
import {logout} from '../features/user/userSlice'



function Header() {

	const navigate = useNavigate()
	const dispatch = useDispatch()
	const {user} = useSelector((state) => state.user)

	const onLogout = () => {
		dispatch(logout())
		navigate('/')
	}


	return (
		<header>
			<div>
				<Link to="/"><h1>StudioPM</h1></Link>
			</div>
			<div>
				{user ? (

					<>
						<button className="btn" onClick={onLogout}>Logout</button>	
						<h4>{user.name} | {user.role}</h4>			
					</>

				) : (

					<>
						<Link to="/loginUser"><button>loginUser</button></Link>
						<Link to="/registerUser"><button>registerUser</button></Link>
					</>

				)}
			</div>
		</header>
	)
}
export default Header