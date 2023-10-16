import asyncHandler from 'express-async-handler'

// Models
import Project from '../models/Project.js'
import User from '../models/User.js'



// @desc 	Create a new project
// @route 	/api/projects/createProject
// @access 	Private
export const createProject = asyncHandler( async (req, res) => {

	// check that user is authorised to create/modify
	const role = req.user.role

	if (!(role === 'studio head' || role === 'producer')) {
		res.status(401)
		throw new Error('Not authorised to create projects')
	}

	// get field info from req.body
	let {
		title, 
		releaseDate, 
		status, 
		budget, 
		director, 
		writer,
		producer,
		poster,
		script,
		trailer,
	} = req.body

	// Validation
	if (!title || !releaseDate || !status || !budget) {
		res.status(400)
		throw new Error('Please include all fields')
	}

	// Find if project already exists
	const projectExists = await Project.findOne({title})

	if (projectExists) {
		res.status(400)
		throw new Error('Project already exists')
	}

	// Get the names of staff and add them to the project
	const [directorInfo, writerInfo, producerInfo] = await Promise.all([
		director ? User.findById(director) : null,
		writer ? User.findById(writer) : null,
		producer ? User.findById(producer) : null,
	])
	
	// Create project
	const project = await Project.create({
		title, 
		releaseDate, 
		status, 
		budget, 
		director: directorInfo, 
		writer: writerInfo,
		producer: producerInfo,
		poster,
		script,
		trailer,
	})

	if (project) {
		res.status(201).json(project)
	} else {
		res.status(400)
		throw new Error('Invalid project data')
	}

})



// @desc 	Get all projects
// @route 	/api/projects/getAllProjects
// @access 	Private
export const getAllProjects = asyncHandler( async (req, res) => {

	const role = req.user.role

	if (role === 'studio head' || role === 'producer' || role === 'director' || role === 'writer') {

		const projects = await Project.find().sort('updatedAt')

		// get the project count for each user and add it to the array
		for (const [index, project] of projects.entries()) {

			// replacing bank entries with zzzzz to help with sorting - will replace them with " " on the frontend
			projects[index].directorName = project.director.name ? project.director.name : "zzzzz"
			projects[index].producerName = project.producer.name ? project.producer.name : "zzzzz"
			projects[index].writerName = project.writer.name ? project.writer.name : "zzzzz"
			
			projects[index].script = project.script ? project.script : "zzzzz"
			projects[index].trailer = project.trailer ? project.trailer : "zzzzz"
			projects[index].poster = project.poster ? project.poster : "zzzzz"
		}
		
		res.status(200).json(projects)

	} else {
		res.status(401)
		throw new Error('Not authorised to view all projects')
	}

})



// @desc 	Get single project
// @route 	/api/projects/getSingleProject
// @access 	Private
export const getSingleProject = asyncHandler( async (req, res) => {

	// Get project id to search
	const project = await Project.findById(req.params.projectId)

	if (!project) {
		res.status(401)
		throw new Error('Project not found')
	}

	res.status(200).json(project)

})



// @desc 	Update single project
// @route 	/api/projects/updateProject
// @access 	Private
export const updateProject = asyncHandler( async (req, res) => {

	// Get project id to update
	const project = await Project.findById(req.params.projectId)

	// Check if project exists
	if (!project) {
		res.status(401)
		throw new Error('Project not found')
	}

	// Check if authorised to update/delete
	const role = req.user.role
	const {director, writer} = project

	if (!( role === 'studio head' || role === 'producer' || req.user.id === director?._id.toString() || req.user.id === writer?._id.toString() )) {
		res.status(401)
		throw new Error('Not authorised to update this project')
	}

	// Get update from req.body
	let update = req.body

	// Get the names of staff and add them to the project
	const [directorInfo, writerInfo, producerInfo] = await Promise.all([
		update.director ? User.findById(update.director) : null,
		update.writer ? User.findById(update.writer) : null,
		update.producer ? User.findById(update.producer) : null,
	])

	if (directorInfo) update.director = directorInfo
	if (writerInfo) update.writer = writerInfo
	if (producerInfo) update.producer = producerInfo

	// Update the project
	const updatedProject = await Project.findByIdAndUpdate(project, update, { new: true, runValidators: true })

	res.status(200).json(updatedProject)

})



// @desc 	Delete single project
// @route 	/api/projects/deleteProject
// @access 	Private
export const deleteProject = asyncHandler( async (req, res) => {

	// Check if authorised to update/delete
	const role = req.user.role
	if (!(role === 'studio head' || role === 'producer')) {
		res.status(401)
		throw new Error('Not authorised to delete this project')
	}

	// Get project id to delete
	const project = await Project.findById(req.params.projectId)

	if (!project) {
		res.status(401)
		throw new Error('Project not found')
	}

	await Project.findByIdAndRemove(project)

	res.status(200).json({ project, success: true })

})