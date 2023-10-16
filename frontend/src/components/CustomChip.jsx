// Material UI
import {Chip} from '@mui/material'

// Custom Style
const chipStyle = {
	color: "#aabbcc",
	backgroundColor: "#45494E",
}



const CustomChip = ({label, icon}) => {
	return (
		<Chip label={label} icon={icon} sx={chipStyle} />
	)
}
export default CustomChip