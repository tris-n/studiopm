// Material UI
import {ListItemButton, ListItemText, Stack} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

// Custom Styles
const baseStyle = {
	borderRadius: "20px", 
	width: "100%",
	backgroundColor: "rgba(60, 236, 238, 0.4) !important",
	color: "white",
	display: "flex",
	'&:hover': {
		backgroundColor: "rgba(60, 236, 238, 0.8) !important",
		color: "black",
	}
}

const trailerStyle = {
	marginTop: "-10px",
	height: "390px",
}

const posterStyle = {
	marginTop: "-10px",
	height: "684px",
}

const scriptStyle = {
	marginTop: "10px",
}



const CustomAssignButton = ({labelName, add, disabled, type, onClick}) => {

	let buttonStyle = {}

	if (type === 'trailer') {
		buttonStyle = {...baseStyle, ...trailerStyle}
	}
	
	if (type === 'poster') {
		buttonStyle = {...baseStyle, ...posterStyle}
	}
	
	if (type === 'script') {
		buttonStyle = {...baseStyle, ...scriptStyle}
	}


	return (
		<ListItemButton disabled={disabled} selected variant="contained" onClick={onClick} sx={buttonStyle}>
			<Stack direction="row" alignItems="center" justifyContent="center" sx={{margin: "auto"}}>
				{add && (
					<AddIcon sx={{ml: -1.25, mr: 0.5}} />
				)}
				<ListItemText>{labelName}</ListItemText>
			</Stack>
		</ListItemButton>
	)
}
export default CustomAssignButton