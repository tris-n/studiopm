// Material UI
import { Box, Stack, Typography } from "@mui/material"
import { styled } from '@mui/material/styles'

// Illustration
import landingSplash from '../../images/landing-splash.png'

// Custom Styles
const TypeH1 = styled(Typography)({
	color: "#AABBCC",
	fontSize: "2.4rem",
})

const TypeP = styled(Typography)({
	color: "#AABBCC",
	fontSize: "1.4rem"
})

const imageBoxStyle = {
	display: {tablet: "initial", mobile: "none"},
	width: {tablet: "50%", mobile: "0%"}, 
	padding: {tablet: "2rem", mobile: "0rem"},
}

const textBoxStyle = {
	width: {tablet: "50%", mobile: "100%"}, 
	padding: {tablet: "3rem 5rem 3rem 3rem", mobile: "0rem 3rem 1rem 0rem"},
}


const WelcomeWidget = () => {
	return (
		<>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				
				{/* Image Box */}
				<Box sx={imageBoxStyle}>
					<img src={landingSplash} alt="" width="100%" />
				</Box>

				{/* Text Box */}
				<Box sx={textBoxStyle}>
					<TypeH1>Welcome to <strong>Studio</strong>PM</TypeH1>
					<TypeP><strong>Studio</strong>PM helps you manage film projects, monitor production status, identify staffing needs, access deliverables, and streamline your workflow.</TypeP>
				</Box>

			</Stack>
		</>
	)
}
export default WelcomeWidget