// React
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useDispatch} from 'react-redux'
import {createUser} from '../../features/user/userSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Toastify
import {toast} from 'react-toastify'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Card, Container, IconButton, InputAdornment, MenuItem, Select, Stack, TextField, Typography} from '@mui/material'

// MUI Icons
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

// Components
import RandomImageBox from '../../components/RandomImageBox'
import CustomLoadingButton from '../../components/CustomLoadingButton'



// CreateUser
const CreateUser = () => {

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password2: '',
		role: 'default',
	})

	const {name, email, password, role} = formData

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
			
			dispatch(createUser(userData))
				.unwrap()
				.then((user) => {
					toast.success(`Registered new crew - ${user.name}`)
					navigate(`/crew/${user._id}`)
				})
				.catch((error) => {
					checkError(error)
					setIsLoading(false)
				})

		}
	}



	return (
		<>
			<MetaTags title="Create A Crew" />
		
			<Container maxWidth="laptop">

				{/* Header and Create Button */}
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{pb: 2, pt: 1.5}}>
					<Typography variant="h4" sx={{color: "white"}}>Create A New Crew</Typography>
				</Stack>

				{/* Create Box */}
				<Card sx={{borderRadius: "20px"}}>
					<Box sx={{ display: "flex"}}>

						<Box sx={{ width: {mobile: "100%", tablet: "50%"}, backgroundColor: "light grey", margin: "auto", pt: 3, pb: 3}}>
							<Container>							

								<Box component="form" autoComplete="off" onSubmit={onSubmit}>

									<Stack spacing={3}>

										{/* Name */}
										<TextField type="text" id="name" name="name" value={name} onChange={onChange} label="Full name" required />

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
										<CustomLoadingButton loading={isLoading} variant="contained" type="submit" sx={{height: "50px"}}>Create User</CustomLoadingButton>

									</Stack>


								</Box>

							</Container>

							
								
						</Box>

						<Box sx={{display: {tablet: "contents", mobile: "none"}}}>
							<RandomImageBox fullWidth={false} />
						</Box>

					</Box>
				</Card>

			</Container>
		</>
		

		
	)
}
export default CreateUser