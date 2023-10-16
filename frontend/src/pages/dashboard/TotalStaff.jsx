// React
import {useNavigate} from 'react-router-dom'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Card, CardActionArea, Stack, Typography} from '@mui/material'
import { styled } from '@mui/material/styles'
import GroupsIcon from '@mui/icons-material/Groups'

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



const TotalStaff = ({users}) => {

	const navigate = useNavigate()

	const {checkError} = useErrorHandling()

	const handleComponentClick = () => {
		navigate(`/crew/`)
	}

	if (!users) {
		return <Spinner />
	}



	return (
		<ComponentBox onClick={handleComponentClick}>
			<CardActionArea>

			{/* Display the total number of staff */}
			<Box display="flex" justifyContent="center" alignItems="center" sx={{height: "160px"}}>
				<Stack alignItems="center">
					<GroupsIcon fontSize="large" color="primary" />
					<Typography variant="h3">{users.length}</Typography>
					<Typography>Total Staff</Typography>
				</Stack>
			</Box>

			</CardActionArea>
		</ComponentBox>
	)
}
export default TotalStaff