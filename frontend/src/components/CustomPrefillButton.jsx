// Material UI
import LoadingButton from '@mui/lab/LoadingButton'
import { styled } from '@mui/material/styles'



const customPrefillStyle = {
	textTransform: "initial",
	marginLeft: {
		tablet: "10px",
		mobile: "0px",
	},
	border: "solid 1px #CCDBEF", 
	backgroundColor: "#DFEFFA",
	color: "rgba(1, 67, 97, 1)",
	borderRadius: "10px",
	padding: "3px 8px",
	fontSize: "14px",
	"&:hover": {
		backgroundColor: "rgba(2, 136, 209, 0.1)",
	}
}

const CustomPrefillButton = ({children, onClick, loading}) => {

	return (
		<LoadingButton sx={customPrefillStyle} onClick={onClick} loading={loading}>
			{children}
		</LoadingButton>
	)
}

export default CustomPrefillButton