# Strength Training Tracker

## About

This is meant to make tracking your workout sessions easier. You can quickly add exercises to your workout, sets to your exercises, and reps and weight to your sets.

You can also load a previous session as a template, and perhaps for example the only thing you need to change is the number of reps performed; all else may be the same.

The app also graphs your progress with each exercise, showing your calculated 1RM across time.

## Front-end install / deployment

- Get [repository](https://github.com/Jerrad-Johnson/WorkoutAppRedo)
- Run `npm install` in project folder
- Update `queries.tsx` variable `baseURL` to reference your php directory
- Use `npm run build` to create a deployable version of the frontend app, then navigate to the project's folder, then to the `build` subfolder. Upload the `build` folder's contents to a webserver, and set URL rewrites.

## Back-end install / deployment

- Instructions in [repository](https://github.com/Jerrad-Johnson/WorkoutAppBackend)

## Known issues

- Loading indicators on Progress page do not disappear after an empty fetch.
- Needs to inform users when the server has ended their session (i.e. when they get logged out).
- Couldn’t find a way to avoid rendering success messages with react-hot-toast. Partial solution was to set the success-message timeout to 1ms.

## TODO Features
- Add more graphs / show more data.
- Home page needs an “Update” button, so old sessions can be changed without being deleted first.
- Users need the option to download their entire session history, so that they never have to rely on my database / risk losing all of their history.
- MUI button recoloring needed for home page.
- Many DOM elements should fade upon data load / etc.
- Needs Cypress tests.
- Add a per-card counter to track how many sets you've completed during the current workout.
- Add an alert when attempting to navigate away with unsaved data.