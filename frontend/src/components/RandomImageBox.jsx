// React
import {useEffect, useState} from 'react'

// Material UI
import {Box} from '@mui/material'





const RandomImageBox = ({fullWidth, login, posterImage, children}) => {
	
	const [randomImage, setRandomImage] = useState(`/images/randomUnsplash/default.jpg`)

	const displayBoxStyle = {
		display: "flex", 
		width: `${login ? "100%" : "50%"}`, 
		backgroundImage: `url(${randomImage})`, 
		minHeight: `${fullWidth ? "100vh" : "auto" }`, 
		backgroundSize: "cover", backgroundPosition: "center center",
	}
	
	const gradientBoxStyle = {
		display: "flex", 
		width: "100%", 
		backgroundColor: `${login ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.0)"}`, 
		minHeight: `${fullWidth ? "100vh" : "auto" }`, 
		padding: "15px 0px",
	}
	
	useEffect(() => {
		if (posterImage) {
			setRandomImage(posterImage)
		} else {
			setRandomImage(`/images/randomUnsplash/${getRandomNumber(1, 20)}.jpg`)
		}
	}, [posterImage])

	const getRandomNumber = (min, max) => {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}



	return (
		<Box sx={displayBoxStyle}>
			<Box sx={gradientBoxStyle}>
				{children}
			</Box>
		</Box>
	)
}
export default RandomImageBox