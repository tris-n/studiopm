import mongoose from 'mongoose'



const backupSchema = mongoose.Schema({
	projects: {
		type: Object,
		required: [true, 'Please add projects to the backup object.']
	},
	users: {
		type: Object,
		required: [true, 'Please add users to the backup object.']
	},
}, {
	timestamps: true
})



const Backup = mongoose.model('Backup', backupSchema)
export default Backup