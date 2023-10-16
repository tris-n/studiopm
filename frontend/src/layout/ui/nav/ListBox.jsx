// React
import {NavLink as RouterLink, useNavigate, useLocation} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {logout} from '../../../features/user/userSlice'

// Material UI
import {Box, List, ListItem, ListItemButton, ListItemText} from '@mui/material'
import { styled } from '@mui/material/styles'

// Components
import Spinner from '../../../components/Spinner'

// Custom Styles
const ListItemButtonStyled = styled(ListItemButton)({
	borderRadius: "10px", 
	marginTop: "5px",
})



const ListBox = () => {

	const {pathname} = useLocation()

	const navigate = useNavigate()
	const dispatch = useDispatch()
	const {user} = useSelector((state) => state.user)

	// Links
	const personalLinks = [
		// home
		{
			title: 'Dashboard',
			path: '/dashboard',
			icon: 'house',
			visible: user.role === 'studio head' || user.role === 'producer' ? "initial" : "none"
		},
		// settings
		{
			title: 'Profile',
			path: `/crew/${user._id}`,
			icon: 'three people',
			visible: true,
		},
		{
			title: 'Settings',
			path: `/crew/update/${user._id}`,
			icon: 'pencil',
			visible: true,
		},
	]
	
	const siteLinks = [
		// projects
		{
			title: 'Projects',
			path: '/projects',
			icon: 'film clapper',
			visible: user.role === 'studio head' || user.role === 'producer' ? "initial" : "none"
		},
		// users
		{
			title: 'Crew',
			path: '/crew',
			icon: 'three people',
			visible: user.role === 'studio head' || user.role === 'producer' ? "initial" : "none"
		},
	]

	const onLogout = () => {
		dispatch(logout())
		navigate('/')
	}

	if (!user) {
		return <Spinner />
	}



	return (
		<Box>
			<List>
				{/* Personal Links */}
				{personalLinks.map((link, index) =>(
					<ListItem disablePadding component={RouterLink} to={link.path} key={index} sx={{display: `${link.visible}`}}>
						<ListItemButtonStyled selected={pathname === link.path} >
							<ListItemText sx={{color: "black"}}>{link.title}</ListItemText>
						</ListItemButtonStyled>
					</ListItem>
				))}

				{/* Site Links */}
				{siteLinks.map((link, index) =>(
					<ListItem disablePadding component={RouterLink} to={link.path} key={index} sx={{display: `${link.visible}`}}>
						<ListItemButtonStyled selected={pathname === link.path} >
							<ListItemText sx={{color: "black"}}>{link.title}</ListItemText>
						</ListItemButtonStyled>
					</ListItem>
				))}

				<ListItem disablePadding sx={{pt: 6}} >
					<ListItemButtonStyled sx={{backgroundColor: "rgba(145, 158, 171, 0.12)"}} onClick={onLogout}>
						<ListItemText sx={{color: "black"}}>Logout</ListItemText>
					</ListItemButtonStyled>
				</ListItem>

			</List>
		</Box>
	)
}
export default ListBox