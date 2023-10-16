// Material UI
import {Box} from '@mui/material'


const customBoxStyle = {
	border: "solid 1px #CCDBEF", 
	borderRadius: "10px",
	backgroundColor: "rgba(229, 246, 253, 1)",
	color: "rgba(1, 67, 97, 1)",
	fontSize: "14px",
	fontWeight: "400",
	letterSpacing: "0.15px",
	lineHeight: "20px",
	padding: "13px 16px 13px 16px",
	marginBottom: "15px",
	marginTop: "30px",
	whiteSpace: "nowrap",
	display: "flex",
	alignItems: "center",
	flexDirection: 'row',
	'@media (max-width: 1200px)': {
		flexDirection: 'column',
	},
}



const CustomAlertBox = ({children}) => {
	return (
		<Box sx={customBoxStyle}>
			{children}
		</Box>
	)
}

export default CustomAlertBox