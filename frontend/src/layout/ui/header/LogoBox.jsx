// React
import {Link} from 'react-router-dom'

// Material UI
import {Box, Typography} from '@mui/material'
import { styled } from '@mui/material/styles'

// Logo
import logo from '../../../images/logo.png'

// Custom Styles
const ContentBox = styled(Box)({
	height: "64px", 
	display: "flex", 
	alignItems: "center", 
	border: 1,
	"& a" : {
		color: "white",
		textDecoration: "none"
	},
	"& a:hover" : {
		color: "#9AAABA",
	}
})

const logoTextStyle ={
	ml: 1,
	fontSize: "1.5rem",
	position: "relative",
	top: -1,
	display: "inherit",
}


const LogoBox = () => {
	return (
			<ContentBox>
				<Link to="/dashboard"><img src={logo} alt="StudioPM" height="30px" /></Link>
				<Link to="/dashboard"><Typography sx={logoTextStyle}><strong>Studio</strong>PM</Typography></Link>
			</ContentBox>
	)
}
export default LogoBox