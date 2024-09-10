# Tellaweb (frontend)

# How it is organized

Inside the packages folder you will find two other folders: ui and bloc.

**Ui** is where all the components and layouts used by the application are located. They must be completely functional and not make any type of call to the API, only callbacks and parameters with data.

**State** is where the business logic resides, where the calls to the api are made and a state is exposed that defines how the interface (whatever it is) is going to look like.

The Next application should only do the routing and connect the state with the UI layouts.


# To prepare release 

### For development

- write package.json "version" with the number needed for production (without 'beta-' prefix in any case)
- close pr's and merge them to development
- push tag from development with the version number and the prefix, example: 'beta-1.2.3'. This will start the build of the image in dockerhub
- After the build pull the new images on the beta server and run migrations if necessary

### For deploying production
- merge what needs merging from development
- push tag without any prefix, example: '1.2.3', this will start the build of the image in dockerhub
- After the build pull the new images on the production server/s and run migrations if necessary
