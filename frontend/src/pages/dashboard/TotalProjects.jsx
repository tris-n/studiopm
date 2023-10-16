// React
import {useNavigate} from 'react-router-dom'

// Material UI
import {Box, Card, CardActionArea, Stack, Typography} from '@mui/material'
import { styled } from '@mui/material/styles'
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial'

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



const TotalProjects = ({projects}) => {

	const navigate = useNavigate()

	const handleComponentClick = (e) => {
		navigate(`/projects/`)
	}

	if (!projects) {
		return <Spinner />
	}



	return (
		<ComponentBox onClick={handleComponentClick}>
			<CardActionArea>

			{/* Display the total number of projects */}
			<Box display="flex" justifyContent="center" alignItems="center" sx={{height: "160px"}}>
				<Stack alignItems="center">
					<FolderSpecialIcon fontSize="large" color="primary" />
					<Typography variant="h3">{projects.length}</Typography>
					<Typography>Total Projects</Typography>
				</Stack>
			</Box>

			</CardActionArea>
		</ComponentBox>
	)
}
export default TotalProjects