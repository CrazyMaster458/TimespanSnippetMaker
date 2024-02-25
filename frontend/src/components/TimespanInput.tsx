import PropTypes from 'prop-types';
import React from 'react';

export const TimespanInput = ({
  snippetStart,
  handleInputChangeStart,
  inputRefHoursStart,
  inputRefMinutesStart,
  inputRefSecondsStart,
  handleKeyDown,
}) => {
  return (
    <div>
      <div className="timespaninput flex group items-center h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background">
        <input
          type="number"
          name="hours"
          value={snippetStart.hours}
          onChange={handleInputChangeStart}
          maxLength={2}
          max={99}
          min={0}
          style={{
            width: '20px',
            textAlign: 'center',
          }}
          ref={inputRefHoursStart}
          onClick={() => inputRefHoursStart.current!.select()}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <span>:</span>
        <input
          type="number"
          name="minutes"
          value={snippetStart.minutes}
          onChange={handleInputChangeStart}
          maxLength={2}
          max={59}
          min={0}
          style={{ width: '20px', textAlign: 'center' }}
          ref={inputRefMinutesStart}
          onClick={() => inputRefMinutesStart.current!.select()}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <span>:</span>
        <input
          type="number"
          name="seconds"
          value={snippetStart.seconds}
          onChange={handleInputChangeStart}
          maxLength={2}
          max={59}
          min={0}
          style={{ width: '20px', textAlign: 'center' }}
          ref={inputRefSecondsStart}
          onClick={() => inputRefSecondsStart.current!.select()}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => handleKeyDown(e)}
        />
      </div>
    </div>
  );
};

TimespanInput.propTypes = {
  snippetStart: PropTypes.shape({
    hours: PropTypes.string.isRequired,
    minutes: PropTypes.string.isRequired,
    seconds: PropTypes.string.isRequired,
  }).isRequired,
  handleInputChangeStart: PropTypes.func.isRequired,
  inputRefHoursStart: PropTypes.object.isRequired,
  inputRefMinutesStart: PropTypes.object.isRequired,
  inputRefSecondsStart: PropTypes.object.isRequired,
  handleKeyDown: PropTypes.func.isRequired,
};
