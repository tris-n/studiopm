// React
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {loginUser} from '../../features/user/userSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Toastify
import {toast} from 'react-toastify'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Container, Divider, IconButton, InputAdornment, Link, Stack, TextField, Typography} from '@mui/material'

// MUI Icons
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

// React-Icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

// Components
import RandomImageBox from '../../components/RandomImageBox'
import RandomImageText from '../../components/RandomImageText'
import CustomLoadingButton from '../../components/CustomLoadingButton'
import CustomAlertBox from '../../components/CustomAlertBox'
import CustomDemoButton from '../../components/CustomDemoButton'

// Logo
import logo from '../../images/logo.png'



// LoginUser
const LoginUser = () => {

	const {user} = useSelector((state) => state.user)

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})

	const {email, password} = formData

	const [showPassword, setShowPassword] = useState(false)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {checkError} = useErrorHandling()

	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (user) {
			navigate('/dashboard')
		}
	}, [user])

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}))
	}

	const onSubmit = (e) => {
		e.preventDefault()

		setIsLoading(true)

		const userData = {
			email,
			password,
		}

		dispatch(loginUser(userData))
			.unwrap()
			.then((user) => {
				toast.success(`Logged in as ${user.name}`)
				navigate('/dashboard')
			})
			.catch((error) => {
				checkError(error)
				setIsLoading(false)
			})

	}


	// handle demo login clicks
	const onDemoLogin = (role) => {
		const studioheadConfig = JSON.parse(process.env.REACT_APP_DEMO_STUDIOHEAD)
		const producerConfig = JSON.parse(process.env.REACT_APP_DEMO_PRODUCER)
		const directorConfig = JSON.parse(process.env.REACT_APP_DEMO_DIRECTOR)
		const writerConfig = JSON.parse(process.env.REACT_APP_DEMO_WRITER)

		let userData

		if (role === "Studio Head") userData = studioheadConfig
		if (role === "Producer") userData = producerConfig
		if (role === "Director") userData = directorConfig
		if (role === "Writer") userData = writerConfig

		dispatch(loginUser(userData))
			.unwrap()
			.then((user) => {
				toast.success(`Logged in as ${user.name}`)
				navigate('/dashboard')
			})
			.catch((error) => {
				checkError(error)
				setIsLoading(false)
			})

	}

	return (
		<>
			<MetaTags title="Welcome! - Manage film projects, monitor production status, identify staffing needs, access deliverables, and streamline your workflow." />
		
			<Box sx={{ display: "flex"}}>

				<RandomImageBox fullWidth login>
					<RandomImageText>
						<Container maxWidth="laptop" sx={{pt: {mobile: 2, tablet: 0}, pb: {mobile: 2, tablet: 0}}}>

							<Stack direction="row">
								<Typography variant="h5" gutterBottom sx={{marginRight: "9px"}}>Sign In To </Typography>
								<img src={logo} alt="" height="30px" />
								<Typography variant="h5" gutterBottom sx={{marginLeft: "3px"}}><strong>Studio</strong>PM</Typography>
							</Stack>
							
							<Typography variant="body2" sx={{ mb: 3}}>
								New user? Create an <Link href="/register">account</Link>
							</Typography>

							<Box component="form" autoComplete="off" onSubmit={onSubmit}>

								<Stack spacing={3}>

									{/* Email Address */}
									<TextField id="email" name="email" type="email" value={email} onChange={onChange} label="Email address" required/>

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
									<CustomLoadingButton loading={isLoading} variant="contained" type="submit" sx={{height: "50px"}}>Login</CustomLoadingButton>

								</Stack>

							</Box>

							<Divider sx={{marginTop: "30px", opacity: "0.5"}} />

							<CustomAlertBox>

								<Stack direction="row">
									<InfoOutlinedIcon sx={{color: "rgba(2, 136, 209, 1)", fontSize: "22px", fontWeight: "400", opacity: "0.9", marginRight: "12px"}} />
									Demo application as:
								</Stack>

								<Box sx={{
									display: "flex",
									flexDirection: "row",
									gap: 1,
									paddingLeft: {laptop: 1, tablet: 0, mobile: 0},
									paddingTop: {laptop: 0, tablet: 1, mobile: 1},
									'@media (max-width: 450px)': {
										flexDirection: 'column',
									},
								}}>
									<CustomDemoButton onClick={() => onDemoLogin("Studio Head")}>Studio Head</CustomDemoButton> 
									<CustomDemoButton onClick={() => onDemoLogin("Producer")}>Producer</CustomDemoButton> 
									<CustomDemoButton onClick={() => onDemoLogin("Director")}>Director</CustomDemoButton> 
									<CustomDemoButton onClick={() => onDemoLogin("Writer")}>Writer</CustomDemoButton>
								</Box>

							</CustomAlertBox>

						</Container>

						
							
					</RandomImageText>
				</RandomImageBox>

			</Box>
		</>

	)
}



export default LoginUser