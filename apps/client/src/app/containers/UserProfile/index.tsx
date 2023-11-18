import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import { logoutUser } from '../../../redux/slices/user';
import Button from '../../components/Button';
import { User } from '../../../redux/slices/user/types';
import {
  Card,
  CardImage,
  CardHeader,
  CardSubHeader,
} from '../../components/Card';
import sc from '../../../assets/images/sc.png';

interface UserProfileProps {
  user: User | null;
  logoutUser: typeof logoutUser;
}

class UserProfile extends React.Component<UserProfileProps> {
  handleLogout = () => {
    const { logoutUser } = this.props;
    logoutUser();
  };
  render() {
    const { user } = this.props;
    return (
      <Card>
        <CardImage src={sc} alt={user?.username} />
        <CardHeader>{user?.username}</CardHeader>
        <Button type="button" variant="error" onClick={this.handleLogout}>
          Logout
        </Button>
      </Card>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.user.user,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      logoutUser,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
