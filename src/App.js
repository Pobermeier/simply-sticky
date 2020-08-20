import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MainLayout from './components/layout/_MainLayout';
import AddNote from './pages/AddNote';
import NotFound from './pages/NotFound';
import data from './_data';
import EditNote from './pages/EditNote';
import Note from './pages/Note';
import netlifyIdentity from 'netlify-identity-widget';
import './App.css';
import Landing from './pages/Landing';
import Main from './pages/Main';
import ProtectedRoute from './components/routing/ProtectedRoute';

const netlifyAuth = {
  isAuthenticated: false,
  user: null,
  authenticate(callback) {
    this.isAuthenticated = true;
    netlifyIdentity.open();
    netlifyIdentity.on('login', (user) => {
      this.user = user;
      callback(user);
    });
  },
  signout(callback) {
    this.isAuthenticated = false;
    netlifyIdentity.logout();
    netlifyIdentity.on('logout', () => {
      this.user = null;
      callback();
    });
  },
};

function App() {
  const [notes, setNotes] = useState(data);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const addNote = (note) => {
    setNotes((prevState) => [...prevState, note]);
    window.M.toast({ html: 'Note successfully added!', classes: 'green' });
  };

  const editNote = (id, updatedNote) => {
    setNotes((prevState) => {
      return prevState.map((note) => {
        if (note.id !== id) return note;
        else return updatedNote;
      });
    });
    window.M.toast({ html: 'Note successfully updated!', classes: 'green' });
  };

  const deleteNote = (id) => {
    setNotes((prevState) => {
      return prevState.filter((note) => note.id !== id);
    });
    window.M.toast({ html: 'Note deleted!', classes: 'green' });
  };

  return (
    <Router>
      <MainLayout
        isAuthenticated={isAuthenticated}
        login={login}
        logout={logout}
      >
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Landing isAuthenticated={isAuthenticated} login={login} />
            )}
          />
          <ProtectedRoute
            exact
            path="/notes"
            isAuthenticated={isAuthenticated}
            notes={notes}
            deleteNote={deleteNote}
            component={Main}
          />
          <ProtectedRoute
            exact
            path="/add"
            isAuthenticated={isAuthenticated}
            addNote={addNote}
            component={AddNote}
          />
          <ProtectedRoute
            exact
            path="/edit/:id"
            isAuthenticated={isAuthenticated}
            editNote={editNote}
            notes={notes}
            component={EditNote}
          />
          <ProtectedRoute
            exact
            path="/note/:id"
            isAuthenticated={isAuthenticated}
            notes={notes}
            deleteNote={deleteNote}
            component={Note}
          />
          <Route component={NotFound} />
        </Switch>
      </MainLayout>
    </Router>
  );
}

export default App;
