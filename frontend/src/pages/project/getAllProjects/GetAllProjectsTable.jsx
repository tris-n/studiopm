// React
import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

// Redux
import {useSelector, useDispatch} from 'react-redux'
import {getAllProjects, deleteProject, deleteProjects} from '../../../features/project/projectSlice'

// Toastify
import {toast} from 'react-toastify'

// React Modal
import Modal from 'react-modal'

// DayJS
import dayjs from 'dayjs'

// Material UI
import { Avatar, Box, Button, Card, Checkbox, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Popover, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Tabs, Tab, Toolbar, Tooltip, Typography } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { visuallyHidden } from '@mui/utils'

// Logo
import tickSymbol from '../../../images/accept.png'

// Components
import Spinner from '../../../components/Spinner'

const TickSymbol = () => {
	return (
		<Avatar src={tickSymbol} alt="" width="45px"/>
	)
}


// Table Sorting Functions
function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1
	}
	if (b[orderBy] > a[orderBy]) {
		return 1
	}
	return 0
}

function getComparator(order, orderBy) {
	return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy)
}

function applySortFilter(array, comparator, query, statusSort) {

	let stabilizedThis = array

	if (statusSort !== "all") {
		stabilizedThis = array.filter((project) => project.status === statusSort)
	}

	stabilizedThis = stabilizedThis.map((el, index) => [el, index])
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0])
		if (order !== 0) {
			return order
		}
		return a[1] - b[1]
	})
	if (query) {
		// this fixes the search bar sorting
		let queryList = stabilizedThis.filter((project) => {
			return project[0].title.toLowerCase().indexOf(query.toLowerCase()) !== -1
		})
		return queryList.map((el) => el[0])
	}
	return stabilizedThis.map((el) => el[0])
}



// Table Head
const headCellsOverview = [
	{
		id: 'title',
		number: false,
		disablePadding: false,
		label: 'Title',
	},
	{
		id: 'status',
		number: false,
		disablePadding: false,
		label: 'Status',
	},
	{
		id: 'budget',
		number: true,
		disablePadding: false,
		label: 'Budget',
	},
	{
		id: 'releaseDate',
		number: false,
		disablePadding: false,
		label: 'Release Date',
	},
]

const headCellsStaff = [
	{
		id: 'title',
		number: false,
		disablePadding: false,
		label: 'Title',
	},
	{
		id: 'directorName',
		number: false,
		disablePadding: false,
		label: 'Director',
	},
	{
		id: 'producerName',
		number: false,
		disablePadding: false,
		label: 'Producer',
	},
	{
		id: 'writerName',
		number: false,
		disablePadding: false,
		label: 'Writer',
	},
]

const headCellsDeliverables = [
	{
		id: 'title',
		number: false,
		disablePadding: false,
		label: 'Title',
	},
	{
		id: 'trailer',
		number: false,
		disablePadding: false,
		label: 'Trailer',
	},
	{
		id: 'poster',
		number: false,
		disablePadding: false,
		label: 'Poster',
	},
	{
		id: 'script',
		number: false,
		disablePadding: false,
		label: 'Script',
	},
]



const CustomTableHead = (props) => {

	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, tabValue } = props

	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property)
	}

	let headCells = []

	if (tabValue === "overview") headCells = headCellsOverview
	if (tabValue === "staff") headCells = headCellsStaff
	if (tabValue === "deliverables") headCells = headCellsDeliverables



	return (
		<TableHead sx={{backgroundColor: "#EAEAEC"}}>
			<TableRow>
				
				<TableCell padding="checkbox">
					<Checkbox 
						color="primary"
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							'aria-label': 'select all projects',
						}}
					/>
				</TableCell>

				{headCells.map((headCell) => (
					<TableCell 
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}

				<TableCell sx={{ width: "30px"}}></TableCell>
			</TableRow>
		</TableHead>
	)
}



// Table ToolBar
const CustomTableToolBar = (props) => {

	const {user} = useSelector((state) => state.user)

	const {numSelected, filterName, onFilterName, statusSort, handleStatusSort, openModal} = props

	if (!user) {
		return <Spinner />
	}



	return (
		<Toolbar sx={{
			pt: 2,
			pb: 2,
			pl: { sm: 2 },
			pr: { xs: 1, sm: 2 },
			...(numSelected > 0 && {
				bgcolor: "#D2E9FB"
				})
			}}
		>

			{numSelected > 0 ? (
				<Typography
					sx={{ flex: '1 1 100%' }}
					color="inherit"
					variant="subtitle1"
					component="div"
				>
					{numSelected} selected
				</Typography>
			) : (
				<FormControl sx={{width: "250px", mr: 2}}>
					<InputLabel id="status-select-label">Status</InputLabel>
					<Select 
						labelId="status-select-label" 
						id="status-select"
						value={statusSort}
						label="Status"
						onChange={handleStatusSort}
					>
						<MenuItem value={"all"}>All</MenuItem>
						<MenuItem value={"Planned"}>Planned</MenuItem>
						<MenuItem value={"In Production"}>In Production</MenuItem>
						<MenuItem value={"Released"}>Released</MenuItem>
					</Select>
				</FormControl>
			)}

			{numSelected > 0 ? user.role === 'studio head' && (
				<Tooltip title="Delete">
					<IconButton onClick={() => openModal("many")}>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
				<OutlinedInput 
					fullWidth
					value={filterName}
					onChange={onFilterName}
					placeholder="Search projects..."
				/>
			)}

		</Toolbar>
	)
}



// Table Body
const GetAllProjectsTable = () => {

	const {user} = useSelector((state) => state.user)
	const {allProjects} = useSelector((state) => state.projects)

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const [open, setOpen] = useState(null)
	const [currentId, setCurrentId] = useState(null)

	const [modalIsOpen, setIsOpen] = useState(false)
	const [deletionType, setDeletionType] = useState(null)

	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('title')
	const [selected, setSelected] = useState([])
	const [filterName, setFilterName] = useState('')
	const [page, setPage] = useState(0)
	const [dense, setDense] = useState(false)
	const [rowsPerPage, setRowsPerPage] = useState(10)

	const [statusSort, setStatusSort] = useState('all')
	const [tabValue, setTabValue] = useState("overview")

	// Modal settings
	const openModal = (deletionType) => {
		setOpen(null)
		setDeletionType(deletionType)
		setIsOpen(true)
	}
	
	const closeModal = () => {
		setDeletionType(null)
		setIsOpen(false)
	}

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc'
		setOrder(isAsc ? 'desc' : 'asc')
		setOrderBy(property)
	}

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = allProjects.map((n) => n._id)
			setSelected(newSelected)
			return
		}
		setSelected([])
	}

	const handleClick = (event, _id) => {
		const selectedIndex = selected.indexOf(_id)

		let newSelected = []

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, _id)
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1),
			)
		}

		setSelected(newSelected)
	}

	const handleOpenMenu = (event, id) => {
		setOpen(event.currentTarget)
		setCurrentId(id)
	}

	const handleCloseMenu = () => {
		setOpen(null)
	}

	const handleMenuEditClick = () => {
		navigate(`/projects/update/${currentId}`)
	}

	const handleMenuDeleteClick = () => {
		
		setIsOpen(false)

		dispatch(deleteProject(currentId))
			.unwrap()
			.then(() => {
				toast.success(`Successfully deleted the project.`)
				setSelected([])
				setPage(0)
				dispatch(getAllProjects())
			})
			.catch(toast.error)
	}

	const handleDeleteProjects = () => {

		setIsOpen(false)

		dispatch(deleteProjects(selected))
			.unwrap()
			.then(() => {
				toast.success(`Successfully deleted the project${selected.length > 1 ? 's' : ""}.`)
				setSelected([])
				setPage(0)
				dispatch(getAllProjects())
			})
			.catch(toast.error)
		
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	}	

	const handleFilterByName = (event) => {
		setPage(0)
		setFilterName(event.target.value)
	}

	const handleStatusSort = (event) => {
		setPage(0)
		setStatusSort(event.target.value)
	}

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue)
		setPage(0)
	}

	const handleRowClick = (event, id) => {
		if (event.target.tagName !== "INPUT" && event.target.tagName !== "svg") {
			navigate(`/projects/${id}`)
		}
	}

	const isSelected = (_id) => selected.indexOf(_id) !== -1

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - allProjects.length) : 0

	const filteredProjects = applySortFilter(allProjects, getComparator(order, orderBy), filterName, statusSort)

	const isNotFound = !filteredProjects.length && !!filterName

	if (!allProjects || !user) {
		return <Spinner />
	}



	return (
		<>
			<Card sx={{borderRadius: "20px", maxWidth: `calc(100vw - 32px)`}}>	

				<Box>
					<Tabs value={tabValue} onChange={handleTabChange}>
						<Tab label="Overview" value="overview" />
						<Tab label="Staff" value="staff" />
						<Tab label="Deliverables" value="deliverables" />
					</Tabs>
				</Box>
				
				<CustomTableToolBar 
					numSelected={selected.length} 
					filterName={filterName} 
					onFilterName={handleFilterByName} 
					statusSort={statusSort} 
					setStatusSort={setStatusSort} 
					handleStatusSort={handleStatusSort}
					handleDeleteProjects={handleDeleteProjects}
					openModal={openModal}
				/>

				<TableContainer>
					<Table sx={{width: {mobile: "max-content", tablet: "100%"}}}>

						<CustomTableHead 
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={allProjects.length}
							tabValue={tabValue}
						/>

						<TableBody>

							{filteredProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((project, index) => {

								const isItemSelected = isSelected(project._id)
								const labelId = `enhanced-table-checkbox-${index}`

								return (
									
									
									<TableRow
										hover
										role="checkbox"
										aria-checked={isItemSelected}
										tabIndex={-1}
										key={project._id}
										selected={isItemSelected}
										sx={{ cursor: "pointer" }}
									>

										<TableCell padding="checkbox">
											<Checkbox
												onClick={(event) => handleClick(event, project._id)}
												color="primary"
												checked={isItemSelected}
												inputProps={{'aria-labelledby': labelId,}}
											/>
										</TableCell>

										<TableCell
											component="th"
											id={labelId}
											scope="row"
											onClick={(event) => handleRowClick(event, project._id)}
										>
											<Stack direction="row" alignItems="center">
												{(project.poster !== "zzzzz") ? (
													<Box sx={{
														mr: 1, 
														borderRadius: "10px", 
														width: "60px",
														height: "90px", 
														backgroundImage: `url(${project.poster?.url})`,
														backgroundRepeat: 'no-repeat',
														backgroundPosition: 'center center',
														backgroundSize: 'cover',
													}}/>
												) : (
													<Box sx={{
														mr: 1, 
														borderRadius: "10px", 
														width: "60px",
														height: "90px", 
														border: "2px dashed lightGray"
													}}/>
												)}
												<strong>{project.title}</strong>
											</Stack>
										</TableCell>

										{ tabValue === "overview" && (<>
											<TableCell align="left" onClick={(event) => handleRowClick(event, project._id)}>{project.status}</TableCell>
											<TableCell align="left" onClick={(event) => handleRowClick(event, project._id)}>${project.budget.toLocaleString()}</TableCell>
											<TableCell align="left" onClick={(event) => handleRowClick(event, project._id)}>{dayjs(new Date(project?.releaseDate).toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('YYYY-MM-DD')}</TableCell>
										</>)}

										{ tabValue === "staff" && (<>
											<TableCell onClick={(event) => handleRowClick(event, project._id)}>{project.directorName === "zzzzz" ? "" : <Stack direction="row" alignItems="center">
												<Avatar src={`/images/avatars/${project.directorName.slice(0,1).toLowerCase()}.png`} alt="" width="45px" sx={{mr: 1}}/>
												{project.directorName}
											</Stack>}</TableCell>
											<TableCell onClick={(event) => handleRowClick(event, project._id)}>{project.producerName === "zzzzz" ? "" : <Stack direction="row" alignItems="center">
												<Avatar src={`/images/avatars/${project.producerName.slice(0,1).toLowerCase()}.png`} alt="" width="45px" sx={{mr: 1}}/>
												{project.producerName}
											</Stack>}</TableCell>
											<TableCell onClick={(event) => handleRowClick(event, project._id)}>{project.writerName === "zzzzz" ? "" : <Stack direction="row" alignItems="center">
												<Avatar src={`/images/avatars/${project.writerName.slice(0,1).toLowerCase()}.png`} alt="" width="45px" sx={{mr: 1}}/>
												{project.writerName}
											</Stack>}</TableCell>
										</>)}

										{ tabValue === "deliverables" && (<>
											<TableCell onClick={(event) => handleRowClick(event, project._id)}>{project.trailer === "zzzzz" ? "" : <TickSymbol />}</TableCell>
											<TableCell onClick={(event) => handleRowClick(event, project._id)}>{(project.poster.name && project.poster.name !== "zzzzz") ? <TickSymbol /> : ""}</TableCell>
											<TableCell onClick={(event) => handleRowClick(event, project._id)}>{(project.script.name && project.script.name !== "zzzzz") ? <TickSymbol /> : ""}</TableCell>
										</>)}

										<TableCell align="right">
											<IconButton onClick={(event) => handleOpenMenu(event, project._id)}>
												<MoreVertIcon />
											</IconButton>
										</TableCell>

									</TableRow>
									
								)

							})}

							{emptyRows > 0 && (
								<TableRow style={{height: (dense ? 33 : 53) * emptyRows,}}>
									<TableCell colSpan={7} />
								</TableRow>
							)}
							
						</TableBody>

						{isNotFound && (
							<TableBody>
								<TableRow>
									<TableCell align="center" colSpan={9} sx={{ py: 3 }}>
										<Paper
											sx={{
											textAlign: 'center',
											}}
										>
											<Typography variant="h6" paragraph>
												Not found
											</Typography>

											<Typography variant="body2" sx={{pb: 2}}>
												No results found for &nbsp;
												<strong>&quot;{filterName}&quot;</strong>.
												<br /> Try checking for typos or using complete words.
											</Typography>
										</Paper>
									</TableCell>
								</TableRow>
							</TableBody>
						)}

					</Table>
				</TableContainer>

				<TablePagination 
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={filteredProjects.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>

			</Card>

			{/* Edit Menu PopUp */}
			<Popover
				open={Boolean(open)}
				anchorEl={open}
				onClose={handleCloseMenu}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				PaperProps={{
					sx: {
						p: 1,
						width: 140,
						'& .MuiMenuItem-root': {
							px: 1,
							typography: 'body2',
							borderRadius: 0.75,
						},
					},
				}}
			>
				<MenuItem onClick={handleMenuEditClick}>
					<EditIcon /> Edit
				</MenuItem>

				{ user.role === 'studio head' && (
					<MenuItem onClick={() => openModal("single")} sx={{ color: 'error.main' }}>
						<DeleteIcon /> Delete
					</MenuItem>
				)}
			</Popover>

			{/* Delete modal */}
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={{
					overlay: {
						zIndex: 1000,
						backgroundColor: "rgba(0,0,0,0.4)"
					},
					content: {
						backgroundColor: "#f2f4f8",
						borderRadius: "1rem",
						display: "flex",
						flexDirection: "column",
						height: "110px",
						maxWidth: "400px",
						margin: "auto",
						overflow: "hidden"
					}
				}}
			>
				<Typography sx={{mb: 2, fontWeight: "bold"}}>
					Are you sure you want to delete?
				</Typography>		
				
				<Stack direction="row" justifyContent="flex-end">
					<Button onClick={closeModal}>Cancel</Button>

					{deletionType === 'single' ? (
						<Button onClick={handleMenuDeleteClick} color="error">Delete</Button>
					):(						
						<Button onClick={handleDeleteProjects} color="error">Delete</Button>
					)}

				</Stack>
			</Modal>

		</>
	)
}

export default GetAllProjectsTable