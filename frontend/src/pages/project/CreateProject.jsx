// React
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {createProject} from '../../features/project/projectSlice'
import {getAllUsers} from '../../features/user/userSlice'

// Firebase
import {getAuth} from 'firebase/auth'
import {getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject} from 'firebase/storage'
import {addDoc, collection, serverTimestamp} from 'firebase/firestore'
import {db} from '../../firebase.config'

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
import PreFill from '../../components/PreFill'
import Spinner from '../../components/Spinner'
import RandomImageBox from '../../components/RandomImageBox'
import CustomLoadingButton from '../../components/CustomLoadingButton'

// Custom Styles
const NewUserButton = styled(ListItemButton)({
	borderRadius: "10px", 
	display: "flex",
})



// RegisterUser
const CreateProject = () => {

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
		poster, // format is => poster: {name: 'alone.jpg', url: 'https://firebasestorage.googleapis.com/.../files%2F648984c0cdb55c10b1985729-alone.jpg}
		script, // same with script
		trailer,
	} = formData

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {checkError} = useErrorHandling()

	const [isLoading, setIsLoading] = useState(false)

	const {allUsers, user} = useSelector((state) => state.user)



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



	useEffect(() => {
		dispatch(getAllUsers())
			.unwrap()
			.catch(error => checkError(error))
	}, [dispatch])



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

	// Prefill with movie from themoviedatabase popular list
	const prefillTitle = (title, budget, release_date, poster_path, poster_url, trailerMovieUrl) => {
		
		setFormData((prevState) => ({
			...prevState,
			title: title,
			budget: budget,
			poster: {
				name: poster_path,
				url: poster_url
			},
			releaseDate: dayjs(release_date),
			status: 'Released',
			trailer: trailerMovieUrl,
		}))

		setChosenPoster((prevState) => ({
			...prevState,
			posterName: poster_path,
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
				
				const fileName = `${user._id}-${file.name}`
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


		// send the FormData 'data' variable/object to the backend
		dispatch(createProject(projectData))
			.unwrap()
			.then((project) => {
				navigate(`/projects/${project._id}`)
				toast.success(`New project created! - ${project.title}`)
			})
			.catch(error => {
				checkError(error)
				setIsLoading(false)
			})

	}


	
	if (!allUsers) {
		return <Spinner />
	}

	

	return (
		<>
			<MetaTags title="Create A Project" />
		
			<Container maxWidth="laptop">

				{/* Header and Create Button */}
				<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{pb: 2, pt: 1.5}}>
					<Typography variant="h4" sx={{color: "white"}}>Create A New Project</Typography>			
				</Stack>


				{/* Create Box */}
				<Card sx={{borderRadius: "20px"}}>
					<Box sx={{ display: "flex"}}>

						<Box sx={{ width: {mobile: "100%", tablet: "50%"}, backgroundColor: "light grey", margin: "auto", pt: 0, pb: 2}}>
							<Container>

								{/* Prefill Box */}
								<PreFill prefillTitle={prefillTitle} />

								<Box component="form" autoComplete="off" onSubmit={onSubmit}>

									<Stack spacing={3}>

										{/* Title */}
										<TextField type="text" id="title" name="title" value={title} onChange={onChange} label="Title" required />

										{/* Release Date */}
										<LocalizationProvider dateAdapter={AdapterDayjs}>
											<DatePicker
												label="Release Date"
												value={dayjs(releaseDate)}
												name="releaseDate"
												onChange={handleDatePicker}
											/>
										</LocalizationProvider>

										{/* Status */}
										<FormControl>
											<InputLabel id="status-label" sx={{backgroundColor: "white", pl: 1, pr: 1, ml: -1}}>Status</InputLabel>
											<Select name="status" id="status" labelId="status-label" value={status} onChange={onChange}>
												<MenuItem value="Planned">Planned</MenuItem>
												<MenuItem value="In Production">In Production</MenuItem>
												<MenuItem value="Released">Released</MenuItem>
											</Select>
										</FormControl>

										{/* Budget */}
										<TextField type="number" id="budget" name="budget" value={budget} onChange={onChange} label="Budget" required />

										{/* Director */}
										<FormControl>
											<InputLabel id="director-label" sx={{backgroundColor: "white", pl: 1, pr: 1, ml: -1}}>Director</InputLabel>
											<Select name="director" id="director" labelId="director-label" value={director} onChange={onChange}>
												<MenuItem value={"default"} disabled>Please select an director</MenuItem>
												{allUsers.filter((user) => user.role === "director").map((user) => (
													<MenuItem value={user._id} key={user._id}>{user.name}</MenuItem>))}
											</Select>
										</FormControl>

										{/* Producer */}
										<FormControl>
											<InputLabel id="producer-label" sx={{backgroundColor: "white", pl: 1, pr: 1, ml: -1}}>Producer</InputLabel>
											<Select name="producer" id="producer" labelId="producer-label" value={producer} onChange={onChange}>
												<MenuItem value={"default"} disabled>Please select an producer</MenuItem>
												{allUsers.filter((user) => user.role === "producer").map((user) => (
													<MenuItem value={user._id} key={user._id}>{user.name}</MenuItem>))}
											</Select>
										</FormControl>

										{/* Writer */}
										<FormControl>
											<InputLabel id="writer-label" sx={{backgroundColor: "white", pl: 1, pr: 1, ml: -1}}>Writer</InputLabel>
											<Select name="writer" id="writer" labelId="writer-label" value={writer} onChange={onChange}>
												<MenuItem value={"default"} disabled>Please select an writer</MenuItem>
												{allUsers.filter((user) => user.role === "writer").map((user) => (
													<MenuItem value={user._id} key={user._id}>{user.name}</MenuItem>))}
											</Select>
										</FormControl>

										{/* Poster */}
										<FormControl>
											<label htmlFor="poster">
												<ListItem disablePadding>
													<NewUserButton selected variant="contained">
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
												max='1'
												accept='.jpg,.png,.jpeg,.pdf'
											/>

										</FormControl>

										{/* Script */}
										<FormControl>
											<label htmlFor="script">
												<ListItem disablePadding>
													<NewUserButton selected variant="contained">
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
												max='1'
											/>

										</FormControl>

										{/* Trailer */}
										<FormControl>
											<TextField type="text" id="trailer" label="Trailer" name="trailer" value={trailer} onChange={onChange} InputLabelProps={{shrink: true,}} placeholder="Enter Youtube URL" />
										</FormControl>




										{/* Submit Button */}
										<CustomLoadingButton loading={isLoading} variant="contained" type="submit" sx={{height: "50px"}}>Create Project</CustomLoadingButton>

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
export default CreateProject