import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { ThemeProvider } from '../app/styled';
import Router from './router';
import Sidebar from './containers/Sidebar';
import Main from './components/Main';
import Loader from './components/Loader';
import { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import Auth from './pages/Auth';
import { validateToken, setAuthenticating } from '../redux/slices/user';

import { useServerConnection } from './containers/ServerStatus';

class App extends React.Component {
  componentDidMount() {
    // You can directly call validateToken from props
    this.props.validateToken();
  }

  render() {
    const { isAuthenticated, isAuthenticating } = this.props;

    let content = null;

    if (loading) {
      content = <Loader />;
    } else if (error) {
      content = <div>Error: {error}</div>;
    } else if (connected) {
      content = <Router />;
    }

    if (isAuthenticating) return <Loader />;

    return (
      <ThemeProvider>
        {isAuthenticated ? (
          <>
            <Sidebar />
            <Main>{content}</Main>
          </>
        ) : (
          <Auth />
        )}
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.user.isAuthenticated,
  isAuthenticating: state.user.isAuthenticating,
  isLoading: state.server.isLoading,
});

// Connect the component to the Redux store and automatically inject validateToken action
export default connect(mapStateToProps, { validateToken })(App);
