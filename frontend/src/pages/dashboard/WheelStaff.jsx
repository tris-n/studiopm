// React
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useDispatch} from 'react-redux'

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






const WheelStaff = ({users}) => {

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const {checkError} = useErrorHandling()

	const handleComponentClick = (e) => {
		navigate(`/crew/`)
	}

	useEffect(() => {

		let studioHeadCount = users.filter((user) => user.role === "studio head").length
		let directorCount = users.filter((user) => user.role === "director").length
		let producerCount = users.filter((user) => user.role === "producer").length
		let writerCount = users.filter((user) => user.role === "writer").length

		setChartSeries([studioHeadCount, directorCount, producerCount, writerCount])

		setChartOptions({
			...chartOptions,
			tooltip: {
				style: {
					color: "#FFFFFF"
				},
				y: {
					formatter: function (value, {series, seriesIndex, dataPointIndex, w}) {
						return `${Math.round(value / users.length * 100)}%`
					}
				}
			},
		})

	}, [users])



	// Chart Data
	const [chartOptions, setChartOptions] = useState({
		labels: ['Studio Heads', 'Directors', 'Producers', 'Writers'],
		legend: {
			position: "bottom",
			itemMargin: {
				horizontal: 3,
				vertical: 0
			},
			fontSize: '11px',
		},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: true,
						total: {
							show: true,
							showAlways: true,
							label: "Staff"
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

	if (!users || !chartOptions || !chartSeries) {
		return <Spinner />
	}



	return (
		<ComponentBox onClick={handleComponentClick}>
			<CardActionArea>

			{/* Display the total number of staff */}
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
export default WheelStaff