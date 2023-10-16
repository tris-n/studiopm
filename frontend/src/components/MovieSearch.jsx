// React
import { useState, useEffect } from "react"

// Axios
import axios from 'axios'

// Material UI
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

// Lodash - debounce
import { debounce } from 'lodash'



const MovieSearch = ({getMovieDetails}) => {

	const [inputValue, setInputValue] = useState("")
	const [options, setOptions] = useState([])



	const debouncedFetchMovies = debounce(value => {
		fetchMovies(value)
	}, 500)



	const fetchMovies = async (value) => {

		// TMDB Config Details
		const bearerAuth = process.env.REACT_APP_API_BEARER_AUTH
		const config = {
			params: {
				query: value, 
				include_adult: 'false', 
				language: 'en-US', 
				page: '1'
			},
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${bearerAuth}`
			}
		}



		try {
			const response = await axios.get('https://api.themoviedb.org/3/search/movie', config)
			let filteredResponse = response.data.results.filter(movie => movie.vote_count > 500).sort((a, b) => a.title.localeCompare(b.title))
			setOptions(filteredResponse || [])
		} catch (error) {
			console.error(`Failed to fetch movies: ${error.message}`, error)
		}
	}



	useEffect(() => {
		if (inputValue === '') {
			setOptions([])
			return undefined
		}

		debouncedFetchMovies(inputValue)

		// Cleanup function to cancel debounced fetch if unmounted
		return () => {
			debouncedFetchMovies.cancel()
		}
	}, [inputValue])



	const handleSelection = (event, value) => {
		getMovieDetails(value.id)
	}



	return (
		<Autocomplete
			id="movie-search"
			options={options}
			getOptionLabel={(option) => (option.title + ' (' + option.release_date.slice(0, 4) + ')')}
			onInputChange={(event, newInputValue) => {
				setInputValue(newInputValue)
			}}
			onChange={handleSelection}
			renderInput={(params) => <TextField {...params} label="" variant="outlined" fullWidth autoFocus />}
			noOptionsText="No movies found"
		/>
	)
}

export default MovieSearch
