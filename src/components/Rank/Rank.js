import React from 'react';


const Rank = ({ name, entries }) => {
  return (
    <div>
      <div className='white f2'>
        {`${name}, I think you might be hella handsome!!`}
      </div>
      <div className='white f1'>
     	<p className='white f3'>{'People that agree:'}</p>
        {entries}
      </div>
    </div>
  );
}

export default Rank;