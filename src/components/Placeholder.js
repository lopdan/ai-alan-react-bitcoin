import React, { useState } from 'react';

import './Placeholder.css';

const Placeholder = props => {
	const [profileState, setProfileState] = useState(props)
	const svgLocation = document.getElementsByClassName("linechart")[0].getBoundingClientRect();

	let placementStyles = {};
	let width = 100;
	placementStyles.width = width + 'px';
	placementStyles.left = profileState.hoverLoc + svgLocation.left - (width/2);

	return (
		<div className='hover' filter="url(#drop-shadow-0)" style={ placementStyles }>
			<div className='date'>{profileState.activePoint.d}</div>
			<div className='price'>{profileState.activePoint.p}</div>
		</div>
	)
}

export default Placeholder;
