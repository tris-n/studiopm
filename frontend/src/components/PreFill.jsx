// React
import {useState} from 'react'

// Axios
import axios from 'axios'

// React Modal
import Modal from 'react-modal'

// Material UI
import {Stack, Typography} from '@mui/material'
import { styled } from '@mui/material/styles'

// React-Icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

// Components
import MovieSearch from './MovieSearch'
import CustomPrefillButton from './CustomPrefillButton'

// // Custom Styles
const CustomAlertBox = styled(Stack)({
	border: "solid 1px #CCDBEF", 
	borderRadius: "10px",
	backgroundColor: "rgba(229, 246, 253, 1)",
	color: "rgba(1, 67, 97, 1)",
	fontSize: "14px",
	fontWeight: "400",
	letterSpacing: "0.15px",
	lineHeight: "20px",
	padding: "13px 16px 13px 16px",
	display: "flex",
	alignItems: "center",
	marginBottom: "20px",
	marginTop: "20px",
	whiteSpace: "nowrap"
})



const PreFill = ({prefillTitle}) => {

	const [isLoadingRandom, setIsLoadingRandom] = useState(false)
	const [isLoadingSpecific, setIsLoadingSpecific] = useState(false)
	const [modalIsOpen, setIsOpen] = useState(false)



	const getMovieDetails = async (movieId) => {
		
		setIsOpen(false)
		
		// TMDB Config Details
		const bearerAuth = process.env.REACT_APP_API_BEARER_AUTH
		const config = {
			params: {language: 'en-US', page: '1'},
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${bearerAuth}`
			}
		}

		

		// Get random movieId from List of Popular Movies
		if (movieId === "random") {

			setIsLoadingRandom(true)
			
			let popularMovieUrl = 'https://api.themoviedb.org/3/movie/popular'
			
			const popularMovieList = (await axios.get(popularMovieUrl, config)).data.results
				
			movieId = popularMovieList[Math.floor(Math.random() * popularMovieList.length)].id

		} else {

			setIsLoadingSpecific(true)

		}



		// Get the Details of the Selected Movie
		let selectedMovieUrl = `https://api.themoviedb.org/3/movie/${movieId}`

		const selectedMovieDetails = (await axios.get(selectedMovieUrl, config)).data

		// Get budget, title, and release date from the details

		let {title, budget, release_date, poster_path} = selectedMovieDetails
		let posterPathUrl = `https://image.tmdb.org/t/p/original${poster_path}`

		if (budget === 0) {
			budget = 1000000
		}

		poster_path = poster_path.slice(1)



		// Get the Video of the Selected Movie
		let trailerMovieUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos`

		const movieTrailer = `https://www.youtube.com/watch?v=` + (await axios.get(trailerMovieUrl, config)).data.results.filter((movie) => movie.type === 'Trailer')[0].key

		prefillTitle(title, budget, release_date, poster_path, posterPathUrl, movieTrailer)

		setIsLoadingRandom(false)
		setIsLoadingSpecific(false)

	}

	// Modal settings
	const openModal = () => {
		setIsOpen(true)
	}
	
	const closeModal = () => {
		setIsOpen(false)
	}


	return (
		<CustomAlertBox direction={{tablet: "column", laptop: "row"}}>

			<Stack direction="row">
				<InfoOutlinedIcon sx={{color: "rgba(2, 136, 209, 1)", fontSize: "22px", fontWeight: "400", opacity: "0.9", marginRight: "12px"}} />
				You can prefill with:
			</Stack>

			<Stack direction={{tablet: "row", mobile: "column"}} sx={{pt: {mobile: 1, tablet: 1, laptop: 0}}} spacing={1}>
				<CustomPrefillButton onClick={() => getMovieDetails("random")} loading={isLoadingRandom}>Random movie</CustomPrefillButton> 
				<CustomPrefillButton onClick={openModal} loading={isLoadingSpecific}>Search for specific movie</CustomPrefillButton> 
			</Stack>

			{/* Search modal */}
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				ariaHideApp={false}
				style={{
					overlay: {
						zIndex: 1200,
						backgroundColor: "rgba(0,0,0,0.4)"
					},
					content: {
						backgroundColor: "#f2f4f8",
						borderRadius: "1rem",
						display: "flex",
						flexDirection: "column",
						height: "145px",
						maxWidth: "400px",
						margin: "auto"
						// height: "20rem"
					}
				}}
			>
				<Typography sx={{mb: 2, fontWeight: "bold"}}>
					Search for specific movie
				</Typography>

				<MovieSearch getMovieDetails={getMovieDetails} />

			</Modal>

		</CustomAlertBox>
	)
}
export default PreFill