import { useState } from 'react';
import '../styles/game-mode.scss';
import socket from '../socket';

const modes = [
  { id: 'EastBlueToWaterSeven', name: 'East Blue -> Water Seven' },
  { id: 'OnePieceFinalTest', name: 'One Piece Final Test' },
];

function GameMode({ roomCode, username, setSelectedMode }) {
  const [localSelectedMode, setLocalSelectedMode] = useState(null);

  const handleModeSelect = (modeId) => {
    console.log(`🎮 Mode sélectionné : ${modeId}`);
    setLocalSelectedMode(modeId);
    setSelectedMode(modeId); // remonte vers QuestionPage
    socket.emit('gameModeVote', { roomCode, username, modeId });
  };

  return (
    <div className="container-game-mode">
      {modes.map((mode) => (
        <div
          key={mode.id}
          className={`card-game-mode ${localSelectedMode === mode.id ? 'selected' : ''}`}
          onClick={() => handleModeSelect(mode.id)}
        >
          {mode.name}
        </div>
      ))}
    </div>
  );
}

export default GameMode;