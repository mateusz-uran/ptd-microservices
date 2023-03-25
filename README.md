<a name="readme-top"></a>
<!-- PROJECT LOGO -->
<br />
<div align="center">

  <h3 align="center">Professional Truck Driver System Managment</h3>
  
  <h5 align="center">Application is still developed!</h5>

  <p align="center">
    Secured system designed to speed up and facilitate data management.
    <br />
    <br />
    <a href="https://github.com/mateusz-uran/PTD-Manager">Previous version</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#usage">Usage</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

PTD Manager is system that helps professional truck driver to manage data during his trip.
All funcionalities are similar to the previous version but design is different. Application is built with microservices architecture
which means system is divided into services. Some are independent but some requeire the action of others. Like for example card service
is calling user service to check if User exists in system. When user-service is down, card service cant do any operations. Card and PDF services are managed by one Frontend Application written in react and User and Vehicle services are working with angular app.


![diagram_main]

### Built With

![Spring-Boot][Spring-Boot]
![Apache Kafka][Apache Kafka]
![Resilience4J][Resilience4J]
![Zipkin][Zipkin]
![iText][iText]
![PostgreSQL][PostgreSQL]
![MongoDB][MongoDB]
![Docker][Docker]
![React][React]
![Tailwind CSS][Tailwind CSS]
![Formik & Yup][Formik & Yup]
![JavaScript][JavaScript]
![Angular][Angular]
![TypeScript][TypeScript]
![Cloudinary][Cloudinary]
![HTML][HTML]
![CSS][CSS]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Application is using Cloudinary, below is required config located in directory:

src/main/java/io/github/mateuszuran/config/CloudinaryConfig.java
```
@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloud() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "xyz",
                "api_key", "123456780",
                "api_secret", "abc123xyz",
                "secure", true));
    }
}
```

### Prerequisites

First build JAR files with maven, for some reason mvn clean package was making trouble for me
so I had to build it with:
```
mvn clean package spring-boot:repackage

```
Run this command in each service directory and image will be build from Dockerfile configuration.

### Installation

Dockerfiles are in each directory

In root directory run:
```
docker compose up -d

```

There is seven services, three databases, zipkin, pgAdmin, two fronted apps which is Angular and React.
In second docker compose is keycloak configuration.
For both PostgresSQL databases configuration is in docker compose as env variables but for MongoDB
there is configuration file in project root directory

Project consists several services as application is built to manage data there is two SQL databases and one NoSQL. Card Service,
User Service and Vehicle service are using those databases, PDF service only fetching data organizes, calculates and generates pdf file
and there is no need to store any inforamtion. 

There is some communication between services as shown on diagram above. As an entry for user there is two applications - Angular and React.
Angular application is configured to act as admin panel for managing users and vehicles assigned to those users but on the other hand
React is acting as interface for users "registered" to the system, they can manage their cards, change status and the most important
generate formatted pdf file from added data. 

There is two docker compose files - one for frontend, backend apps, databases and metrics, second is for keycloak.

**!IMPORTANT!**

After configuring all containers and adding client and user to keycloak realm you may need to add this
`127.0.0.1 keycloak` to file in located c:\Windows\System32\Drivers\etc\hosts.
When client (angular app) is creating token its getting url as http://localhost:port/ but api-gateway is working in the same network
as keycloak so hostname is different. Containers in the same network are communicating with each other via container_name like for example:
http://keycloak:8080/realm and http://api-gateway:8181/api.

### Usage

To run backend for User UI and Card UI this are required containers:
- discovery-server
- api-gateway
- zipkin (optional)

#### User UI

User UI frontend needs those containers to work properly:

- keycloak (it's separated docker compose in ptd-micro root directory)
- postgres-user - DB for user-service
- mongodb-vehicle - DB for vehicle-service
- user-service
- vehicle-service
- broker (optional) - apache kafka, will run zookeeper automatically
- notification-service (optional)

1. Simple flow when user hits http://localhost:4200:
- main page with navbar
- login, redirect to keycloak login page
- user return to localhost:4200 with token stored in session storage
- user can make CRUD operations that go threw api-gateway which is configured as resource server

![login_gif]

Angular application is using `angular-oauth2-oidc` to handle PKCE security flow - logged in user's token is refreshed 
automatically just before expiration time.

2. Here are main features:
- ADD or EDIT users
- Toggle user status (based on status user can or not use Card UI)
- ADD, EDIT, DELETE vehicle signed to users
- ADD, UPDATE, DELETE images for vehicles
- validations in forms
- interceptor to add auth token in each request
- cache interceptor
- websocket notification service (Card UI is sending messages via Apache Kafka to Notification Service,
  message is rendered as popup in User UI. This is very basic configuration and I know that Kafka is little overkill in that configuration)
- application is build based on predefined material-ui components
- nested routing, url's with path variable etc.


3. Gifs how application works and looks:

Users list on left side contains avatar with color randomly generated in backend,
initials are generated in Angular app.

Function for fetching and adding users is configured in the same service so because of cache interceptor
when admin add new user instead of fetching data again - list is updated in fronted with BehaviourSubject
![add_user_gif]

Edit user form with validations, updated version is insta rendered, popup message when user
status is toggled, auth header in each request.
![single_user_gif]

After selecting user from list vehicle data is fetched and rendered. User can edit each field by
toggling edit form, changes are applied immediately. User can delete all vehicle information
including image stored in cloud by pressing confirm button in rendered modal.

![vehicle_details_gif]

User can add vehicle information and sign them to user. Process has three parts:
first truck information are added, then trailer and at the end image information and image file.
When format is correct file is uploaded to cloud.

![add_vehicle_gif]

User can delete all vehicle information with one button, including image stored in cloud.
To avoid accidental data delete when user clicks Delete button modal will show up and only
when user confirms action data will be erased.

![delete_vehicle_gif]

---

In Card UI when user will fill his card and toggle status Admin will get notification in User UI.
Below is gif that shows how it looks, websocket is listening notification-service and when message is received
popup is shown with some data like: card author (username), card number and card status.

address to toggle card status
``http://localhost:8181/api/card/toggle?cardId=440&username=john``

![notify]

---

#### Card UI

To run Card UI you need these containers:
- postgres-user (card-service is communicating with user-service)
- user-service
- postgres-card
- mongodb-vehicle (same like with user-service)
- pdf-service (these service is fetching data about user's vehicle)

Main backend for Card UI is Card Service, it has own database but needs few more services to work properly. 
User can add and edit data in card but later those data are fetched by PDF service to generate pdf file.
Another intercommunication between services is when user adds new card, user-service is called to validate 
if user has permissions (user status or if user even exists).

1. As previous this is flow when user hits http://localhost:3000
- shared navbar contains theme toggle button and input field to retrieve card information based on username
  and actual year and month 
- user can change which card fetch based on month and year
- when user is "locked" (toggle button in User UI) or when user is not in database snackbar information will be shown
- fetched card are rendered as list with interaction buttons

2. Main features
- formik and yup validations
- dynamic form
- localy stored theme and username information
- application is based on material-ui components
- routing and error page
- validations 
- fully responsive

3. Gifs of how application looks and works

Theme info and username is stored in local storage, fetched cards are refetched if username or "calendar" values
will change.

![main_page_gif]

After pressing available card information are rendered, trips and fuels info is fetched with sorting
from backend and trip table contains paging feature. User can select multiple rows and delete at once
or delete only one. 

By pressing each card new components are rendered - trip and fuel tables with available data. Trips are sorted by counter values,
user can select one or more trip rows to delete, trip table has paging feature beacuse it usually contains 20+ rows.

Fuel table has less functionality due to small amount of data.

![card_info_gif]

Add Trip button redirects to trip form component with parent informations like card number, form has validations
configured with Yup and Formik, dynamic and responsive inputs. 
When user adds new row of inputs some data is transferred to the secodn row, this mechanism helps to fill card faster
since they're the same.

![add_trip_gif]

Fuel form shows how validations works, when user is trying to submit not filled form Yup shows up,
trip form is configured the same but has more logic to handle array of inputs.

![add_fuel_gif]

In User UI there was a popup information about card that user can toggle.
This is how it looks, when user will fill his card he can toggle it to send notification
that card is ended and can be finalized. Validations secure from toggling empty card
due to further operations like generating pdf. Card info is fetched and calculated so it cannot be empty
when it has status 'done'.

When user wants to toggle status card notification showed eaarlier is sended by this action, of course first card
must be filled.

![toggle_card_gif]

When all data is filled correctly, card is toggled to 'done' user can generate PDF based on card
and vehicle information. Card UI is calling pdf-service endpoint and then from there card information
are fetched, vehicle information and PDF is generated. I've used iText library to handle this.

When all data is filled correctly, card is toggled to 'done' user can generate PDF based on card
and vehicle information. PDF Service is calling card and vehicle service to receive required data,
calculates and generate pdf file. Ready document is returned to Card UI and showed in new tab.

![pdf_generate_gif]

Generating PDF based on card data is actually main feature and reason why this application was made.
Instead of writing it on paper user can add info via pc or phone because this application can run 
as web application across the internet and do this much faster and easier.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Email - mateusz.uranowski@onet.pl

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[Spring-Boot]: https://img.shields.io/badge/Spring--Boot-black?logo=springboot&logoColor=6DB33F
[Apache Kafka]: https://img.shields.io/badge/Apache_Kafka-000?logo=Apache+Kafka
[Resilience4J]: https://img.shields.io/badge/Resilience4j_-000
[Zipkin]: https://img.shields.io/badge/Zipkin-fe7139
[iText]: https://img.shields.io/badge/iText-ff9f18
[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-336691?logo=PostgreSQL&logoColor=fff
[MongoDB]: https://img.shields.io/badge/PostgreSQL-4faa41?logo=MongoDB&logoColor=fff
[Docker]: https://img.shields.io/badge/Docker-139fdc?logo=Docker&logoColor=fff
[React]: https://img.shields.io/badge/React-black?logo=react
[Tailwind CSS]: https://img.shields.io/badge/Tailwind_CSS-38bdf8?logo=Tailwind+CSS&logoColor=fff
[Formik & Yup]: https://img.shields.io/badge/Formik_%26_Yup-0052cc
[Angular]: https://img.shields.io/badge/Angular-c3002f?logo=Angular
[Cloudinary]: https://img.shields.io/badge/Cloudinary-3448c5
[HTML]: https://img.shields.io/badge/HTML-white?logo=html5
[CSS]: https://img.shields.io/badge/CSS-264ee4?logo=css3
[JavaScript]: https://img.shields.io/badge/JavaScript-black?logo=javascript
[TypeScript]: https://img.shields.io/badge/TypeScript-000?logo=TypeScript


[diagram_main]: readme-images/diagram.png
[login_gif]: readme-images/login-gif-800.gif
[add_user_gif]: readme-images/add-user-gif-800.gif
[single_user_gif]: readme-images/single-user-gif-800.gif
[vehicle_details_gif]: readme-images/vehicle-details-gif-800.gif
[add_vehicle_gif]: readme-images/add-vehicle-git-800.gif
[delete_vehicle_gif]: readme-images/delete-vehicle-gif-800.gif
[notify]: readme-images/notification.png
[main_page_gif]: readme-images/main-page-gif.gif
[card_info_gif]: readme-images/card-info-gif.gif
[add_trip_gif]: readme-images/add-trip-gif.gif
[add_fuel_gif]: readme-images/add-fuel-gif.gif
[toggle_card_gif]: readme-images/toggle-card-gif.gif
[pdf_generate_gif]: readme-images/pdf-generate-gif.gif
