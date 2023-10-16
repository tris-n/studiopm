// React
import {Link} from 'react-router-dom'

// Material UI
import {Box, Typography} from '@mui/material'
import { styled } from '@mui/material/styles'

// Custom Styles
const ContentBox = styled(Box)({
	height: "64px", 
	display: "flex", 
	alignItems: "center",
	"& a" : {
		color: "#9AAABA",
		textDecoration: "none"
	},
	"& a:hover" : {
		color: "white",
	}
})



const MenuLinkBox = ({url, text}) => {
	return (
		<ContentBox>
			<Link to={url}>
				<Typography sx={{fontSize: "1.2rem"}}>
					{text}
				</Typography>
			</Link>
		</ContentBox>
	)
}
export default MenuLinkBox