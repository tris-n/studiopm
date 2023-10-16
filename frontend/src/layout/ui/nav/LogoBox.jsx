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
	marginTop: 10,
	"& a" : {
		color: "black",
		textDecoration: "none"
	},
	"& a:hover" : {
		color: "#595959",
	}
})



const LogoBox = () => {
	return (
			<ContentBox>
					<Link to="/dashboard"><img src={logo} alt="StudioPM" height="30px" /></Link>
					<Link to="/dashboard"><Typography sx={{ml: 1}}><strong>Studio</strong>PM</Typography></Link>
			</ContentBox>
	)
}
export default LogoBox