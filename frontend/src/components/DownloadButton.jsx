// Material UI
import {ListItemButton} from '@mui/material'
import { styled } from '@mui/material/styles'

const DownloadButton = styled(ListItemButton)({
	borderRadius: "20px", 
	width: "100%",
	marginTop: "10px",
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

export default DownloadButton