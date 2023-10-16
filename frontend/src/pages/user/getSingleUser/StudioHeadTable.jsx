// React
import {useNavigate} from 'react-router-dom'

// Material UI
import { Box, Card, ListItem, ListItemButton, ListItemText, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { styled } from '@mui/material/styles'

// Custom Styles
const ViewProfileButton = styled(ListItemButton)({
	borderRadius: "20px", 
	width: "100%",
	marginTop: "-10px",
	marginBottom: "-10px",
	color: "white",
	backgroundColor: "#2076CD !important", 
	display: "flex",
	boxShadow: "1px 3px 5px rgba(0,0,0,0.2)",
	transition: "all 0.3s ease",
	'&:hover': {
		backgroundColor: "#1B65BB !important",
		boxShadow: "2px 4px 6px rgba(0,0,0,0.4)",
	},
})



const StudioHeadTable = ({projects, deliverableType}) => {

	const navigate = useNavigate()

	const handleViewProject = (projectId) => {
		navigate(`/projects/${projectId}`)
	}



	return (
		<TableContainer component={Card} sx={{borderRadius: "20px"}}>
			<Table>

				{/* Header */}
				<TableHead sx={{backgroundColor: "#EAEAEC"}}>
					<TableRow>
						<TableCell>Title</TableCell>
						<TableCell> </TableCell>
					</TableRow>
				</TableHead>

				{/* Body */}
				<TableBody>

					{projects.map((project, index) => (
						<TableRow hover key={index}>
							<TableCell>
								<Stack direction="row" alignItems="center">
									{project.poster ? (
										<Box sx={{
											mr: 1, 
											borderRadius: "10px", 
											width: "60px",
											height: "90px", 
											backgroundImage: `url(${project.poster?.url})`,
											backgroundRepeat: 'no-repeat',
											backgroundPosition: 'center center',
											backgroundSize: 'cover',
										}}/>
									) : (
										<Box sx={{
											mr: 1, 
											borderRadius: "10px", 
											width: "60px",
											height: "90px", 
											border: "2px dashed lightGray"
										}}/>
									)}
									
									<strong>{project.title}</strong>
								</Stack>
							</TableCell>

							<TableCell>
								<ListItem sx={{pl: 0, pr: 0}}>

									<ViewProfileButton selected variant="contained" onClick={() => handleViewProject(project._id)}>
										<Stack direction="row" alignItems="center" justifyContent="center" sx={{margin: "auto"}}>
											<ListItemText>View Project</ListItemText>
										</Stack>
									</ViewProfileButton>

								</ListItem>

							</TableCell>
						</TableRow>
					))}

				</TableBody>
			</Table>
		</TableContainer>
	)
}
export default StudioHeadTable