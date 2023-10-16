// Material UI
import {IconButton} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'



const MenuButton = ({openMenu}) => {

	return (
		<IconButton 
			color="inherit"
			sx={{mr: 1}}
			onClick={openMenu}
		>
			<MenuIcon />
		</IconButton>
	)
}
export default MenuButton