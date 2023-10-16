// React
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

// Material UI
import {Box} from '@mui/material'
import { styled } from '@mui/material/styles'

// Components
import Header from "./ui/Header"
import Nav from "./ui/Nav"

// Custom Styles
const ContentBox = styled(Box)({
	display: "flex"
})

const Main = styled(Box)({
	flexGrow: 1,
})



const Layout = () => {

	const [isOpen, setIsOpen] = useState(false)

	const openMenu = () => {
		setIsOpen(true)
	}

	const closeMenu = () => {
		setIsOpen(false)
	}

	return (
		<Box>
			
			<Header openMenu={openMenu} />

			<ContentBox sx={{paddingBottom: "20px"}}>
				<Nav isOpen={isOpen} closeMenu={closeMenu} />
				
				<Main>
					<Outlet />
				</Main>
			</ContentBox>

		</Box>
	)
}

export default Layout