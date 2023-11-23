import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { executeNewRoll } from '../../../redux/slices/roller/roller';
import { ServerStatusState } from '../../../redux/slices/api/server';
import { WebSocketState } from '../../../redux/slices/websocket/websocket';
import {
  Page,
  Button,
  Section,
  Card,
  SecondarySidebar,
} from '../../components';
import { GameHistory, PlayerCard, PartyManager } from '../../containers';
import CharacterRoll from '../../containers/CharacterRoll';
import UserDetailContainer from '../../containers/UserDetail';

const Roller: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { players, loading } = useSelector((state: RootState) => state.roller);

  const server = useSelector(
    (state: { server: ServerStatusState }) => state.server
  );

  const websocket = useSelector(
    (state: { websocket: WebSocketState }) => state.websocket
  );

  const party = useSelector((state: RootState) => state.connections.party);

  const handleRollButtonClick = () => {
    if (server.connected && websocket.connected) {
      dispatch(executeNewRoll());
    }
  };

  return (
    <>
      <SecondarySidebar>
        <div>
          <GameHistory gameHistory={[]} />
        </div>
        <div id="footer">
          <PartyManager />
          <UserDetailContainer />
        </div>
      </SecondarySidebar>
      <Page
        id="roller-page"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="16px"
      >
        {party?.length ? (
          <>
            {players?.length ? <CharacterRoll /> : null}
            <Section justifyContent="center">
              <Button
                isLoading={loading}
                onClick={handleRollButtonClick}
                disabled={loading}
                variant="primary"
              >
                Roll
              </Button>
            </Section>
          </>
        ) : null}
      </Page>
    </>
  );
};

export default Roller;
