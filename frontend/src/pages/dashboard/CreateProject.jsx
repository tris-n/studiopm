// React
import {useNavigate} from 'react-router-dom'

// Illustration
import clapper from './images/clapper.png'

// Material UI
import {Box, Card, CardActionArea, ListItemButton, ListItemText, Stack} from '@mui/material'
import { styled } from '@mui/material/styles'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'

// Custom Styles
const ComponentBox = styled(Card)({
	borderRadius: "20px", 
	backgroundColor: "#F6F6F6 !important", 
	boxShadow: "0px 0px 0px rgba(0,0,0,0.0)",
	cursor: "pointer",
	transition: "all 0.3s ease",
})

const ViewProjectsButton = styled(ListItemButton)({
	borderRadius: "10px", 
	width: "100%",
	marginTop: "-10px",
	marginBottom: "-10px",
	color: "white",
	backgroundColor: "#2076CD !important", 
	display: "flex",
	boxShadow: "1px 3px 5px rgba(0,0,0,0.2)",
	transition: "all 0.3s ease",
})




const CreateProject = () => {

	const navigate = useNavigate()

	const handleViewProjects = () => {
		navigate(`/projects/`)
	}

	const handleComponentClick = (e) => {
		navigate(`/projects/create`)
	}

	return (
		<ComponentBox onClick={handleComponentClick}>
			<CardActionArea>

				{/* Display the total number of projects */}
				<Box display="flex" justifyContent="center" alignItems="center" sx={{height: "160px", width: "350px", margin: "auto", position: "relative"}}>
					<Stack alignItems="center">
						
						<ViewProjectsButton selected variant="contained" onClick={handleViewProjects} sx={{position: "relative", right: "-35px", paddingLeft: "50px", paddingRight: "25px"}}>
							<Stack direction="row" alignItems="center" justifyContent="center" sx={{margin: "auto"}}>
								<ListItemText>Create New Project</ListItemText>
								<CreateNewFolderIcon sx={{ml: 1, mr: -1.5}} />
							</Stack>
						</ViewProjectsButton>

						<Box display="flex" justifyContent="center" alignItems="center" sx={{padding: "20px 40px 20px 20px", filter: "drop-shadow(5px 5px 5px rgba(0,0,0,0.5))", position: "absolute", left: "-5px", top: "0"}}>
							<Box>
								<img src={clapper} alt="" width="120px" sx={{objectFit: "cover", margin: "auto"}} />
							</Box>
						</Box>
						
					</Stack>
				</Box>

			</CardActionArea>
		</ComponentBox>
	)
}
export default CreateProject