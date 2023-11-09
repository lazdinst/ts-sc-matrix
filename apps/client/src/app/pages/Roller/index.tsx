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

const Roller: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { playerOne, playerTwo, loading, error } = useSelector(
    (state: RootState) => state.roller
  );

  const server = useSelector(
    (state: { server: ServerStatusState }) => state.server
  );
  const websocket = useSelector(
    (state: { websocket: WebSocketState }) => state.websocket
  );

  const handleRollButtonClick = () => {
    if (server.connected && websocket.connected) {
      dispatch(executeNewRoll());
    }
  };

  return (
    <>
      <SecondarySidebar>dfew</SecondarySidebar>
      <Page
        id="roller-page"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="16px"
      >
        <Section
          justifyContent="space-evenly"
          alignItems="center"
          gap="16px"
          width="100%"
        >
          <Card player={playerOne} />
          <Card player={playerTwo} />
        </Section>
        <Section justifyContent="center">
          <Button
            isLoading={loading}
            onClick={handleRollButtonClick}
            disabled={loading}
            variant="success"
          >
            Roll
          </Button>
        </Section>
      </Page>
    </>
  );
};

export default Roller;
