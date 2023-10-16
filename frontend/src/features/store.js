import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import projectReducer from './project/projectSlice'



export const store = configureStore({
	reducer: {
		user: userReducer,
		projects: projectReducer,
	},
})