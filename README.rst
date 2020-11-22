End-to-end encryption chat
==========================


:License: MIT


Description
-----------

This is a simple Channels 2 + HTTP Django backend with my optional React frontend implementation for end-to-end encryption chat



Pre-requirements
----------------

This project built with Docker. To build and run it on your machine you will need to install `Docker Engine <https://docs.docker.com/engine/install/>`_ and `Docker Compose <https://docs.docker.com/compose/install/>`_.


If you want to use my front-end implementation, you will have to install `NodeJS`_.

.. _NodeJS: https://nodejs.org/en/download/

Also you will have to change ``forntend\config.dist.js`` to ``forntend\config.js``


Settings
--------

Local
^^^^^

Find your local envs file in ``.envs/.local/`` folder

If you are not going to use implemented frontend, open ``.django`` file and change ``HAS_EMBDED_FRONTEND=True`` to ``HAS_EMBDED_FRONTEND=False``

This project is ready to run locally


Basic Commands
--------------

Local Build and Run
^^^^^^^^^^^^^^^^^^^

If you are using implemented frontend, firstly you have to setup React application. Go to ``frontend/`` folder and run next commands::

    $ npm install
    $ npm run build


To run development frontend server you can use::

    $ npm run start


To build backend server with or without implemented frontend go to project root and run::

    $ docker-compose -f local.yml build

To run builded backend server with or without implemented frontend go to project root and run::

    $ docker-compose -f local.yml up


Setting Up Your Users
^^^^^^^^^^^^^^^^^^^^^

* To create a **superuser account**, use this command::

    $ docker-compose -f local.yml run --rm django python manage.py createsuperuser

After it you can login to admin panel from this link: http://localhost:8000/admin/
