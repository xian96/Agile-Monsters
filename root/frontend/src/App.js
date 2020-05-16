import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './styles/App.scss';
import { AuthProvider } from './firebase/Auth';
import PrivateRoute from './components/utilities/PrivateRoutes';
import Error from './components/utilities/Error';
import Landing from './components/Landing';
import Explore from './components/Explore';
import Signup from './components/Signup';
import Login from './components/Login';
import CreateGroup from './components/CreateGroup';
import UserProfile from './components/UserProfile';
import GroupProfile from './components/GroupProfile';
import GroupSetting from './components/GroupSetting';
import SearchResults from './components/SearchResults';

function App() {
   return (
      <AuthProvider>
         <Router>
            <div className="App">
               <Route exact path='/' component={Landing} />
               <Route exact path='/explore' component={Explore} />
               <Route exact path='/signup' component={Signup} />
               <Route exact path='/login' component={Login} />
               <PrivateRoute path='/userprofile/:username' component={UserProfile} />
               <PrivateRoute path='/create-group/:username' component={CreateGroup} />
               <PrivateRoute path='/group-profile/:groupId' component={GroupProfile} />
               <PrivateRoute path='/edit-group/:userId' component={GroupSetting} />
               <PrivateRoute path='/search-results/:query' component={SearchResults} />
               <PrivateRoute path='/error/:message' component={Error} />
            </div>
         </Router>
      </AuthProvider>
   );
}

export default App;
