// Material UI
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import {Box} from '@mui/material'
import { useMediaQuery } from '@mui/material'

// https://mui.com/material-ui/customization/theming/
// https://mui.com/material-ui/customization/breakpoints/#custom-breakpoints

const customTheme = createTheme({
	breakpoints: {
		values: {
			mobile: 0,
			tablet: 900,
			laptop: 1200,
			desktop: 1500,
		},
	},
	typography: {
		fontFamily: 'Lato, sans-serif', 
	},
})

const BreakpointGuide = () => {

	const theme = useTheme()

	const isMobile = useMediaQuery(theme.breakpoints.only('mobile'))
	const isTablet = useMediaQuery(theme.breakpoints.only('tablet'))
	const isLaptop = useMediaQuery(theme.breakpoints.only('laptop'))
	const isDesktop = useMediaQuery(theme.breakpoints.only('desktop'))

	return (
		<Box display="flex" justifyContent="flex-start" sx={{backgroundColor: "red", paddingLeft: "0px"}}>
			Guides on: 
			{isMobile === true && " Mobile"}
			{isTablet === true && " Tablet"}
			{isLaptop === true && " Laptop"}
			{isDesktop === true && " Desktop"}
		</Box>
	)
}

const CustomThemeProvider = ({children, guides}) => {
	
	return (
		<ThemeProvider theme={customTheme}>
			{guides && <BreakpointGuide /> }
			{children}
		</ThemeProvider>
	)
}
export default CustomThemeProvider