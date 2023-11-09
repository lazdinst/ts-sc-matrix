import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { executeNewRoll } from '../../../redux/slices/roller/roller';
import { ServerStatusState } from '../../../redux/slices/api/serverStatus';
import Page from '../../components/Page';
import Button from '../../components/Button';

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
      flexDirection="row"
      justifyContent="center"
      alignItems="flex-start"
      gap="16px"
    >
      <h2>Roller</h2>
      <div>{JSON.stringify(serverStatus)}</div>
      <Button
        isLoading={loading}
        onClick={handleRollButtonClick}
        disabled={loading}
        variant="success"
      >
        Roll
      </Button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {JSON.stringify(playerOne)}
      {JSON.stringify(playerTwo)}
    </Page>
  );
};

export default Roller;
