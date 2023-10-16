import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'

// Helmet Meta Tags
import MetaTags from './utilities/MetaTags'

// Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Material UI
import CssBaseline from '@mui/material/CssBaseline'

// Components
import PrivateRoutes from './utilities/PrivateRoutes'
import ScrollToTop from './utilities/ScrollToTop'

// Layout
import Layout from './layout/Layout'

// Dashboard
import Dashboard from './pages/Dashboard'

// User
import RegisterUser from './pages/user/RegisterUser'
import CreateUser from './pages/user/CreateUser'
import LoginUser from './pages/user/LoginUser'
import GetAllUsers from './pages/user/GetAllUsers'
import GetSingleUser from './pages/user/GetSingleUser'
import UpdateUser from './pages/user/UpdateUser'

// Project
import CreateProject from './pages/project/CreateProject'
import GetAllProjects from './pages/project/GetAllProjects'
import GetSingleProject from './pages/project/GetSingleProject'
import UpdateProject from './pages/project/UpdateProject'




function App() {
	return (
		<>
			<MetaTags />
			<CssBaseline />
			<Router>
				<ScrollToTop />
					<Routes>

						{/* Public */}
							<Route path="/" element={<LoginUser />} />
							<Route path="/register" element={<RegisterUser />} />


						{/* Logged In Layout */}
						

							{/* Studio Head */}
							<Route element={<PrivateRoutes roles={["studio head"]} />}>
								<Route element={<Layout />}>
									<Route path="/projects/create" element={<CreateProject />} />
									<Route path="/crew/create" element={<CreateUser />} />
								</Route>
							</Route>

							{/* Studio Head, Producer */}
							<Route element={<PrivateRoutes roles={["studio head", "producer"]} />}>
								<Route element={<Layout />}>
									<Route path="/dashboard" element={<Dashboard />} />
									<Route path="/crew" element={<GetAllUsers />} />
									<Route path="/projects" element={<GetAllProjects />} />
								</Route>
							</Route>

							{/* Studio Head, Producer, Director, Writer */}
							<Route element={<PrivateRoutes roles={["studio head", "producer", "director", "writer"]} />}>
								<Route element={<Layout />}>
									<Route path="/crew/:userId" element={<GetSingleUser />} />
									<Route path="/crew/update/:userId" element={<UpdateUser />} />
									<Route path="/projects/:projectId" element={<GetSingleProject />} />
									<Route path="/projects/update/:projectId" element={<UpdateProject />} />
								</Route>
							</Route>

											

						{/* Catch-all */}
						<Route path="*" element={<Navigate to="/" />} />

					</Routes>
			</Router>

			<ToastContainer />
		</>
	)
}

export default App