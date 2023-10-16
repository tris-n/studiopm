import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Models
import User from '../models/User.js'
import Project from '../models/Project.js'

// Generate token
const generateToken = (id) => {
	return jwt.sign({id}, process.env.JWT_SECRET, {
		expiresIn: '30d'
	})
}



// @desc 	Register a new user
// @route 	/api/users/register
// @access 	Public
export const registerUser = asyncHandler( async (req, res) => {

	const {name, email, password, role} = req.body

	// Validation
	if (!name || !email || !password || !role) {
		res.status(400)
		throw new Error('Please include all fields')
	}

	// Find if user already exists
	const userExists = await User.findOne({email})

	if (userExists) {
		res.status(400)
		throw new Error('User already exists')
	}

	// Hash password
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)

	// Create user
	const user = await User.create({
		name,
		email,
		password: hashedPassword,
		role,
	})

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			token: generateToken(user._id),
		})
	} else {
		res.status(400)
		throw new Error('Invalid user data')
	}

})



// @desc 	Login a user
// @route 	/api/users/login
// @access 	Public
export const loginUser = asyncHandler( async (req, res) => {

	const {email, password} = req.body

	const user = await User.findOne({email})
	
	// Check user and passwords match
	if (user && (await bcrypt.compare(password, user.password))) {
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			website: process.env.WEBSITE,
			token: generateToken(user._id),
		})
	} else {
		res.status(401)
		throw new Error('Invalid credentials')
	}
})



// @desc 	Get all users
// @route 	/api/users/getAllUsers
// @access 	Private
export const getAllUsers = asyncHandler( async (req, res) => {

	const role = req.user.role

	if (role === 'studio head' || role === 'producer' || role === 'director' || role === 'writer') {

		const [users, projects] = await Promise.all([
			await User.find().select('-password -createdAt -updatedAt').sort({ name: 1 }),
			await Project.find()
		])
		
		for (const user of users) {

			let projectsCount

			if (user.role === 'studio head') {
				projectsCount = projects.length
			} else {
				projectsCount = projects.filter((project) => project[`${user.role}`]?._id == user._id ).length
			}

			user.projectsCount = projectsCount

		}
		
		res.status(200).json(users)

	} else {
		res.status(401)
		throw new Error('Not authorised to view all users')
	}


})



// @desc 	Get single user
// @route 	/api/users/getSingleUser
// @access 	Private
export const getSingleUser = asyncHandler( async (req, res) => {

	// Get user id to search
	let user = await User.findById(req.params.userId)
		.select('-password -createdAt -updatedAt')

	if (!user) {
		res.status(401)
		throw new Error('User not found')
	}

	// Get projects that user is assigned to
	const projects = await Project.find({[`${user.role}._id`]: user._id}).sort({ title: 1 })

	// Get project count
	const projectsCount = projects.length

	// Get deliverables needed
	let deliverableType

	if (user.role === "director") deliverableType = "trailer"
	if (user.role === "producer") deliverableType = "poster"
	if (user.role === "writer") deliverableType = "script"

	let deliverablesNeeded = projects.filter((project) => !project[deliverableType])

	// add details to user object
	user.projects = projects
	user.projectsCount = projectsCount
	user.deliverablesNeeded = deliverablesNeeded.length
	user.deliverableType = deliverableType

	res.status(200).json(user)

})



// @desc 	Update a single user
// @route 	/api/users/updateUser
// @access 	Private
export const updateUser = asyncHandler( async (req, res) => {

	// check if authorised to update/delete
	const role = req.user.role
	if (!(role === 'studio head' || role === 'producer' || req.user.id === req.params.userId)) {
		res.status(401)
		throw new Error('Not authorised to update this user')
	}

	// Get user id to update
	const user = await User.findById(req.params.userId)
	const update = {
		name: req.body.name,
		email: req.body.email,
		role: req.body.role,
	}

	if (!user) {
		res.status(401)
		throw new Error('User not found')
	}

	// Update the User document
	const updatedUser = await User.findByIdAndUpdate(user, update, { new: true, runValidators: true })

	// Change the name of the user in the projects they are in
	await Project.updateMany({[`${user.role}._id`]: user._id}, { [`${user.role}.name`]: req.body.name })



	// If user role has changed, remove user from assigned projects
	if (req.body.role !== user.role) {

		let theRole = `${user.role}._id`

		// Update projects
		await Project.updateMany({[theRole]: user._id}, { [user.role]: '' })

	}

	res.status(200).json(updatedUser)

})



// @desc 	Delete a single user
// @route 	/api/users/deleteUser
// @access 	Private
export const deleteUser = asyncHandler( async (req, res) => {

	// check if authorised to update/delete
	const role = req.user.role
	if (!(role === 'studio head' || role === 'producer' || req.user.id === req.params.userId)) {
		res.status(401)
		throw new Error('Not authorised to delete this user')
	}

	// Get user id to update
	const user = await User.findById(req.params.userId)

	if (user.role === 'studio head') {
		res.status(401)
		throw new Error('Deleting the studio head is disabled for this demo.')
	}

	if (!user) {
		res.status(401)
		throw new Error('User not found')
	}

	await User.findByIdAndRemove(user)

	// Update projects
	await Project.updateMany({[`${user.role}._id`]: user._id}, { [user.role]: '' })

	res.status(200).json({ user, success: true })

})