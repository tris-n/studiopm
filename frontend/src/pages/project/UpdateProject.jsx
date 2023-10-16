// React
import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getSingleProject, updateProject} from '../../features/project/projectSlice'
import {getAllUsers} from '../../features/user/userSlice'

// Firebase
import {getAuth} from 'firebase/auth'
import {getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject} from 'firebase/storage'
import {addDoc, collection, serverTimestamp} from 'firebase/firestore'
import {db} from '../../firebase.config'
import {v4 as uuidv4} from 'uuid'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Toastify
import {toast} from 'react-toastify'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Card, Container, FormControl, InputLabel, ListItem, ListItemButton, ListItemText, MenuItem, Select, Stack, TextField, Typography} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { styled } from '@mui/material/styles'

// Date Picker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

// Components
import Spinner from '../../components/Spinner'
import RandomImageBox from '../../components/RandomImageBox'
import CustomLoadingButton from '../../components/CustomLoadingButton'

// Custom Styles
const NewUserButton = styled(ListItemButton)({
	borderRadius: "10px", 
	display: "flex",
})



// UpdateProject
const UpdateProject = () => {
	
	// get single user via params
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const {projectId} = useParams()

	const {checkError} = useErrorHandling()

	const [isLoading, setIsLoading] = useState(false)

	const {singleProject} = useSelector(state => state.projects)
	const {allUsers, user} = useSelector((state) => state.user)

	const [disableCheck, setDisableCheck] = useState({
		general: true,
		poster: true,
		script: true,
		trailer: true
	})


	const [formData, setFormData] = useState({
		title: '',
		releaseDate: null,
		status: 'Planned',
		budget: '',
		director: 'default',
		writer: 'default',
		producer: 'default',
		poster: '',
		script: '',
		trailer: '',
	})

	const {
		title, 
		releaseDate, 
		status, 
		budget, 
		director, 
		writer,
		producer,
		poster,
		script,
		trailer,
	} = formData


	// chosenPoster
	const [chosenPoster, setChosenPoster] = useState({
		posterName: null,
		posterFile: null,
	})
	const {posterName, posterFile} = chosenPoster
	
	// chosenScript
	const [chosenScript, setChosenScript] = useState({
		scriptName: null,
		scriptFile: null,
	})
	const {scriptName, scriptFile} = chosenScript

	// Add auth to metadata
	const metadata = {
		customMetadata: {'authenticated': true}
	}


	// get all the users, so that the select drop down can have its values
	// get the project and populate the form with its data
	useEffect(() => {
		dispatch(getAllUsers())
		dispatch(getSingleProject(projectId))
			.unwrap()
			.then((project) => {

				// set posterName
				if (project.poster) {
					setChosenPoster((prevState) => ({
						...prevState,
						posterName: project.poster.name,
					}))				
				}
				// set scriptName
				if (project.script) {
					setChosenScript((prevState) => ({
						...prevState,
						scriptName: project.script.name,
					}))				
				}

				setFormData({
					title: project.title,
					releaseDate: dayjs(project.releaseDate),
					status: project.status,
					budget: project.budget,
					director: project.director ? project.director._id : 'default',
					writer: project.writer ? project.writer._id : 'default',
					producer: project.producer ? project.producer._id : 'default',
					poster: project.poster ? project.poster : '',
					script: project.script ? project.script : '',
					trailer: project.trailer ? project.trailer : '',
				})

			})
			.catch(error => checkError(error))
	}, [projectId, dispatch])

	// check where to disable form elements
	useEffect(() => {

		if (user.role === 'studio head') setDisableCheck({
			...disableCheck, 
			general: false,
			poster: false,
			script: false,
			trailer: false,
		})

		if (user.role === 'producer') setDisableCheck({
			...disableCheck, 
			general: false,
			poster: false,
			script: true,
			trailer: true,
		})

		if (user.role === 'director') setDisableCheck({
			...disableCheck, 
			general: true,
			poster: true,
			script: true,
			trailer: false,
		})

		if (user.role === 'writer') setDisableCheck({
			...disableCheck, 
			general: true,
			poster: true,
			script: false,
			trailer: true,
		})

	}, [user])

	

	const onChange = (e) => {

		// if its a poster, set the name and posterFile
		if (e.target.name === 'poster') {

			setChosenPoster((prevState) => ({
				...prevState,
				posterName: e.target.files[0].name,
				posterFile: e.target.files[0],
			}))
		
		// if its a script, set the name and file
		} else if (e.target.name === 'script') {
			
			setChosenScript((prevState) => ({
				...prevState,
				scriptName: e.target.files[0].name,
				scriptFile: e.target.files[0],
			}))

		} else {

			setFormData((prevState) => ({
				...prevState,
				[e.target.name]: e.target.value,
			}))

		}
	}



	const handleDatePicker = (newValue) => {
		setFormData((prevState) => ({
			...prevState,
			releaseDate: dayjs(newValue)
		}))
	}



	const onSubmit = async (e) => {
		e.preventDefault()

		setIsLoading(true)

		// get formData
		let projectData = {...formData}

		// Function to store a single file in firebase
		const storeFile = async (file) => {

			return new Promise((resolve, reject) => {

				const storage = getStorage()
				
				const fileName = `${projectId}-${uuidv4()}-${file.name}`
				const storageRef = ref(storage, 'files/' + fileName)

				const uploadTask = uploadBytesResumable(storageRef, file, metadata)

				uploadTask.on(
					'state_changed',
					(snapshot) => {
						const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
						
						// console.log('Upload is ' + progress + '% done')

						switch (snapshot.state) {
							case 'paused':
								console.log('Upload is paused')
								break
							case 'running':
								console.log('Upload is running')
								break
							default:
								break
						}
					},
					(error) => {
						reject(error)
					},
					() => {
					// Handle successful uploads on complete
					// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							resolve({name: file.name, url: downloadURL})
						})
					}
				)

			})
		}



		// add posterUrl and scriptUrl to formData
		// Map through chosen files, save them to firebase using storeFile()
		// Returns an array with the files download Url
		if (posterFile) {
			const posterUrl = await storeFile(posterFile)
			projectData.poster = posterUrl
		}
		if (scriptFile) {
			const scriptUrl = await storeFile(scriptFile)
			projectData.script = scriptUrl
		}

		// if the field is empty, delete
		for (const field in projectData) {
			if (!projectData[field] || projectData[field] === 'default') {
				delete projectData[field]
			}
		}

		// insert projectId into object
		let projectUpdate = {
			projectId,
			update: projectData,
		}

		dispatch(updateProject(projectUpdate))
			.unwrap()
			.then((project) => {
				toast.success(`Updated project - ${project.title}`)
				navigate(`/projects/${project._id}`)
			})
			.catch(error => checkError(error))

	}




	if (!singleProject || !allUsers || !user) {
		return <Spinner />
	}

	

	return (
		<>
			<MetaTags title={`Update ${singleProject.title}`} />
		
			<Container maxWidth="laptop">

				{/* Header and Create Button */}
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{pb: 2, pt: 1.5}}>
					<Typography variant="h4" sx={{color: "white"}}>Update Project</Typography>
				</Stack>

				{/* Create Box */}
				<Card sx={{borderRadius: "20px"}}>
					<Box sx={{ display: "flex"}}>

						<Box sx={{ width: {mobile: "100%", tablet: "50%"}, backgroundColor: "light grey", margin: "auto", pt: 3, pb: 3}}>
							<Container>

								<Box component="form" autoComplete="off" onSubmit={onSubmit}>

									<Stack spacing={3}>

										{/* Title */}
										<TextField type="text" id="title" name="title" value={title} onChange={onChange} label="Title" required disabled={disableCheck.general} />

										{/* Release Date */}
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DatePicker
												label="Release Date"
												value={dayjs(releaseDate)}
												name="releaseDate"
												disabled={disableCheck.general}
												onChange={handleDatePicker}
											/>
										</LocalizationProvider>

										{/* Status */}
										<FormControl>
											<InputLabel id="status-label" sx={{backgroundColor: "white", pl: 1, pr: 1, ml: -1}}>Status</InputLabel>
											<Select name="status" id="status" labelId="status-label" value={status} onChange={onChange} disabled={disableCheck.general}>
												<MenuItem value="Planned">Planned</MenuItem>
												<MenuItem value="In Production">In Production</MenuItem>
												<MenuItem value="Released">Released</MenuItem>
											</Select>
										</FormControl>

										{/* Budget */}
										<TextField type="number" id="budget" name="budget" value={budget} onChange={onChange} label="Budget" required disabled={disableCheck.general} />

										{/* Director */}
										<FormControl>
											<InputLabel id="director-label" sx={{backgroundColor: "white", pl: 1, pr: 1, ml: -1}}>Director</InputLabel>
											<Select name="director" id="director" labelId="director-label" value={director} onChange={onChange} disabled={disableCheck.general}>
												<MenuItem value={"default"} disabled>Please select an director</MenuItem>
												{allUsers.filter((user) => user.role === "director").map((user) => (
													<MenuItem value={user._id} key={user._id}>{user.name}</MenuItem>))}
											</Select>
										</FormControl>

										{/* Producer */}
										<FormControl>
											<InputLabel id="producer-label" sx={{backgroundColor: "white", pl: 1, pr: 1, ml: -1}}>Producer</InputLabel>
											<Select name="producer" id="producer" labelId="producer-label" value={producer} onChange={onChange} disabled={disableCheck.general}>
												<MenuItem value={"default"} disabled>Please select an producer</MenuItem>
												{allUsers.filter((user) => user.role === "producer").map((user) => (
													<MenuItem value={user._id} key={user._id}>{user.name}</MenuItem>))}
											</Select>
										</FormControl>

										{/* Writer */}
										<FormControl>
											<InputLabel id="writer-label" sx={{backgroundColor: "white", pl: 1, pr: 1, ml: -1}}>Writer</InputLabel>
											<Select name="writer" id="writer" labelId="writer-label" value={writer} onChange={onChange} disabled={disableCheck.general}>
												<MenuItem value={"default"} disabled>Please select an writer</MenuItem>
												{allUsers.filter((user) => user.role === "writer").map((user) => (
													<MenuItem value={user._id} key={user._id}>{user.name}</MenuItem>))}
											</Select>
										</FormControl>

										{/* Poster */}
										<FormControl>
											<label htmlFor="poster">
												<ListItem disablePadding>
													<NewUserButton selected variant="contained" disabled={disableCheck.poster}>
														<Stack direction="row" alignItems="center" justifyContent="center" sx={{margin: "auto"}}>
															{ (poster || posterName) ? (
																<>
																	<ListItemText sx={{color: "black"}}>Chosen Poster: {posterName}</ListItemText>
																</>
															) : (
																<>
																	<AddIcon sx={{ml: -1.25, mr: 0.5}} />
																	<ListItemText sx={{color: "black"}}>Choose Poster</ListItemText>
																</>
															)}
															
														</Stack>
													</NewUserButton>
												</ListItem>
											</label>

											<input 
												type="file" 
												className="form-control" 
												id="poster" 
												name="poster" 
												onChange={onChange} 
												placeholder="Select Script File" 
												style={{display: "none"}} 
												disabled={disableCheck.poster} 
												max='1'
												accept='.jpg,.png,.jpeg,.pdf'
											/>

										</FormControl>

										{/* Script */}
										<FormControl>
											<label htmlFor="script">
												<ListItem disablePadding>
													<NewUserButton selected variant="contained" disabled={disableCheck.script}>
														<Stack direction="row" alignItems="center" justifyContent="center" sx={{margin: "auto"}}>
															{ (script || scriptName) ? (
																<>
																	<ListItemText sx={{color: "black"}}>Chosen Script: {scriptName}</ListItemText>
																</>
															) : (
																<>
																	<AddIcon sx={{ml: -1.25, mr: 0.5}} />
																	<ListItemText sx={{color: "black"}}>Choose Script</ListItemText>
																</>
															)}
															
														</Stack>
													</NewUserButton>
												</ListItem>
											</label>

											<input 
												type="file" 
												className="form-control" 
												id="script" 
												name="script" 
												onChange={onChange} 
												placeholder="Select Script File" 
												style={{display: "none"}} 
												disabled={disableCheck.script} 
											/>

										</FormControl>

										{/* Trailer */}
										<FormControl>
											<TextField type="text" id="trailer" label="Trailer" name="trailer" value={trailer} onChange={onChange} InputLabelProps={{shrink: true,}} placeholder="Enter Youtube URL" disabled={disableCheck.trailer} />
										</FormControl>




										{/* Submit Button */}
										<CustomLoadingButton loading={isLoading} variant="contained" type="submit" sx={{height: "50px"}}>Update Project</CustomLoadingButton>

									</Stack>


								</Box>

							</Container>
						</Box>

						<Box sx={{display: {tablet: "contents", mobile: "none"}}}>
							<RandomImageBox fullWidth={false} posterImage={poster.url} />
						</Box>

					</Box>
				</Card>
			</Container>
		</>
	)
}
export default UpdateProject