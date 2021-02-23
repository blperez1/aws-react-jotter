import React from "react";
import CreateJot from './CreateJot';
import AllJotsList from './AllJotsList';
import Login from './Login';
import Signup from './Signup';
import NotFound from './NotFound';
import Viewjot from './Viewjot';
import { Route, Switch } from "react-router-dom";

const Routes = () => 
<Switch>
   <Route exact path="/" component={Login}/>
   <Route exact path="/newjot" component={CreateJot} />
   <Route exact path="/alljots" component={AllJotsList} />
   <Route exact path="/login" component={Login} />
   <Route exact path="/signup" component={Signup} />
   <Route exact path="/view" component={Viewjot}/>
   <Route component={NotFound} />
</Switch>;

export default Routes