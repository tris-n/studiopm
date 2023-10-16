// React
import { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useDispatch} from 'react-redux'

// Error Handling
import useErrorHandling from '../../utilities/useErrorHandling'

// Material UI
import {Box, Typography} from '@mui/material'

// Swiper
import { Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectFade } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import 'swiper/css/a11y'

// Components
import Spinner from '../../components/Spinner'



const ProjectCarousel = ({projects}) => {

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const {checkError} = useErrorHandling()

	const [topProjects, setProjects] = useState(null)

	useEffect(() => {
			
		let filteredProjects = projects.filter((project) => (project.poster)).slice(-3)
		setProjects(filteredProjects)

	}, [projects])


	if (!projects || !topProjects) {
		return <Spinner />
	}

	return (
		<Box display="flex" sx={{backgroundColor: "#E4EEF9", borderRadius: "20px", height: "100%", overflow: "hidden", cursor: "pointer"}}>			

			<Swiper modules={[EffectFade, Navigation, Pagination, Scrollbar, A11y, Autoplay]} slidesPerView={1} pagination={{clickable: true}} navigation style={{minHeight: "100px"}} autoplay={{delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true}} effect={"fade"}>
				{topProjects.map((singleProject) => (
					<SwiperSlide key={singleProject._id} onClick={() => navigate(`/projects/${singleProject._id}`)}>

						<Box display="flex" alignItems="flex-end" justifyContent="flex-start" sx={{background: `url(${singleProject.poster.url}) center no-repeat`, backgroundSize: 'cover', width: "100%", height:"100%", color: "white"}}>
								
								<Box sx={{filter: "drop-shadow(3px 3px 3px rgba(0,0,0,0.8))", backgroundColor: "rgba(0,0,0,0.0)", margin: "0px 0px 20px 20px"}}>

									<Typography>Latest Project:</Typography>
									<Typography variant="h5"><strong>{singleProject.title}</strong></Typography>
								</Box>

						</Box>

					</SwiperSlide>
				))}
			</Swiper>

		</Box>
	)
}
export default ProjectCarousel