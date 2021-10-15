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
