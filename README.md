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
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

PTD Manager is system that helps professional truck driver to manage data during his trip.
All funcionalities are similar to the previous version but design is different. Application is built with microservices architecture
which means logic responsible for PDF generation or adding, editing card information are independent parts of whole system.

All that is configured with docker to be easier develop and serve on production environment.

Technologies:
* Spring (Spring-Boot, Spring-Cloud)
* Apache Kafka
* Resilience4J
* Eureka Server
* Zipkin
* iText
* PostgreSQL
* Docker
* React
* Tailwind CSS
* Formik and Yup
* Cloudinary


### Built With

Microservices are registered in Eureka Discovery Server and managed by Spring Cloud Api Gateway. 
Each service has his own database, for now installed is only PostgreSQL but application will be expand
with other databases like maybe MongoDB. User, Card servies are simple Rest Api's but they're communicating 
with each other. Same as PDF service but it only takes stored data from Card Service and generated 
PDF file with iText library.
Application will be expanded with one more service for storing vehicle inforamtion.
The whole project is built with docker images and will be deployed on kubernetes pods at the end.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Application can be runned with docker

### Prerequisites

To be able to run application you need installed docker desktop on your machine, 
if so then run this command line in root folder of the project
```
docker compose up -d

```
### Installation

When above command execute then docker will download required images to run application.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Email - mateusz.uranowski@onet.pl

My personal blog: [https://mateusz-uran.pl/](https://mateusz-uran.pl/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

