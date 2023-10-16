// React
import {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getSingleProject, deleteProject, resetSingleProject} from '../../features/project/projectSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Toastify
import {toast} from 'react-toastify'

// React Modal
import Modal from 'react-modal'

// DayJS
import dayjs from 'dayjs'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Button, Container, ListItem, ListItemText, Stack, Typography} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import CachedIcon from '@mui/icons-material/Cached'
import ScheduleIcon from '@mui/icons-material/Schedule'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import useBreakpoints from '../../theme/useBreakpoints'

// Components
import Spinner from '../../components/Spinner'
import CustomAssignButton from '../../components/CustomAssignButton'
import CustomButton from '../../components/CustomButton'
import CustomChip from '../../components/CustomChip'
import DownloadButton from '../../components/DownloadButton'
import StaffTable from './getSingleProject/StaffTable'



// GetSingleProject
const GetSingleProject = () => {

	const {singleProject} = useSelector((state) => state.projects)
	const {user} = useSelector((state) => state.user)

	const [isLoading, setIsLoading] = useState(true)

	const [modalIsOpen, setIsOpen] = useState(false)

	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { projectId } = useParams()

	const {checkError} = useErrorHandling()

	const {isMobile, isTablet, isLaptop, isDesktop} = useBreakpoints()

	const handleEditProject = () => {
		navigate(`/projects/update/${projectId}`)
	}

	const handleDeleteProject = () => {	
		
		dispatch(deleteProject(projectId))
			.unwrap()
			.then(() => {
				toast.success(`Successfully deleted the project.`)
				dispatch(resetSingleProject())
			})
			.catch(error => checkError(error))

		navigate(`/projects/`)

	}

	// Modal settings
	const openModal = () => {
		setIsOpen(true)
	}
	
	const closeModal = () => {
		setIsOpen(false)
	}

	const handleScriptDownload = () => {
		window.open(singleProject.script.url, '_blank')
	}


	useEffect(() => {

		// if there is no data, fetch it
		// if there are no tickets, no singleproject
		// or if singleproject id does not equal the params
		if (!singleProject || projectId !== singleProject._id) {

			// fetchData
			const fetchData = async () => {

				setIsLoading(true)

				await dispatch(getSingleProject(projectId))
					.unwrap()
					.catch(error => checkError(error))
				
				setIsLoading(false)

			}

			fetchData()

		// else, update the data in the background
		} else {

			setIsLoading(false)

			// updateData
			const updateData = async () => {

				await dispatch(getSingleProject(projectId))
					.unwrap()
					.catch(error => checkError(error))

			}

			updateData()
		}
			
	}, [projectId, dispatch])


	if (isLoading) {
		return <Spinner />
	}


	return (
		<>
			<MetaTags title={`${singleProject.title}`} />
		
			<Container maxWidth="laptop">

				<Grid container spacing={0} sx={{maxWidth: `calc(100vw - 32px)`}}>

					{/* Top Row */}

					{/* Project Title */}
					<Grid mobile={12} tablet={7}>

						<Typography variant="h4" sx={{color: "white", position: "relative", top: {mobile: "-10px", tablet: "10px"}}}>{singleProject.title}</Typography>

					</Grid>
					
					{/* Edit buttons */}
					<Grid mobile={12} tablet={5} sx={{backgroundColor: "", pl: {mobile: 0, tablet: 4}}}>

							<Stack direction={{mobile: "column", tablet: "row"}} alignItems={{mobile: "flex-start", tablet: "center"}} justifyContent="flex-end" flexDirection={user.role !== 'studio head' && 'row-reverse'} sx={{backgroundColor: ""}}>

								{/* Edit Project */}
								<ListItem sx={{width: "200px", pl: 0, pr: `${user.role === 'studio head' ? 2 : 0}`}}>

									{ (user.role === 'studio head' || user.role === 'producer') && (
										<CustomButton labelName="Update Project" onClick={handleEditProject} />
									)}

								</ListItem>

								{/* Delete Project */}
								{ user.role === 'studio head' && (
									<ListItem sx={{width: "200px", pl: 2, pr: 0, ml: {mobile: -2, tablet: "initial"}}}>
										<CustomButton labelName="Delete Project" deletion={true} onClick={openModal} />
									</ListItem>
								)}
								
							</Stack>

					</Grid>



					{/* Bottom Row */}

					{/* Left Column - Trailer / Details / Staff */}
					<Grid mobile={12} tablet={7} sx={{backgroundColor: "", pt: 2}}>

						{/* Youtube Trailer */}
						{singleProject.trailer ? (
							<iframe width="100%" height="390" src={`https://www.youtube-nocookie.com/embed/${singleProject.trailer.slice(-11)}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
						) : (
				
							<ListItem sx={{pl: 0, pr: 0}}>

								{(user.role === "studio head" || user.role === 'director') ? (
									<CustomAssignButton labelName="Assign Trailer" add={true} disabled={false} type="trailer" onClick={handleEditProject} />
								):(
									<CustomAssignButton labelName="Trailer Needed" add={false} disabled={true} type="trailer" />
								)}
								

							</ListItem>
						)}

						{/* Project Details Row */}
						<Stack direction={{tablet: "row", mobile: "column"}} alignItems={{tablet: "center", mobile: "flex-start"}} justifyContent="space-between" spacing={2} sx={{mb: 3, mt: 2}}>
							{/* Status */}
							<CustomChip label={`Status: ${singleProject.status}`} icon={<CachedIcon sx={{color: "#aabbcc !important"}} />} />
							<CustomChip label={`Release: ${dayjs(new Date(singleProject?.releaseDate).toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('YYYY-MM-DD')}`} icon={<ScheduleIcon sx={{color: "#aabbcc !important"}} />} />
							<CustomChip label={`Budget: ${(singleProject.budget/1000000).toFixed(1)}m`} icon={<PaidOutlinedIcon sx={{color: "#aabbcc !important"}} />} />
						</Stack>

						{/* Staff Table */}
						<StaffTable 
							director={singleProject.director} 
							producer={singleProject.producer} 
							writer={singleProject.writer} 
						/>
						
					</Grid>


					
					{/* Right Column - Poster / Script */}
					<Grid mobile={12} tablet={5} sx={{backgroundColor: "", pl: {mobile: 0, tablet: 4}, pt: 2}}>

						{/* Project Poster */}
						{ singleProject.poster ? (
							<img src={singleProject.poster.url} alt="" width="100%" height="auto" />
						) : (
							<ListItem sx={{pl: 0, pr: 0}}>

								{(user.role === "studio head" || user.role === 'producer') ? (
									<CustomAssignButton labelName="Assign Poster" add={true} disabled={false} type="poster" onClick={handleEditProject} />
								):(
									<CustomAssignButton labelName="Poster Needed" add={false} disabled={true} type="poster" />
								)}

							</ListItem>
						)}

						{/* Script Download */}
						{ singleProject.script ? (
							<ListItem sx={{pl: 0, pr: 0}}>

								<DownloadButton selected variant="contained" onClick={handleScriptDownload}>
									<Stack direction="row" alignItems="center" justifyContent="center" sx={{margin: "auto"}}>
										<CloudDownloadIcon sx={{ml: -1.25, mr: 1}} />
										<ListItemText>{singleProject.script.name}</ListItemText>
									</Stack>
								</DownloadButton>

							</ListItem>

						) : (
							<ListItem sx={{pl: 0, pr: 0}}>

								{(user.role === "studio head" || user.role === 'writer') ? (
									<CustomAssignButton labelName="Assign Script" add={true} disabled={false} type="script" onClick={handleEditProject} />
								):(
									<CustomAssignButton labelName="Script Needed" add={false} disabled={true} type="script" />
								)}

							</ListItem>
						)}

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
					<Button onClick={handleDeleteProject} color="error">Delete</Button>
				</Stack>
			</Modal>
		</>

	)
}
export default GetSingleProject