// Material UI
import {Box} from '@mui/material'
import { styled } from '@mui/material/styles'

// Components
import AccountBox from "./AccountBox"
import ListBox from "./ListBox"

// Custom Styles
const ContentBox = styled(Box)({
	display: "flex",
	flexDirection: "column",
	padding: "0px 20px"
})



const MenuContent = ({closeMenu}) => {
	
	return (
		<ContentBox onClick={closeMenu}>

			{/* <LogoBox /> */}

			<AccountBox />

			<ListBox />

			{/* <LogOutButton /> */}

		</ContentBox>
	)
}
export default MenuContent