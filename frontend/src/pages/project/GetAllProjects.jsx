// React
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getAllProjects} from '../../features/project/projectSlice'

// Helmet Meta Tags
import MetaTags from '../../utilities/MetaTags'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Container, ListItem, Stack, Typography} from '@mui/material'

// Components
import Spinner from '../../components/Spinner'
import CustomButton from '../../components/CustomButton'
import GetAllProjectsTable from './getAllProjects/GetAllProjectsTable'



// GetAllUsers
const GetAllUsers = () => {

	const {allProjects} = useSelector((state) => state.projects)
	const {user} = useSelector((state) => state.user)

	const [isLoading, setIsLoading] = useState(true)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const {checkError} = useErrorHandling()



	useEffect(() => {

		// if there is no data, fetch it
		if (!allProjects) {

			const fetchData = async () => {

				setIsLoading(true)

				await dispatch(getAllProjects())
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
		
				await dispatch(getAllProjects())
					.unwrap()
					.catch(error => checkError(error))

			}

			updateData()
		}

	}, [dispatch])



	return (
		<>
			<MetaTags title="Projects" />

			<Container maxWidth="laptop">

				{/* Header and Create Button */}
				<Stack direction={{mobile: "column", tablet: "row"}} alignItems={{mobile: "flex-start", tablet: "center"}} justifyContent="space-between" sx={{pb: 2}}>
					<Typography variant="h4" sx={{width: "200px", color: "white"}}>Projects</Typography>
					
					<ListItem sx={{width: "180px", mr:-2, ml: {mobile: -2, tablet: 0}}}>

						{ user.role === 'studio head' && (
							<CustomButton labelName="New Project" onClick={() => navigate(`/projects/create`)} />
						)}

					</ListItem>
				</Stack>

				{isLoading ? (
					<Spinner />
				):(
					<>
						{/* Table */}
						{allProjects.length > 0 ? (
							<GetAllProjectsTable />
						):(
							<Box>
								<Typography>No projects created.</Typography>
							</Box>
						)}
					</>
				)}

			</Container>
		</>
	)
}
export default GetAllUsers