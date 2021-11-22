# Tellaweb (frontend)

Frontend application built on NextJS

Before executing it is necessary to build the Tailwinds css file:
`yarn build:css`

The application has storybook
`yarn storybook`

# How it is organized

Inside the packages folder you will find two other folders: ui and bloc.

**Ui** is where all the components and layouts used by the application are located. They must be completely functional and not make any type of call to the API, only callbacks and parameters with data.

**Bloc** is where the business logic resides, where the calls to the api are made and a state is exposed that defines how the interface (whatever it is) is going to look like.

The Next application should only do the routing and connect the Bloc state with the Ui layouts.

# Deploy using Docker

During the build process it is necessary to provide the `api_url` argument that will be used to redirect requests to the api. This value is stored in the docker image and can't be changed during execution. _If you want to change the url you need to rebuild the image_. This is because during the build process the url is included as text in the js bundle.

> docker build . --build-arg api_url=https://api.your-api-example.org -t tellaweb-frontend

To use the image:

> docker run -p 3000:3000 tellaweb-frontend
