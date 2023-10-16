import mongoose from 'mongoose'



const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a name']
	},
	email: {
		type: String,
		required: [true, 'Please add an email'],
		unique: true
	},
	password: {
		type: String,
		required: [true, 'Please add a password']
	},
	role: {
		type: String,
		required: [true, 'Please select a role'],
		enum: ['studio head', 'producer', 'writer', 'director'],
	},
	projects: {
		type: Array,
	},
	projectsCount: {
		type: Number
	},
	deliverablesNeeded: {
		type: Number
	},
	deliverableType: {
		type: String
	},
}, {
	timestamps: true
})



const User = mongoose.model('User', userSchema)
export default User