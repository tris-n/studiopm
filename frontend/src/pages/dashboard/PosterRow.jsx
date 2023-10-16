// Material UI
import { Grid } from "@mui/material"

// Components
import ProjectPoster from "./ProjectPoster"



const PosterRow = ({projects}) => {
	return (
		<>
			<Grid mobile={12} laptop={4}>
				<ProjectPoster posterPath="https://image.tmdb.org/t/p/original/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg" url="64903cf79abaaa9941a3ad80" />
			</Grid>
			
			<Grid mobile={12} laptop={4}>
				<ProjectPoster posterPath="https://image.tmdb.org/t/p/original/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg" url="649039f89abaaa9941a3ad16" />
			</Grid>
			
			<Grid mobile={12} laptop={4}>
				<ProjectPoster posterPath="https://image.tmdb.org/t/p/original/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg" url="64903c8d9abaaa9941a3ad6c" />
			</Grid>
		</>
	)
}
export default PosterRow