// Helmet-Async
import { Helmet } from 'react-helmet-async'

const MetaTags = ({title, description}) => {

	return (
		<Helmet>
			<title>StudioPM {title ? ` - ${title}` : ''}</title>
		</Helmet>
	)
}
export default MetaTags