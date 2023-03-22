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
First part will be for User UI - required services to work are:
- discovery-server 
- api-gateway
- postgres-user
- mongodb-vehicle
- user-ui-service
- (optional) broker
- (optional) notification-service
- (optional) zipkin

1. Main page contains navbar, after pressing Login user is redirected to IDP and asked for credentials,
when user is login he can retrieve data from user-service and vehicle-service.

![diagram_user]

Then user can add, edit or delete users and signed to them vehicles. Vehicle service contains configuration
to store uploaded images in Cloudinary, you need to change credentials for you cloud or use another one. Its up to you.




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
[diagram_user]: readme-images/diagram_user.png
