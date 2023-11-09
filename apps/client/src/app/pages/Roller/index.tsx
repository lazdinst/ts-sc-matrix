import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../redux/store';
import { fetchRolls } from '../../../redux/slices/roller/roller';

const Roller: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { playerOneRoll, playerTwoRoll, loading, error } = useSelector(
    (state: RootState) => state.roller
  );

  const handleRollButtonClick = () => {
    dispatch(fetchRolls());
  };


  return (
    <div>
      <h2>Roller</h2>
      <button onClick={handleRollButtonClick} disabled={loading}>
        Roll
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {playerOneRoll.length > 0 && (
        <div>
          <h3>Player One Roll:</h3>
          <ul>
            {playerOneRoll.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {playerTwoRoll.length > 0 && (
        <div>
          <h3>Player Two Roll:</h3>
          <ul>
            {playerTwoRoll.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Roller;
