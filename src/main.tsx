// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from "react-redux"

import { HashRouter } from "react-router-dom"

import { store } from "./store.ts"


ReactDOM.createRoot(document.getElementById('root')!).render(


  <HashRouter >

    <Provider store={store} >
      <App />
    </Provider >
    
  </HashRouter>


)
