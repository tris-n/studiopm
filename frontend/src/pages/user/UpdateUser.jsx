// React
import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getSingleUser, updateLoggedInUser, updateUser, resetSingleUser} from '../../features/user/userSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Toastify
import {toast} from 'react-toastify'

// React Modal
import Modal from 'react-modal'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Button, Card, Container, MenuItem, Select, Stack, TextField, Typography} from '@mui/material'

// Components
import Spinner from '../../components/Spinner'
import RandomImageBox from '../../components/RandomImageBox'
import CustomLoadingButton from '../../components/CustomLoadingButton'



// UpdateUser
const UpdateUser = () => {
	
	// get single user via params
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {userId} = useParams()

	const [modalIsOpen, setIsOpen] = useState(false)
	const [deleteApproval, setDeleteApproval] = useState(false)

	const {checkError} = useErrorHandling()

	const {singleUser, isLoading, user: loggedInUser} = useSelector((state) => state.user)


	const [formData, setFormData] = useState({
		name: '',
		email: '',
		role: '',
	})

	const {name, email, role} = formData


	// get the user and populate the form with their data
	useEffect(() => {
		dispatch(getSingleUser(userId))
			.unwrap()
			.then((user) => {
				setFormData({
					name: user.name ? user.name : '',
					email: user.email ? user.email : '',
					role: user.role ? user.role : '',
				})
			})
			.catch(error => checkError(error))
	}, [userId, dispatch])

	// Checks that deleteApproval is set and then submits the form
	useEffect(() => {
		if (deleteApproval) {
			onSubmit({ preventDefault: () => {} })
		}
		setDeleteApproval(false)
	}, [deleteApproval])

	
	
	// Modal settings
	const openModal = () => {
		setIsOpen(true)
	}
	
	const closeModal = () => {
		setIsOpen(false)
	}

	const handleUpdateCrew = () => {
		setIsOpen(false)
		setDeleteApproval(true)
	}

	

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}))
	}

	const onSubmit = (e) => {
		e.preventDefault()

		// Form validation
		if (!(role === 'studio head' || role === 'producer' || role === 'director' || role === 'writer')) {
			toast.error(`Please enter a valid role`)
		} else {

			if (role !== singleUser.role && !deleteApproval) {
				setIsOpen(true)
				return
			}
				
			const userData = {
				userId,
				userUpdate: {
					name,
					email,
					role
				}
			}


			dispatch(updateUser(userData))
				.unwrap()
				.then((user) => {

					if (userId === loggedInUser._id) {
						dispatch(updateLoggedInUser())
					}

					toast.success(`Updated crew - ${user.name}`)
					navigate(`/crew/${user._id}`)

				})
				.catch(error => checkError(error))

		}
	}

	if (!singleUser || !loggedInUser) {
		return <Spinner />
	}


	return (
		<>
			<MetaTags title={`Update ${singleUser.name}`} />
		
			<Container maxWidth="laptop">

				{/* Header and Create Button */}
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{pb: 2, pt: 1.5}}>
					<Typography variant="h4" sx={{color: "white"}}>Update Crew</Typography>
				</Stack>

				{/* Create Box */}
				<Card sx={{borderRadius: "20px"}}>
					<Box sx={{ display: "flex"}}>

						<Box sx={{ width: {mobile: "100%", tablet: "50%"}, backgroundColor: "light grey", margin: "auto", pt: 3, pb: 3}}>
							<Container>

								<Box component="form" autoComplete="off" onSubmit={onSubmit} id='updateForm'>

									<Stack spacing={3}>

										{/* Name */}
										<TextField type="text" id="name" name="name" value={name} onChange={onChange} label="Full name" required />

										{/* Email Address */}
										<TextField type="email" id="email" name="email" value={email} onChange={onChange} label="Email address" required/>

										{/* Role */}
										{ singleUser.role !== 'studio head' && (
											<Select id="role" name="role" value={role} onChange={onChange} required>
												<MenuItem value={"default"} disabled>Please select a role</MenuItem>
												<MenuItem value={"director"}>Director</MenuItem>
												<MenuItem value={"producer"}>Producer</MenuItem>
												<MenuItem value={"writer"}>Writer</MenuItem>
											</Select>
										)}

										{/* Submit Button */}
										<CustomLoadingButton loading={isLoading} variant="contained" type="submit" sx={{height: "50px"}}>Update User</CustomLoadingButton>

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

			{/* Delete modal */}
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={{
					overlay: {
						zIndex: 1000,
						backgroundColor: "rgba(0,0,0,0.4)"
					},
					content: {
						backgroundColor: "#f2f4f8",
						borderRadius: "1rem",
						display: "flex",
						flexDirection: "column",
						height: "160px",
						maxWidth: "400px",
						margin: "auto",
						overflow: "hidden",
					}
				}}
			>
				<Typography sx={{mb: 2, fontWeight: "bold"}}>
					Are you sure you want to update? 
				</Typography>

				<Typography sx={{mb: 1}}>
					Updating the crew's role will remove them from all assigned projects.
				</Typography>

				
				<Stack direction="row" justifyContent="flex-end">
					<Button onClick={closeModal}>Cancel</Button>
					<Button onClick={handleUpdateCrew} color="error">Update</Button>
				</Stack>
			</Modal>
		</>
	)
}
export default UpdateUser