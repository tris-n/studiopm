// React
import {useEffect, useState} from 'react'

// Material UI
import {Box, Card, CardActionArea, Divider, Stack, Typography} from '@mui/material'
import { styled } from '@mui/material/styles'

// Components
import Spinner from '../../components/Spinner'

// Custom Styles
const ComponentBox = styled(Card)({
	borderRadius: "20px", 
	backgroundColor: "#FFFFF !important", 
	boxShadow: "3px 3px 15px rgba(0,0,0,0.1)",
	cursor: "pointer",
	transition: "all 0.3s ease",
	'&:hover': {
		boxShadow: "2px 4px 6px rgba(0,0,0,0.0)",
	},
})

const flexBoxStyle = {
	height: "160px", 
	padding: {
		tablet: "20px 17px 20px 17px", 
		mobile: "10px", 
	},
}

const typographyStyle = {
	fontSize: {
		tablet: "3rem",
		mobile: "2rem",
	}
}



const TotalBudget = ({projects}) => {

	const [totalBudget, setTotalBudget] = useState(null)
	const [averageBudget, setAverageBudget] = useState(null)

	useEffect(() => {

				const budgetArray = projects.map((project) => project.budget)
				const budgetTotal = budgetArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

				setTotalBudget(Math.round(budgetTotal/1000000))
				setAverageBudget(Math.round(budgetTotal/budgetArray.length/1000000))

	}, [projects])



	if (!projects || !totalBudget || !averageBudget) {
		return <Spinner />
	}



	return (
		<ComponentBox>
			<CardActionArea>

			{/* Display the total number of projects */}
			<Box display="flex" justifyContent="space-evenly" alignItems="center" sx={flexBoxStyle}>
				<Stack alignItems="center">
					<Typography variant="h3" sx={typographyStyle}>${totalBudget}m</Typography>
					<Typography>Total Budget</Typography>
				</Stack>
				<Divider orientation="vertical" flexItem variant="middle" />
				<Stack alignItems="center">
					<Typography variant="h3" sx={typographyStyle}>${averageBudget}m</Typography>
					<Typography>Project Average</Typography>
				</Stack>
			</Box>

			</CardActionArea>
		</ComponentBox>
	)
}
export default TotalBudget