// React
import { useEffect, useState } from 'react'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getAllProjects} from '../features/project/projectSlice'

// Error Handling
import useErrorHandling from '../utilities/useErrorHandling'

// Helmet Meta Tags
import MetaTags from '../utilities/MetaTags'

// Framer Motion
import FadeInAndDown from '../components/FramerComponents/FadeInAndDown'
import StaggerChildren from '../components/FramerComponents/StaggerChildren'

// Material UI
import {Container, Typography} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import useBreakpoints from '../theme/useBreakpoints'

// Components
import Spinner from '../components/Spinner'

// Widgets
import WelcomeWidget from './dashboard/WelcomeWidget'
import ProjectPoster from './dashboard/ProjectPoster'
import TotalBudget from './dashboard/TotalBudget'
import CreateStaff from './dashboard/CreateStaff'
import CreateProject from './dashboard/CreateProject'

// Custom Styles
const latestProjectsStyle = {
	color: "#AABBCC", 
	fontSize: "1rem", 
	fontWeight: "bold", 
	marginBottom: {
		mobile: "0px", 
		tablet: "-25px",
	},
	marginTop: {
		mobile: "10px", 
		tablet: "0px"
	}
}



const Dashboard = () => {

	const { user } = useSelector((state) => state.user)
	const { allProjects } = useSelector((state) => state.projects)
	
	const [latestProjects, setLatestProjects] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	
	const dispatch = useDispatch()
	
	const {checkError} = useErrorHandling()

	const {isMobile, isTablet, isLaptop, isDesktop} = useBreakpoints()



	useEffect(() => {

		// if there is no data, fetch it
		if (!allProjects) {

			// fetchData
			const fetchData = async () => {
	
				setIsLoading(true)
	
				await dispatch(getAllProjects())
					.unwrap()
					.then((projects) => {
						let filteredProjects = projects.filter((project) => (project.poster)).slice(-3).reverse()
						setLatestProjects(filteredProjects)
					})
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
					.then((projects) => {
						let filteredProjects = projects.filter((project) => (project.poster)).slice(-3).reverse()
						setLatestProjects(filteredProjects)
					})
					.catch(error => checkError(error))
	
			}
	
			updateData()
		}		

	}, [dispatch])



	if (!user || !allProjects || !latestProjects) {
		return <Spinner />
	}


	
	return (
		<>
			<MetaTags title="Manage film projects, monitor production status, identify staffing needs, access deliverables, and streamline your workflow." />

			<Container maxWidth="laptop" sx={{marginBottom: "20px"}}>
				<StaggerChildren>
				<Grid container spacing={{
					mobile: 2,
					tablet: 4,
					laptop: 5
				}}>

					

					{/* Top Row */}
					<FadeInAndDown>
						<Grid mobile={12} laptop={12}>
							<WelcomeWidget />
						</Grid>
					</FadeInAndDown>
					

					{isLoading ? (
						<Spinner />
					):(
						<>
							{/* Poster Row */}
							
							<Grid mobile={12} laptop={12}>
								<Typography sx={latestProjectsStyle}>Latest Projects</Typography>
							</Grid>

							{latestProjects.slice(0, isMobile ? 2 : 3).map((project) => (
								<Grid mobile={6} tablet={4} laptop={4} key={project._id}>
									<FadeInAndDown>
										<ProjectPoster posterPath={project.poster.url} url={project._id} title={project.title} />
									</FadeInAndDown>
								</Grid>	
							))}

							{/* Bottom Row */}
							<Grid mobile={12} tablet={12} laptop={4}>
								<TotalBudget projects={allProjects} />
							</Grid>

							<Grid mobile={12} tablet={6} laptop={4} sx={{display: {
								tablet: "initial", mobile: "none"
							}}}>
								{ user.role === "studio head" && (
									<CreateProject />
								)}
							</Grid>
							
							<Grid mobile={12} tablet={6} laptop={4} sx={{display: {
								tablet: "initial", mobile: "none"
							}}}>
								{ user.role === "studio head" && (
									<CreateStaff />
								)}
							</Grid>
						
						</>
					)}




				</Grid>
				</StaggerChildren>
			</Container>
		</>
	)
}
export default Dashboard