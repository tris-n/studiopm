// React
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Card, CardActionArea, Stack, Typography} from '@mui/material'
import { styled } from '@mui/material/styles'
import DescriptionIcon from '@mui/icons-material/Description'

// Components
import Spinner from '../../components/Spinner'

// Custom Styles
const ComponentBox = styled(Card)({
	borderRadius: "20px", 
	backgroundColor: "#FFFFF !important", 
	boxShadow: "3px 3px 15px rgba(0,0,0,0.1)",
	cursor: "pointer",
	transition: "all 0.3s ease",
	'&:hover': {
		boxShadow: "2px 4px 6px rgba(0,0,0,0.0)",
	},
})



const TotalDeliverables = ({projects}) => {

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const {checkError} = useErrorHandling()

	const {allProjects} = useSelector((state) => state.projects)
	const [deliverablesCount, setDeliverablesCount] = useState(null)


	useEffect(() => {

		let posterCount = projects.filter((project) => project.poster !== "zzzzz").length
		let scriptCount = projects.filter((project) => project.script !== "zzzzz").length
		let trailerCount = projects.filter((project) => project.trailer !== "zzzzz").length

		setDeliverablesCount([posterCount + scriptCount + trailerCount])

	}, [projects])


	const handleComponentClick = (e) => {
		navigate(`/projects/`)
	}

	if (!projects || !deliverablesCount) {
		return <Spinner />
	}



	return (
		<ComponentBox onClick={handleComponentClick}>
			<CardActionArea>

			{/* Display the total number of staff */}
			<Box display="flex" justifyContent="center" alignItems="center" sx={{height: "160px"}}>
				<Stack alignItems="center">
					<DescriptionIcon fontSize="large" color="primary" />
					<Typography variant="h3">{deliverablesCount}</Typography>
					<Typography>Total Deliverables</Typography>
				</Stack>
			</Box>

			</CardActionArea>
		</ComponentBox>
	)
}
export default TotalDeliverables