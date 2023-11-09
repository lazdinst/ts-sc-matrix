import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { executeNewRoll } from '../../../redux/slices/roller/roller';
import { ServerStatusState } from '../../../redux/slices/api/serverStatus';
import { Page, Button, Section, Card } from '../../components';

const Roller: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { playerOne, playerTwo, loading, error } = useSelector(
    (state: RootState) => state.roller
  );

  const serverStatus = useSelector(
    (state: { serverStatus: ServerStatusState }) => state.serverStatus
  );

  const handleRollButtonClick = () => {
    dispatch(executeNewRoll());
  };

  return (
    <Page
      id="roller-page"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="16px"
    >
      <Section justifyContent="center" alignItems="center" gap="16px">
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
  );
};

export default Roller;
