// React
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'

// Material UI
import {Box, Divider, IconButton, MenuItem, Popover} from '@mui/material'
import { styled } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add';

const menuItemColor = "#CBE6E3"

const CustomMenuItemTop = styled(MenuItem)({
	"&:hover": {
		backgroundColor: `${menuItemColor} !important`,
		borderRadius: "5px 5px 0px 0px",
	}
})

const CustomMenuItemBottom = styled(MenuItem)({
	"&:hover": {
		backgroundColor: `${menuItemColor} !important`,
		borderRadius: "0px 0px 5px 5px",
	}
})


const AddButton = () => {

	const navigate = useNavigate()

	const [isOpen, setIsOpen] = useState(false)
	const [arrowColor, setArrowColor] = useState(true)

	const WhiteUpArrow = styled(Box)({
		width: "11px", 
		height: "11px", 
		backgroundColor: `${arrowColor ? "white" : menuItemColor}`,
		position: "absolute",
		top: "-6px",
		right: "21px",
		borderRadius: "20%",
		transform: "rotate(-135deg)",
		zIndex: 2,
	})

	const openMenu = (event) => {
		setIsOpen(event.currentTarget)
	}

	const closeMenu = () => {
		setIsOpen(false)
	}

	const menuItemEnter = () => {
		setArrowColor(false)
	}
	
	const menuItemLeave = () => {
		setArrowColor(true)
	}

	const menuClick = (destination) => {
		setIsOpen(false)

		if (destination === 'project') {
			navigate('/projects/create')
		}
		
		if (destination === 'crew') {
			navigate('/crew/create')
		}
	}



	return (
		<>
			<IconButton onClick={openMenu}
				sx={{
					p: 0,
					backgroundColor: "rgba(255, 255, 255, 0.1) !important",
					color: "white",
					transition: "0.2s ease-in-out",
					'&:hover': {
						backgroundColor: "rgba(60, 236, 238, 0.8) !important",
						color: "black",
					},
					width: "40px",
					height: "40px",
					...(isOpen && {
						'&:before': {
							zIndex: 1,
							content: "''",
							width: '100%',
							height: '100%',
							borderRadius: '50%',
							position: 'absolute',
							bgcolor: 'rgba(0, 0, 0, 0.55)',
						}
					})
				}}
			>
				<AddIcon />
			</IconButton>
		
			<Popover
				open={Boolean(isOpen)}
				onClose={closeMenu}
				anchorEl={isOpen}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				PaperProps={{
					sx: {
						p: 0,
						ml: 0.75,
						overflow: "visible",
					}
				}}
			>
				<WhiteUpArrow />

				<Box sx={{ my: 0, px: 0 }}>
					<CustomMenuItemTop onClick={() => menuClick("project")} onMouseEnter={menuItemEnter} onMouseLeave={menuItemLeave}>
						New Project
					</CustomMenuItemTop>
				</Box>

				<Divider sx={{ borderStyle: 'dashed' }} />

				<Box sx={{ my: 0, px: 0 }}>
					<CustomMenuItemBottom onClick={() => menuClick("crew")}>
						New Crew
					</CustomMenuItemBottom>
				</Box>

			</Popover>
		
		</>
	)
}
export default AddButton