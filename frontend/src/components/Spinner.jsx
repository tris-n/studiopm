import { motion } from 'framer-motion'

const loadingSpinner = {
	width: "64px",
	height: "64px",
	border: "8px solid",
	borderColor: "#000 transparent #555 transparent",
	borderRadius: "50%",
}


function Spinner() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5, delay: 0 }}
			style={{
				position: 'fixed',
				top: '0',
				right: '0',
				bottom: '0',
				left: '0',
				zIndex: '5000',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<motion.div 
				animate={{rotate: [0, 360]}}
				transition={{duration: 1.2, ease: "linear", repeat: Infinity}}
			>
				<div style={loadingSpinner}></div>
			</motion.div>

		</motion.div>
	)
}
export default Spinner