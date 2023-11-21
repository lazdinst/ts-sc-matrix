import { Socket } from 'socket.io';
export { setupPartyListeners } from './party';

export const setupConnectedClientListeners = (
  socket: Socket,
  connectedClients: Map<string, any>
) => {
  //   socket.on('connect', () => {
  //     console.log('Connected...');
  //     dispatch(connectWebSocket());
  //   });
  //   socket.on('disconnect', () => {
  //     dispatch(disconnectWebSocket());
  //   });
};

export const setupConnectionListners = (socket: Socket) => {
  socket.on('connections', (connections: { count: number }) => {
    console.log('Connections:', connections);
  });
};

// export const setupSocketListeners = (socket: Socket, dispatch: Dispatch) => {
//   socket.on('roll', (message: any) => {
//     console.log('Roll:', message);
//     const rollMessage: RollerState = message;
//     console.log('rollMessage:', rollMessage);
//     dispatch(setRolls(rollMessage));
//   });
// };
