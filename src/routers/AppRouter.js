import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from '../components/Home/Home'
import Prediction from '../components/Prediction/Prediction'


const AppRouter = () => (
    <BrowserRouter>
        <div>
            <Switch>
                <Route path='/' component={Home} exact={true} />
                <Route path='/Prediction' component={Prediction}/>
            </Switch>
        </div>
    </BrowserRouter>
)

export default AppRouter