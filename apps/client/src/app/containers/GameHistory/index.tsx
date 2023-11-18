import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import { logoutUser } from '../../../redux/slices/user';
import Button from '../../components/Button';
import { User } from '../../../redux/slices/user/types';
import { H3 } from '../../components/Header';

interface GameHistoryProps {
  gameHistory: [];
}

class GameHistory extends React.Component<GameHistoryProps> {
  render() {
    const { gameHistory = [] } = this.props;
    return (
      <>
        <H3>Game History</H3>
        <div>
          {gameHistory.map((game: any) => (
            <> {game} </>
          ))}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  gameHistory: state.roller.gameHistory,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GameHistory);
