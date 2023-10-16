// React
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {logout} from '../../features/user/userSlice'

// Material UI
import {AppBar, Container, Slide, Stack, Toolbar, useScrollTrigger} from '@mui/material'
import { styled } from '@mui/material/styles'

// Components
import LogoBox from './header/LogoBox'
import MenuLinkBox from './header/MenuLinkBox'
import AddButton from './header/AddButton'
import MenuButton from './header/MenuButton'

// Custom Styles
const AppBarStyled = styled(AppBar)(({ theme }) => ({
	minHeight: 92,
	display: "flex",
	justifyContent: "center",
	backgroundColor: "#14181C",
	marginBottom: "40px",
}))

const ToolbarBarStyled = styled(Toolbar)({
	// minHeight: 92
})

const HideOnScroll = (props) => {
	const {children, window} = props

	const trigger = useScrollTrigger({
		target: window ? window() : undefined
	})

	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children}
		</Slide>
	)
}



function Header({openMenu, props}) {

	const navigate = useNavigate()
	const dispatch = useDispatch()
	const {user} = useSelector((state) => state.user)

	const onLogout = () => {
		dispatch(logout())
		navigate('/')
	}


	return (
		<>
			<HideOnScroll {...props}>

				<AppBarStyled position='sticky' elevation={0}>
					<ToolbarBarStyled>


						{/* Header content */}
						<Container maxWidth="laptop">
							<Stack direction="row" alignItems="center" justifyContent="space-between">

								{/* Logo */}
								<LogoBox />

								{/* Navigation */}
								<Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>

									<Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{
										display: {mobile: "none", tablet: "inherit"},
										marginRight: 1,
									}}>
										{/* Projects Link */}
										{ (user.role === "studio head" || user.role === "producer") && (
											<MenuLinkBox url="/projects" text="Projects" />
										)}
										
										{/* Users Link */}
										{ (user.role === "studio head" || user.role === "producer") && (
											<MenuLinkBox url="/crew" text="Crew" />
										)}
									</Stack>

									{/* Add + Button */}
									{ user.role === "studio head" && (
										<AddButton />
									)}

									{/* Menu Button */}
									<MenuButton openMenu={openMenu} />

									{/* Drop down menu */}
									{/* <DropDownMenu /> */}
									
								</Stack>				

							</Stack>
						</Container>


					</ToolbarBarStyled>
				</AppBarStyled>

			</HideOnScroll>
			{/* <Toolbar /> */}
		
		</>
	)
}
export default Header