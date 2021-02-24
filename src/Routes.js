import React from "react";
import CreateJot from './CreateJot';
import AllJotsList from './AllJotsList';
import Login from './Login';
import Signup from './Signup';
// import NotFound from './NotFound';
import Viewjot from './Viewjot';
import { Route, Switch } from "react-router-dom";
import AuthorizedRoute from "./AuthorizedRoute";
import UnAuthorizedRoute from "./UnAuthorizedRoute";

export default (cprops) =>
<Switch>

  <UnAuthorizedRoute path="/login" exact component={Login} cprops={cprops}/>
  <UnAuthorizedRoute path="/signup" exact component={Signup} cprops={cprops}/>
 
  <AuthorizedRoute exact path="/newjot" component={CreateJot} cprops={cprops}/>
  <AuthorizedRoute exact path="/alljots" component={AllJotsList} cprops={cprops}/>
  <AuthorizedRoute exact path="/viewjot" component={Viewjot} cprops={cprops}/>
  <AuthorizedRoute exact path="/" component={AllJotsList} cprops={cprops}/>
 
  {/* <Route component={NotFound} /> */}
</Switch>;