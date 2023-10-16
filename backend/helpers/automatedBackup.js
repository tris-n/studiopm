import asyncHandler from 'express-async-handler'

// Models
import Backup from '../models/Backup.js'
import Project from '../models/Project.js'
import User from '../models/User.js'



// Get the current time
export const timeNow = () => {
	return new Date().toLocaleString()
}



// BACKUP COLLECTIONS - ONLY RUN WHEN HAPPY WITH CURRENT DB STATE
export const backupCollections = asyncHandler( async (req, res) => {

	// Get all collections	
	const projects = await Project.find()	
	const users = await User.find()	


	// Create backup
	const backup = await Backup.create({
		projects,
		users
	})

	if (backup) {
		console.log(`Backup successfully created at ${timeNow()}.`)
	} else {
		throw new Error(`There was an error with backup at ${timeNow()}.`)	
	}

})



// ROLLBACK DATABASE - RUN EVERY 24 HOURS TO ROLLBACK TO GOOD DB STATE
export const automatedRollback = asyncHandler( async (req, res) => {

	console.log(`Automated rollback running.`)

	// run once on start
	await repopulateCollections()

	// then run every 24 hours (start with 2 minutes 120,000)
	// 24 * 60 * 60 * 1000 = 86400000
	let updateFrequency = 24 * 60 * 60 * 1000 // 86,400,000 // 1000 = 1second

	setInterval(() => {

		repopulateCollections()

	}, updateFrequency)

})




// DELETE COLLECTIONS
export const deleteCollections = asyncHandler( async (req, res) => {

	// Delete all collections
	const deletedProjects = await Project.deleteMany({})
	if (deletedProjects) console.log(`Backup deleted projects at ${timeNow()}.`)

	const deletedUsers = await User.deleteMany({})
	if (deletedUsers) console.log(`Backup deleted users at ${timeNow()}.`)

	console.log(`\nDeleted all collections at ${timeNow()}.\n`)

})



// POPULATE COLLECTIONS WITH BACKUP
export const repopulateCollections = asyncHandler( async (req, res) => {

	// get latest backup from backup collection
	const backup = await Backup.findOne().sort({ createdAt: -1 })
	if (backup) console.log(`\nBackup grabbed the backup at ${timeNow()}.\n`)

	// delete the collections
	await deleteCollections()



	// repopulate projects
	for (const project of backup.projects) {
		const savedProject = await Project.create(project)
		if (savedProject) console.log(`Project saved: ${project.title} at ${timeNow()}.`)
	}
	console.log(`\nRepopulated projects at ${timeNow()}.\n`)

	// repopulate users
	for (const user of backup.users) {
		const savedUser = await User.create(user)
		if (savedUser) console.log(`User saved: ${user.name} at ${timeNow()}.`)
	}
	console.log(`\nRepopulated users at ${timeNow()}.\n`)



	// repopulation complete
	console.log(`\nRepopulation completed at ${timeNow()}.\n`)

})