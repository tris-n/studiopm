// React
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Card, CardActionArea, Stack} from '@mui/material'
import { styled } from '@mui/material/styles'

// Components
import Spinner from '../../components/Spinner'

// Apex Charts
import Chart from "react-apexcharts"

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






const WheelDeliverables = ({projects}) => {

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const {checkError} = useErrorHandling()

	const {allProjects} = useSelector((state) => state.projects)

	const handleComponentClick = (e) => {
		navigate(`/projects/`)
	}


	useEffect(() => {

		let posterCount = projects.filter((project) => project.poster !== "zzzzz").length
		let scriptCount = projects.filter((project) => project.script !== "zzzzz").length
		let trailerCount = projects.filter((project) => project.trailer !== "zzzzz").length

		setChartSeries([posterCount, scriptCount, trailerCount])

		setChartOptions({
			...chartOptions,
			tooltip: {
				style: {
					color: "#FFFFFF"
				},
				y: {
					formatter: function (value, {series, seriesIndex, dataPointIndex, w}) {
						return `${Math.round(value / projects.length * 100)}%`
					}
				}
			},
		})

	}, [projects])



	// Chart Data
	const [chartOptions, setChartOptions] = useState({
		labels: ['Posters', 'Scripts', 'Trailers'],
		legend: {position: "bottom"},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: true,
						total: {
							show: true,
							showAlways: true,
							label: "Deliverables"
						}
					}
				}
			}
		},
		dataLabels: {
			formatter: function (value, {seriesIndex, dataPointIndex, w}) {
				return w.config.series[seriesIndex]
			}
		},
		theme: {
			palette: "palette4"
		}
	})

	const [chartSeries, setChartSeries] = useState([])

	if (!projects || !chartOptions || !chartSeries) {
		return <Spinner />
	}



	return (
		<ComponentBox onClick={handleComponentClick}>
			<CardActionArea>

			{/* Display the total number of projects */}
			<Box display="flex" justifyContent="center" alignItems="center" sx={{height: "260px"}}>
				<Stack alignItems="center">
					<Chart 
						options={chartOptions}
						series={chartSeries}
						type="donut"
						width="300px"
					/>
				</Stack>
			</Box>

			</CardActionArea>
		</ComponentBox>
	)
}
export default WheelDeliverables