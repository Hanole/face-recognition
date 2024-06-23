import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import icon from './icon.png';

const Logo = () => {
	return (
		<div className='ma4 mt0'>
			<Tilt scale={0.9} className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
        <div className="Tilt-inner pa3"><img style={{paddingTop: '20px'}} alt='icon' src={icon}/>
        </div>
      </Tilt>
		</div>
		);
}

export default Logo;