import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  addPendingInvite,
  removePendingInvite,
  acceptPendingInvite,
  declinePartyInvite,
  PlayerConnection
} from '../../../redux/slices/connections';

const PartyManager: React.FC = () => {
  const dispatch = useDispatch();
  const lobby = useSelector((state: RootState) => state.connections.lobby);
  const invite = useSelector((state: RootState) => state.connections.invite);
  const party = useSelector((state: RootState) => state.connections.party);

  // State to track the selected user to invite to the party
  const [selectedUser, setSelectedUser] = useState<PlayerConnection | null>(null);

  const handleInviteClick = (user: PlayerConnection) => {
    // Send a party invitation to the selected user (you should implement this)
    // Example:
    // socket.emit('sendPartyInvite', { to: user._id, from: yourUserId });
    setSelectedUser(user);
  };

  const handleAcceptInvite = () => {
    if (invite) {
      // Accept the party invitation (you should implement this)
      // Example:
      // socket.emit('acceptPartyInvite', { to: invite._id, from: yourUserId });
      dispatch(acceptPendingInvite([...party, invite]));
      dispatch(removePendingInvite());
    }
  };

  const handleDeclineInvite = () => {
    if (invite) {
      // Decline the party invitation (you should implement this)
      // Example:
      // socket.emit('declinePartyInvite', { to: invite._id, from: yourUserId });
      dispatch(declinePartyInvite());
    }
  };

  return (
    <div>
      <h2>Party Manager</h2>
      <div>
        <h3>Lobby</h3>
        <ul>
          {lobby.map((user) => (
            <li key={user._id}>
              {user.username}{' '}
              <button onClick={() => handleInviteClick(user)}>Invite</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Party</h3>
        <ul>
          {party.map((user) => (
            <li key={user._id}>
              {user.username}
            </li>
          ))}
        </ul>
      </div>
      {invite && (
        <div>
          <h3>Party Invitation</h3>
          <p>You have received an invitation from {invite.username}.</p>
          <button onClick={handleAcceptInvite}>Accept</button>
          <button onClick={handleDeclineInvite}>Decline</button>
        </div>
      )}
    </div>
  );
};

export default PartyManager;
