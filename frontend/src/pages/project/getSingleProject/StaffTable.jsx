// Material UI
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

// Components
import StaffRow from './StaffRow'
import NoRow from './NoRow'



const StaffTable = (props) => {
	
	const { director, producer, writer } = props



	return (

		<TableContainer component={Card} sx={{borderRadius: "20px"}}>
			<Table>

				{/* Header */}
				<TableHead sx={{backgroundColor: "#EAEAEC"}}>
					<TableRow>
						<TableCell>Role</TableCell>
						<TableCell>Name</TableCell>
						<TableCell sx={{display: {mobile: "none", tablet: "table-cell"}}}>Deliverables</TableCell>
						<TableCell> </TableCell>
					</TableRow>
				</TableHead>

				{/* Body */}
				<TableBody>

					{director ? <StaffRow staff="director" deliverable={"trailer"} /> : <NoRow staff="director" />}
					{producer ? <StaffRow staff="producer" deliverable={"poster"} /> : <NoRow staff="producer" />}
					{writer ? <StaffRow staff="writer" deliverable={"script"} /> : <NoRow staff="writer" />}

				</TableBody>

			</Table>
		</TableContainer>

	)
}
export default StaffTable