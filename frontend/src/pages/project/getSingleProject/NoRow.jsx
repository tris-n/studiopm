// React
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector} from 'react-redux'

// Material UI
import { ListItem, ListItemButton, ListItemText, Stack, TableCell, TableRow } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import { styled } from '@mui/material/styles'

// Components
import Spinner from '../../../components/Spinner'

// Custom Styles
const AssignStaffButton = styled(ListItemButton)({
	borderRadius: "20px", 
	width: "100%",
	marginTop: "-10px",
	marginBottom: "-10px",
	display: "flex",
	'&:hover': {
		backgroundColor: "#d5f2dc !important",
	}
})



const NoRow = ({staff}) => {

	const {singleProject} = useSelector((state) => state.projects)
	const {user} = useSelector((state) => state.user)
	
	const navigate = useNavigate()

	const handleAssignStaff = () => {
		navigate(`/projects/update/${singleProject._id}`)
	}

	if (!singleProject || !user) {
		return <Spinner />
	}


	
	return (
		<TableRow hover sx={{height: "77px"}}>
			<TableCell><strong>{staff.charAt(0).toUpperCase() + staff.slice(1)}</strong></TableCell>

			{/* Mobile */}
			<TableCell colSpan={1} sx={{display: {mobile: "table-cell", tablet: "none"}}}><Stack direction="row" alignItems="center">No {staff} assigned to this project</Stack></TableCell>
			
			{/* Tablet And Above */}
			<TableCell colSpan={2} sx={{display: {mobile: "none", tablet: "table-cell"}}}><Stack direction="row" alignItems="center">No {staff} assigned to this project</Stack></TableCell>
	
			<TableCell>
				<ListItem sx={{pl: 0, pr: 0, minHeight: "40px"}}>

					{ (user.role === 'studio head' || user.role === 'producer') && (
						<AssignStaffButton selected variant="contained" onClick={handleAssignStaff}>
							<Stack direction="row" alignItems="center" justifyContent="center" sx={{margin: "auto"}}>
								<AddIcon sx={{ml: -1.25, mr: 0.5}} />
								<ListItemText sx={{color: "black"}}>Assign Staff</ListItemText>
							</Stack>
						</AssignStaffButton>
					)}

				</ListItem>
			</TableCell>
		</TableRow>	
	)
}
export default NoRow