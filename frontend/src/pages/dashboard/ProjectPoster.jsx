// Material UI
import { Box, Typography } from "@mui/material"
import { styled } from '@mui/material/styles'
import { Link } from "react-router-dom"


const ProjectPoster = ({posterPath, url, title}) => {

	// Custom Styles
	const PosterBox = styled(Box)({
		backgroundColor: "white",
		borderRadius: "20px",
		backgroundImage: `url('${posterPath}')`, 
		backgroundRepeat: "no-repeat", 
		backgroundSize: "cover", 
		backgroundPosition: "center",
		width: "100%",
		paddingTop: "150%",
		transition: '.3s ease-in-out',
		transform: "scale(1)",
		'&:hover': {
			cursor: 'pointer',
			transform: "scale(1.02)",
		},
	})

	const NoPosterBox = styled(Box)({
		border: "2px dashed lightGrey",
		borderRadius: "20px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		color: "white",
		width: "100%",
		paddingTop: "150%",
		transition: '.3s ease-in-out',
		transform: "scale(1)",
		'&:hover': {
			cursor: 'pointer',
			transform: "scale(1.02)",
		},
	})

	return (
		<Link to={`/projects/${url}`}>
			{posterPath ? (
				<PosterBox />
			):(
				<NoPosterBox>
					<Typography className="noPosterBoxTextStyle">{title}</Typography>
				</NoPosterBox>
			)}
		</Link>
	)
}
export default ProjectPoster