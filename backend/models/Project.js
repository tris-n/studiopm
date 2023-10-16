import mongoose from 'mongoose'



const projectSchema = mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Please add a title'],
		unique: true,
	},
	releaseDate: {
		type: Date,
		required: [true, 'Please add a release date'],
	},
	status: {
		type: String,
		required: [true, 'Please select a status'],
		enum: ['Planned', 'In Production', 'Released'],
	},
	budget: {
		type: Number,
		required: [true, 'Please add a release date'],
	},
	director: {
		_id: {
			type: String,
			required: false,
		},
		name: {
			type: String,
			required: false,
		}
	},
	writer: {
		_id: {
			type: String,
			required: false,
		},
		name: {
			type: String,
			required: false,
		}
	},
	producer: {
		_id: {
			type: String,
			required: false,
		},
		name: {
			type: String,
			required: false,
		}
	},
	directorName: {
		type: String,
	},
	producerName: {
		type: String,
	},
	writerName: {
		type: String,
	},
	poster: {
		type: Object,
		required: false,
	},
	script: {
		type: Object,
		required: false,
	},
	trailer: {
		type: String,
		required: false,
	},
}, {
	timestamps: true
})



const Project = mongoose.model('Project', projectSchema)
export default Project