import React from 'react';
import { connect } from 'react-redux';
import Router from './router';
import Sidebar from './containers/Sidebar';
import Main from './components/Main';
import Loader from './components/Loader';
import { RootState } from '../redux/store';
import Auth from './pages/Auth';
import { validateToken } from '../redux/slices/user';
import { fetchServerStatus } from '../redux/slices/api';
import FadeWrapper from './components/FadeWrapper';

type AppProps = {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  loading: boolean;
  connected: boolean;
  error: string | null;
  validateToken: () => void;
  fetchServerStatus: () => Promise<void>;
};

class App extends React.Component<AppProps> {
  componentDidMount() {
    const { validateToken, fetchServerStatus } = this.props;
    fetchServerStatus().then(() => validateToken());
  }

  render() {
    const { isAuthenticated, isAuthenticating, loading, error, connected } =
      this.props;

    if (!connected) {
      if (loading) {
        return <Loader />;
      }
      if (error) {
        return <div>Error: {error}</div>;
      }
    }

    if (!isAuthenticated) {
      if (isAuthenticating) {
        return <Loader />;
      }
      return <Auth />;
    }

    return (
      <FadeWrapper>
        <Sidebar />
        <Main>
          <Router />
        </Main>
      </FadeWrapper>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.user.isAuthenticated,
  isAuthenticating: state.user.isAuthenticating,
  loading: state.server.loading,
  connected: state.server.connected,
  error: state.server.error,
});

export default connect(mapStateToProps, { validateToken, fetchServerStatus })(
  App
);
