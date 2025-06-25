<!-- See: https://github.com/othneildrew/Best-README-Template -->
<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/camiloandcu/Web-Linda-de-Programacion-Lineal">
    <img src="static/images/favicon.ico" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">WLPL - Web Linda de Programación Lineal</h3>

  <p align="center">
    Aplicación web interactiva para la enseñanza y análisis de problemas de Programación Lineal. 
    <br />
    <a href="https://github.com/camiloandcu/Web-Linda-de-Programacion-Lineal/issues/new?labels=bug&template=bug-report---.md">Reportar Bug</a>
    &middot;
    <a href="https://github.com/camiloandcu/Web-Linda-de-Programacion-Lineal/issues/new?labels=enhancement&template=feature-request---.md">Solicitar una Funcionalidad</a>
  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Tabla de Contenidos</summary>
  <ol>
    <li>
      <a href="#acerca-del-proyecto">Acerca del Proyecto</a>
      <ul>
        <li><a href="#herramientas">Herramientas</a></li>
      </ul>
    </li>
    <li>
      <a href="#comenzando">Comenzando</a>
      <ul>
        <li><a href="#prerrequisitos">Prerrequisitos</a></li>
        <li><a href="#instalacion">Instalación</a></li>
      </ul>
    </li>
    <li><a href="#ejemplos-de-uso">Ejemplos de Uso</a></li>
    <li><a href="#contribuciones">Contribuciones</a></li>
    <li><a href="#licencia">Licencia</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## Acerca del Proyecto

PL Visualizer es una aplicación web interactiva para la enseñanza y análisis de problemas de Programación Lineal (PL) con dos o más variables. Permite definir modelos, visualizar la región factible y la solución óptima mediante el método gráfico, y resolver problemas de mayor dimensión usando el método simplex tabulado paso a paso.

Características principales:

<ul>
    <li><b>Método gráfico:</b> Visualización de la región factible, restricciones, vértices y solución óptima para modelos de dos variables.</li>
    <li><b>Método tabulado (Simplex):</b> Resolución paso a paso de modelos de cualquier dimensión, mostrando las tablas simplex y el análisis de sensibilidad (valores sombra).</li>
    <li><b>Interfaz intuitiva:</b> Agrega variables y restricciones dinámicamente, con validación y mensajes claros.</li>
    <li><b>Análisis de sensibilidad:</b> Calcula e interpreta los valores sombra para cada restricción.</li>
    <li><b>Frontend responsivo:</b> Compatible con dispositivos móviles y escritorio.</li>
</ul>

<p align="right">(<a href="#readme-top">volver al comienzo</a>)</p>

### Herramientas

* [![Flask][Flask.com]][Flask-url]
* [![Matplotlib][Matplotlib.com]][Matplotlib-url]
* [![Pandas][Pandas.com]][Pandas-url]

<p align="right">(<a href="#readme-top">volver al comienzo</a>)</p>


<!-- GETTING STARTED -->
## Comenzando

Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas.

### Prerrequisitos

Que cosas necesitas para instalar el software y cómo instalarlas
* flask
  ```sh
  pip install flask
  ```

### Instalacion

1. Clonar el repositorio
   ```sh
   git clone https://github.com/camiloandcu/Web-Linda-de-Programacion-Lineal.git
   ```
2. Ejecutar servidor en Development
   ```sh
   flask run
   ```

<p align="right">(<a href="#readme-top">volver al comienzo</a>)</p>

<!-- USAGE EXAMPLES -->
## Ejemplos de Uso

![Página de Método Gráfico][product-screenshot1]
![Página de Método Tabulado][product-screenshot2]

<p align="right">(<a href="#readme-top">volver al comienzo</a>)</p>

<!-- CONTRIBUTING -->
## Contribuciones

Las contribuciones son lo que hace que la comunidad de código abierto sea un lugar tan increíble para aprender, inspirarse y crear. Cualquier contribución que hagas será muy apreciada.

Si tienes una sugerencia para mejorar esto, por favor haz un fork del repositorio y crea un pull request. También puedes simplemente abrir un issue con la etiqueta "enhancement".

¡No olvides darle una estrella al proyecto! ¡Gracias de nuevo!

1. Haz un Fork del Proyecto
2. Crear un Branch del Proyecto (`git checkout -b feature/AmazingFeature`)
3. Haz un Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz un Push al Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

<p align="right">(<a href="#readme-top">volver al comienzo</a>)</p>

<!-- LICENSE -->
## Licencia

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">volver al comienzo</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/camiloandcu/Web-Linda-de-Programacion-Lineal.svg?style=for-the-badge
[contributors-url]: https://github.com/camiloandcu/Web-Linda-de-Programacion-Lineal/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/camiloandcu/Web-Linda-de-Programacion-Lineal.svg?style=for-the-badge
[forks-url]: https://github.com/camiloandcu/Web-Linda-de-Programacion-Lineal/network/members
[stars-shield]: https://img.shields.io/github/stars/camiloandcu/Web-Linda-de-Programacion-Lineal.svg?style=for-the-badge
[stars-url]: https://github.com/camiloandcu/Web-Linda-de-Programacion-Lineal/stargazers
[issues-shield]: https://img.shields.io/github/issues/camiloandcu/Web-Linda-de-Programacion-Lineal.svg?style=for-the-badge
[issues-url]: https://github.com/camiloandcu/Web-Linda-de-Programacion-Lineal/issues
[license-shield]: https://img.shields.io/github/license/camiloandcu/Web-Linda-de-Programacion-Lineal.svg?style=for-the-badge
[license-url]: https://github.com/camiloandcu/Web-Linda-de-Programacion-Lineal/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/camiloandcu
[product-screenshot1]: static/images/screenshot1.jpeg
[product-screenshot2]: static/images/screenshot2.jpeg
[Flask.com]: https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=Flask&logoColor=white
[Flask-url]: https://flask.palletsprojects.com/en/stable/
[Matplotlib.com]: https://img.shields.io/badge/-Matplotlib-11557C?style=for-the-badge&logo=python&logoColor=white&logoSize=2
[Matplotlib-url]: https://matplotlib.org/stable/index.html
[Pandas.com]: https://img.shields.io/badge/Pandas-000000?style=for-the-badge&logo=pandas&logoColor=white
[Pandas-url]: https://pandas.pydata.org/docs/
