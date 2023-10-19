// React
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useDispatch} from 'react-redux'
import {registerUser, loginUser} from '../../features/user/userSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Toastify
import {toast} from 'react-toastify'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Container, IconButton, InputAdornment, Link, MenuItem, Select, Stack, TextField, Typography} from '@mui/material'

// MUI Icons
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

// Components
import RandomImageBox from '../../components/RandomImageBox'
import RandomImageText from '../../components/RandomImageText'
import CustomLoadingButton from '../../components/CustomLoadingButton'

// Logo
import logo from '../../images/logo.png'

// Custom Style
const CustomStackBox = ({children}) => {

	const style = {
		display: "flex",
		flexDirection: 'row',
		alignItems: 'center',
		'@media (max-width: 400px)': {
			flexDirection: 'column',
		},
	}

	return(
		<Box sx={style}>{children}</Box>
	)
}



// RegisterUser
const RegisterUser = () => {

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password2: '',
		role: 'default',
	})

	const {name, email, password, password2, role} = formData

	const [showPassword, setShowPassword] = useState(false)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {checkError} = useErrorHandling()

	const [isLoading, setIsLoading] = useState(false)


	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}))
	}

	const onSubmit = (e) => {
		e.preventDefault()

		setIsLoading(true)

		// Form validation
		if (!(role === 'studio head' || role === 'producer' || role === 'director' || role === 'writer')) {
			toast.error(`Please enter a valid role`)
			setIsLoading(false)
		} else {

			const userData = {
				name,
				email,
				password,
				role
			}
			
			dispatch(registerUser(userData))
				.unwrap()
				.then((user) => {

					// if successful, log them in
					const userLoginData = {
						email: userData.email,
						password: userData.password
					}
					
					dispatch(loginUser(userLoginData))
						.unwrap()
						.then((user) => {
							toast.success(`Welcome to StudioPM ${user.name}!`)
							navigate('/dashboard')
						})
						.catch((error) => {
							checkError(error)
							setIsLoading(false)
						})
				})
				.catch((error) => {
					checkError(error)
					setIsLoading(false)
				})

		}
	}



	return (
		<>
			<MetaTags title="Register - Manage film projects, monitor production status, identify staffing needs, access deliverables, and streamline your workflow." />
		
			<Box sx={{ display: "flex"}}>

				<RandomImageBox fullWidth login>

					<RandomImageText>
						<Container maxWidth="laptop" sx={{pt: {mobile: 2, tablet: 0}, pb: {mobile: 2, tablet: 2}}}>
							<CustomStackBox>
								<Typography variant="h5" gutterBottom sx={{marginRight: "9px"}}>Get Started With</Typography>
								<Stack direction="row">
									<img src={logo} alt="" height="30px" width="17px" />
									<Typography variant="h5" gutterBottom sx={{marginLeft: "3px"}}><strong>Studio</strong>PM</Typography>
								</Stack>
							</CustomStackBox>
							<CustomStackBox>
								<Typography variant="body2" sx={{ mb: 3}}>
									Already have an account? <Link href="/loginUser">Sign in</Link>
								</Typography>
							</CustomStackBox>
							

							<Box component="form" autoComplete="off" onSubmit={onSubmit}>

								<Stack spacing={3}>

									{/* Name */}
									<TextField type="text" id="name" name="name" value={name} onChange={onChange} label="Your name" required />

									{/* Email Address */}
									<TextField type="email" id="email" name="email" value={email} onChange={onChange} label="Email address" required/>

									{/* Role */}
									<Select id="role" name="role" value={role} onChange={onChange} required>
										<MenuItem value={"default"} disabled>Please select a role</MenuItem>
										<MenuItem value={"studio head"}>Studio Head</MenuItem>
										<MenuItem value={"director"}>Director</MenuItem>
										<MenuItem value={"producer"}>Producer</MenuItem>
										<MenuItem value={"writer"}>Writer</MenuItem>
									</Select>

									{/* Password */}
									<TextField 
										id="password" 
										name="password" 
										type={showPassword ? 'text' : 'password'} 
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
														{showPassword ? <Visibility /> : <VisibilityOff />}
													</IconButton>
												</InputAdornment>
											),
										}}
										value={password} 
										onChange={onChange} 
										label="Password" 
										required
									/>

									{/* Submit Button */}
									<CustomLoadingButton loading={isLoading} variant="contained" type="submit" sx={{height: "50px"}}>Create Account</CustomLoadingButton>

								</Stack>


							</Box>

						</Container>

						
							
					</RandomImageText>
				</RandomImageBox>

			</Box>
		</>

	)
}
export default RegisterUser