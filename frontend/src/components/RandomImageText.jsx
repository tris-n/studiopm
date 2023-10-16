// Material UI
import {Box} from '@mui/material'



const RandomImageText = ({children}) => {

	const boxStyle = { 
		width: {mobile: "90%", tablet: "50%"}, 
		maxWidth: "700px",
		backgroundColor: "white", 
		margin: "auto", 
		paddingTop: "15px", 
		borderRadius: "20px", 
		boxShadow: "5px 5px 15px rgba(0,0,0,0.4)",
	}

	return (
		<Box sx={boxStyle}>
			{children}
		</Box>
	)
}
export default RandomImageText