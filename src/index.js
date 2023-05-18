import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.css'
import configureStore from './store/configureStore'
import AppRouter from './routers/AppRouter'



ReactDOM.render(
  <Provider store={configureStore()}>
    <AppRouter />
  </Provider>,
  document.getElementById('root')
)