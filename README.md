<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<div align="left">
  <a href="https://github.com/tris-n/studiopm">
    <img src="https://www.mystudiopm.com/static/media/logo.aa531628a8dd8d6a873a.png" alt="Logo" width="46" height="66">
  </a>
  
<!-- ## project_title -->
<h3 align="left" style="font-size: 24px">StudioPM</h3>

  <p align="left">
    A comprehensive film production management tool.
    <br />
    <br />
    <a href="https://www.mystudiopm.com">View Demo</a>
    ·
    <a href="https://github.com/tris-n/studiopm/issues">Report Bug</a>
	<br />
	<br />
  </p>
</div>



<!-- TABLE OF CONTENTS -->
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
      </ul>
    </li>
    <li>
      <a href="#built-with">Built With</a>
      <ul>
        <li><a href="#frontend">Frontend</a></li>
        <li><a href="#backend">Backend</a></li>
        <li><a href="#database">Database</a></li>
        <li><a href="#apis">APIs</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#deployment-notes">Deployment Notes</a></li>
      </ul>
    </li>
    <li>
		<a href="#usage">Usage</a>
	</li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
  <br />



<!-- ABOUT THE PROJECT -->
## About The Project

StudioPM is a robust film production studio management application tailored for seamless project orchestration and asset tracking. From budgeting to deadline management, StudioPM covers all corners of studio project management.

![dashboard]


### Features

* Fullstack CRUD operations.
* Role-based security and permissions ensure appropriate access levels.
* Automated database rollback and backup.
* Integration with TheMovieDatabase for external film data.
* Project creation with detailed specifications, including deadlines, budgets, and user roles.
* Rapid project population with either random movie data or specific external API searches.
* Poster and script uploads facilitated through Firestore.
* Advanced search and sort capabilities for users and projects.
* Clear project status indicators and deliverable tracking.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Built With

### Frontend
![Javascript]
![React]
![Material-UI]
![Redux]
![Firebase]
![Firestore]
![Framer Motion]
![Lodash]
![Dayjs]
![Toastify]

### Backend
![NodeJS]
![Mongoose]
![Express]
![bcryptjs]

### Database
![MongoDB]

### APIs
![TheMovieDB]



<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
	- Add storage to your project.
	- Set the storage rules as follows:
		```sh
		rules_version = '2';
		service firebase.storage {
			match /b/{bucket}/o {
				match /{allPaths=**} {
				allow read; 
				allow write: if request.resource.metadata.authenticated != null;
				allow delete: if resource.metadata.authenticated != null;
				}
			}
		}
		```
2. Create a MongoDB database at [MongoDB Cloud](https://cloud.mongodb.com/).
3. Create an API key at [TheMovieDB](https://developer.themoviedb.org/reference/intro/getting-started).

### Installation

1. Clone the repo:
	```sh
	git clone https://github.com/tris-n/studiopm.git
	```
	
2. Enter the API details in the `backendenv.example` file:
	- For `MONGO_URI`, you'll need the MongoDB connection string.
	- You can find the connection string by clicking 'Connect' on your MongoDB database page, then selecting 'Connect to your application - drivers'.
	- Your connection string should look something like:
	```sh
	mongodb+srv://<username>:<password>@<databasename>.abc123.mongodb.net/?retryWrites=true&w=majority
	```
	- For `JWT_SECRET`, you can set it to anything you like.

3. Enter the API details in the `frontendenv.example` file (it is inside the frontend folder):
	- Here you can set the login details for the demo accounts after you have created them.
	- You'll need to put in your TheMovieDB API key for `REACT_APP_API_BEARER_AUTH`
	- You'll also need to put in your Firebase project details for `REACT_APP_FIREBASE_CONFIG`.
	- These can be found by logging into [Firebase Console](https://console.firebase.google.com/), selecting your project, then selecting 'Project Settings' from the cog icon next to 'Project Overview' in the top left of the screen.
	- Scroll down and grab the `firebaseConfig` object, converting it to JSON (by putting the keys in quotation marks, i.e., `{"apiKey": "1234", "authDomain": "www.firebaseapp.com", etc.}`) before you paste it into the `frontendenv.example` file.

4. Rename `backendenv.example` and `frontendenv.example` files to `.env`.

5. `cd` to the root folder of the project if you're not already there.
6. Install the backend dependencies:
	```sh
	npm install
	```
7. Run the server:
	```sh
	npm run server
	```

8. `cd` to the `/frontend/` folder.
9. Install the frontend dependencies:
	```sh
	npm install
	```
10. Start the frontend:
	```sh
	npm run start
	```

### Deployment Notes
- When deploying, change `.env NODE_ENV` to 'production'.
- If using Heroku, it will autobuild the frontend.
- Remember to put your frontend and backend `.env` variables into Heroku.
- Remember to comment out the automated rollback and backup functions as needed.


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

### Getting Started
Create a `Studio Head` account at [https://www.mystudiopm.com/register](https://www.mystudiopm.com/register). Upon registration, you will be automatically logged in.

![register]

### The Dashboard
The dashboard displays the most recent projects and provides an overview of the studio's budget.

![dashboard]

### Projects
Admins have the capability to create projects.

![projects]

Users can search for projects by name and status.

![search]

Click on the `Crew` tab to see an overview of who is assigned to each project.

![searchCrew]

The `Deliverables` tab provides an overview of the items supplied to each project.

![searchDeliverables]

### Creating a Project

When creating a project, you can set its release date, budget, assign crew, upload a script, a poster image, and provide a YouTube trailer.

![createProject]

Additionally, you can choose to pre-fill the project with a randomly selected movie from TheMovieDB's `trending` list or search for a specific movie in their database.

![prefill]

### Project Pages

On the individual project pages, you can watch the trailers, read the scripts, get a status overview, and see which crew members have been assigned and whether they have provided their appropriate deliverables.

![singleProject]

### Crew
Both studio heads and producers can create crew accounts.

![crew]

### Crew Pages

Here, you can get an overview of which projects crew members are assigned to and which deliverables they have provided.

![singleCrew]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Tristan - [trisn.work@gmail.com](mailto:trisn.work@gmail.com)

Project Link: [https://github.com/tris-n/studiopm](https://github.com/tris-n/studiopm)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- Frontend -->
[Javascript]: https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[React]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[Material-UI]: https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white
[Redux]: https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white
[Firebase]: https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black
[Firestore]: https://img.shields.io/badge/Firestore-007ACC?style=for-the-badge&logo=firebase&logoColor=white
[Framer Motion]: https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white
[ApexCharts]: https://img.shields.io/badge/ApexCharts-000000?style=for-the-badge&logo=chart-dot-js&logoColor=white
[Dayjs]: https://img.shields.io/badge/Dayjs-2D2D2D?style=for-the-badge&logo=calendar&logoColor=white
[Leaflet]: https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white
[Swiper]: https://img.shields.io/badge/Swiper-e63327?style=for-the-badge&logo=swiper&logoColor=white
[Toastify]: https://img.shields.io/badge/Toastify-FFCA28?style=for-the-badge&logo=react-toastify&logoColor=black
[Lodash]: https://img.shields.io/badge/Lodash-02569B?style=for-the-badge&logo=lodash&logoColor=white


<!-- Backend -->
[NodeJS]: https://img.shields.io/badge/NodeJS-339933?style=for-the-badge&logo=node-dot-js&logoColor=white
[Mongoose]: https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=database&logoColor=white
[Express]: https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white
[bcryptjs]: https://img.shields.io/badge/bcrypt-023E8A?style=for-the-badge&logo=bcrypt&logoColor=white
[Firebase-Admin]: https://img.shields.io/badge/Firebase_Admin-FFCA28?style=for-the-badge&logo=firebase&logoColor=black

<!-- Database -->
[MongoDB]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white

<!-- APIs -->
[GoogleMaps API]: https://img.shields.io/badge/GoogleMaps_API-4285F4?style=for-the-badge&logo=google-maps&logoColor=white
[Google OAuth]: https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white
[TheMovieDB]: https://img.shields.io/badge/TheMovieDB-01D277?style=for-the-badge&logo=the-movie-database&logoColor=white






<!-- Screenshots -->
[dashboard]: readme/images/dashboard.jpg
[register]: readme/images/register.jpg

[projects]: readme/images/projects.jpg
[createProject]: readme/images/createProject.jpg
[prefill]: readme/images/prefill.jpg
[singleProject]: readme/images/singleProject.jpg
[search]: readme/images/search.jpg
[searchCrew]: readme/images/searchCrew.jpg
[searchDeliverables]: readme/images/searchDeliverables.jpg

[crew]: readme/images/crew.jpg
[singleCrew]: readme/images/singleCrew.jpg