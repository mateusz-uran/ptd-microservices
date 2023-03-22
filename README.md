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

Application is using Cloudinary so you need to provide secret key and api key.

### Prerequisites

First build JAR files with maven, for some reason mvn clean package was making trouble for me
so I had to build it with:
```
mvn clean package spring-boot:repackage

```
Run this command in each service directory so Dockerfile can then get this JAR file to build image.

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

``docker-entrypoint-initdb.d/mongo-init.js``

With those credentials you can login to each container via:  
``docker it -exec <container_name> bash``

Keycloak compose is Keycloak image and MySQL database to store added users etc. 
In docker compose are credentials to login as master admin.

**!IMPORTANT!**

Security to work properly outside of docker compose you need to add 'keycloak' as hostname
because when creating token with angular app token is sent to api gateway which is also running in docker compose
so hostname is names with docker container which is keycloak.
In windows to workaround this add in 
``c:\Windows\System32\Drivers\etc\hosts`` `127.0.0.1 keycloak`.

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

1. Simple flow when users hits http://localhost:4200 link:
- main page with navbar
- login, redirect to keycloak login page
- successful login user return to localhost:4200 with token that is stored in session storage
- user can make CRUD operations

![login_gif]

Angular application is using `angular-oauth2-oidc` to handle PKCE security flow. When user
login stored token is refreshed just before expiration time automatically.

2. Here are main features:
- ADD or EDIT users
- Toggle user status (based on status user can or not use Card UI)
- ADD, EDIT, DELETE vehicle signed to users
- ADD, UPDATE, DELETE images for vehicles
- validations in forms
- interceptor that adds auth header in each request
- cache interceptor
- websocket notification service (Card UI is sending messages via Apache Kafka to Notification Service,
  message is rendered as popup in User UI)
- application is build based on predefined material-ui components


3. Gifs how application works and looks:

Users list on left side contains avatar with color randomly generated in backend,
initials are generated in Angular app.

Previously fetched users are updated with shared service with new added user information.
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

User UI is only part of whole project, data stored and managed in Admin Panel are later fetched by
another services like PDF or Card.
Later I will provide information about webesocket message system available in angular project,
from Card UI when user will fill and end card API will send message via Apache Kafka to notification
service. Angular App is listening notification service and when message will be received
popup window will show up.

Message looks like that when user from Card UI will hit this address
``http://localhost:8181/api/card/toggle?cardId=440&username=john``

![notify]

---

#### Card UI

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
