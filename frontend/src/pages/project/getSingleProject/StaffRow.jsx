// React
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector} from 'react-redux'

// Material UI
import { Avatar, ListItem, ListItemButton, ListItemText, Stack, TableCell, TableRow } from "@mui/material"
import { styled } from '@mui/material/styles'

// Components
import Spinner from '../../../components/Spinner'

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



const StaffRow = ({staff, deliverable}) => {

	const {singleProject} = useSelector((state) => state.projects)
	const {user} = useSelector((state) => state.user)

	const navigate = useNavigate()

	const handleViewProfile = () => {
		navigate(`/crew/${singleProject[staff]._id}`)
	}

	if (!singleProject || !user) {
		return <Spinner />
	}


	
	return (
		<TableRow hover>
			<TableCell><strong>{staff.charAt(0).toUpperCase() + staff.slice(1)}</strong></TableCell>
			<TableCell>
				<Stack direction="row" alignItems="center">
					<Avatar src={`/images/avatars/${singleProject[staff].name.slice(0,1).toLowerCase()}.png`} alt="" width="45px" sx={{mr: 1}}/>
					{singleProject[staff].name}
				</Stack>
			</TableCell>
			<TableCell sx={{display: {mobile: "none", tablet: "table-cell"}}}>{deliverable.charAt(0).toUpperCase() + deliverable.slice(1)} {singleProject[deliverable] ? "supplied" : "needed"}</TableCell>
			<TableCell>
				<ListItem sx={{pl: 0, pr: 0}}>

					{ ((user.role === 'studio head' || user.role === 'producer') || singleProject[staff]._id === user._id) && (
						<ViewProfileButton selected variant="contained" onClick={handleViewProfile}>
							<Stack direction="row" alignItems="center" justifyContent="center" sx={{margin: "auto"}}>
								<ListItemText>View Profile</ListItemText>
							</Stack>
						</ViewProfileButton>
					)}

				</ListItem>
			</TableCell>
		</TableRow>	
	)
}
export default StaffRow