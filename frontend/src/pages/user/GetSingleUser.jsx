// React
import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getSingleUser, deleteUser, resetSingleUser} from '../../features/user/userSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Toastify
import {toast} from 'react-toastify'

// React Modal
import Modal from 'react-modal'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Avatar, Button, Container, ListItem, Stack, Typography} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import TimerIcon from '@mui/icons-material/Timer'
import MovieIcon from '@mui/icons-material/Movie'
import useBreakpoints from '../../theme/useBreakpoints'

// Components
import Spinner from '../../components/Spinner'
import CustomButton from '../../components/CustomButton'
import CustomChip from '../../components/CustomChip'
import SingleUserTable from './getSingleUser/SingleUserTable'
import StudioHeadTable from './getSingleUser/StudioHeadTable'



// GetAllUsers
const GetSingleUser = () => {

	const {singleUser, user} = useSelector((state) => state.user)

	const [isLoading, setIsLoading] = useState(true)

	const [modalIsOpen, setIsOpen] = useState(false)


	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { userId } = useParams()

	const {checkError} = useErrorHandling()

	const {isMobile, isTablet, isLaptop, isDesktop} = useBreakpoints()

	useEffect(() => {

		if (!singleUser || userId !== singleUser._id) {

			// fetchData
			const fetchData = async () => {

				setIsLoading(true)
				
				await dispatch(getSingleUser(userId))
					.unwrap()
					.catch(error => checkError(error))
				
				setIsLoading(false)

			}

			fetchData()

		} else {

			setIsLoading(false)

			// updateData
			const updateData = async () => {
		
				await dispatch(getSingleUser(userId))
					.unwrap()
					.catch(error => checkError(error))
					
			}
	
			updateData()
		}

	}, [userId, dispatch])


	const handleEditUser = () => {
		navigate(`/crew/update/${userId}`)
	}

	const handleDeleteUser = () => {

		dispatch(deleteUser(userId))
			.unwrap()
			.then(() => {
				toast.success(`Successfully deleted crew.`)
				dispatch(resetSingleUser())
			})
			.catch(error => checkError(error))

		navigate(`/crew/`)
			
	}

	// Modal settings
	const openModal = () => {
		setIsOpen(true)
	}
	
	const closeModal = () => {
		setIsOpen(false)
	}


	if (isLoading) {
		return <Spinner />
	}


	return (
		<>
			<MetaTags title={`${singleUser.name}`} />

			<Container maxWidth="laptop">

				{/* <Grid container spacing={0}> */}
				<Grid container spacing={0} sx={{maxWidth: `calc(100vw - 32px)`}}>

					{/* Top Row */}

					{/* User Name */}
					<Grid mobile={7}>

							<Stack direction="row" alignItems="center">
								<Avatar src={`/images/avatars/${singleUser.name.slice(0,1).toLowerCase()}.png`} alt="" sx={{mr: 2, height: 50, width: 50}}/>
								
								<Typography variant="h4" sx={{color: "white"}}>{singleUser.name}</Typography>
							</Stack>

					</Grid>

					{/* Edit buttons */}
					<Grid mobile={12} tablet={5} sx={{backgroundColor: "", pl: {mobile: 0, tablet: 4}}}>

						<Stack direction={{mobile: "column", tablet: "row"}} alignItems={{mobile: "flex-start", tablet: "center"}} justifyContent="flex-end" flexDirection={user.role !== 'studio head' && 'row-reverse'} sx={{backgroundColor: ""}}>

								{/* Edit User */}
								<ListItem sx={{width: "200px", pl: 0, pr: `${user.role === 'studio head' ? 2 : 0}`}}>

									<CustomButton labelName="Update Crew" onClick={handleEditUser} />

								</ListItem>

								{/* Delete User */}
								{ user.role === 'studio head' && (
									<ListItem sx={{width: "200px", pl: 2, pr: 0, ml: {mobile: -2, tablet: "initial"}}}>
										<CustomButton labelName="Delete Crew" deletion={true} onClick={openModal} />
									</ListItem>
								)}
								
							</Stack>

					</Grid>

					{/* Bottom Row */}

					{/* Left Column - Trailer / Details / Staff */}
					<Grid mobile={12} sx={{backgroundColor: "", pt: 0}}>

						{/* Project Details Row */}
						<Stack direction={{tablet: "row", mobile: "column"}} alignItems={{tablet: "center", mobile: "flex-start"}} spacing={2} sx={{mb: 3, mt: 2}}>
							{/* Status */}
							<CustomChip label={`Role: ${singleUser.role.charAt(0).toUpperCase() + singleUser.role.slice(1)}`} color="default" variant="" icon={<SupervisedUserCircleIcon sx={{color: "#aabbcc !important"}} />} />

							{ singleUser.role === 'studio head' ? (
								<CustomChip label={`Projects Managing: ${singleUser.projectsCount}`} color="default" variant="" icon={<MovieIcon sx={{color: "#aabbcc !important"}} />} />
							):(
								<>
									<CustomChip label={`Projects Assigned: ${singleUser.projectsCount}`} color="default" variant="" icon={<MovieIcon sx={{color: "#aabbcc !important"}} />} />
									<CustomChip label={`Deliverables Needed: ${singleUser.deliverablesNeeded}`} color="default" variant="" icon={<TimerIcon sx={{color: "#aabbcc !important"}} />} />
								</>
							)}

						</Stack>


						{/* Single User Table */}
						{ singleUser.projectsCount > 0 && singleUser.role === 'studio head' && <StudioHeadTable projects={singleUser.projects} deliverableType={singleUser.deliverableType} />}
						{ singleUser.projectsCount > 0 && singleUser.role !== 'studio head' && <SingleUserTable projects={singleUser.projects} deliverableType={singleUser.deliverableType} />}
						{ singleUser.projectsCount === 0 && singleUser.role !== 'studio head' && <Typography sx={{color: "white"}}>Not assigned to any projects.</Typography>}
						
					</Grid>

					

				</Grid>

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
						height: "110px",
						maxWidth: "400px",
						margin: "auto",
						overflow: "hidden",
					}
				}}
			>
				<Typography sx={{mb: 2, fontWeight: "bold"}}>
					Are you sure you want to delete? 
				</Typography>
				
				<Stack direction="row" justifyContent="flex-end">
					<Button onClick={closeModal}>Cancel</Button>
					<Button onClick={handleDeleteUser} color="error">Delete</Button>
				</Stack>
			</Modal>
		</>
	)
}
export default GetSingleUser