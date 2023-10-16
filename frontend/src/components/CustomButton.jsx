// Material UI
import {ListItemButton, ListItemText, Stack} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

// Custom Style
const buttonStyle = {
	borderRadius: "20px", 
	border: "solid 1px rgba(235, 205, 205, 0)",
	display: "flex",
	color: "white",
	transition: "0.2s ease-in-out",
	backgroundColor: "rgba(255, 255, 255, 0.1) !important",
	'&:hover': {
		backgroundColor: "rgba(60, 236, 238, 0.8) !important",
		color: "black",
	}
}

const deleteButtonStyle = {
	borderRadius: "20px", 
	border: "solid 1px rgba(235, 205, 205, 0)",
	display: "flex",
	color: "white",
	transition: "0.2s ease-in-out",
	backgroundColor: "rgba(255, 255, 255, 0.1) !important",
	'&:hover': {
		backgroundColor: "#FF686A !important",
	}
}



const CustomButton = ({labelName, deletion, onClick, children}) => {

	return (
		<ListItemButton selected variant="contained" sx={deletion ? deleteButtonStyle : buttonStyle} onClick={onClick}>
			<Stack direction="row" alignItems="center" justifyContent="center" sx={{margin: "auto"}}>
				<AddIcon sx={{ml: -1.25, mr: 0.5}} />
				<ListItemText>{labelName}</ListItemText>
			</Stack>
		</ListItemButton>

	)
}

export default CustomButton