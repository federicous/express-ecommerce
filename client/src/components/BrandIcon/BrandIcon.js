import React from 'react'
import './BrandIcon.css'
// import logo from '../BrandIcon/logo-brmtools2.png'
import logo from '../BrandIcon/logo-brmtools.webp'
import { Box, width } from '@material-ui/system'

const BrandIcon = () => {
	return (
		<Box
		sx={{mr:3, my:1}}
		>
			<img style={{width:"130px"}}
			        src={logo}
				// srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
				alt="Sin logo"
				loading="lazy"
			/>
		</Box>
		// 	<svg className="mainIcon Iconflex-shrink-0 fill-current" 
		// 	xmlns="http://www.w3.org/2000/svg"
		// 	 fill="currentColor" viewBox="0 0 512 512">
		// 		 <title>Cube</title>
		// 		 <path d="M440.9 136.3a4 4 0 000-6.91L288.16 40.65a64.14 64.14 0 00-64.33 0L71.12 129.39a4 4 0 000 6.91L254 243.88a4 4 0 004.06 0zM54 163.51a4 4 0 00-6 3.49v173.89a48 48 0 0023.84 41.39L234 479.51a4 4 0 006-3.46V274.3a4 4 0 00-2-3.46zM272 275v201a4 4 0 006 3.46l162.15-97.23A48 48 0 00464 340.89V167a4 4 0 00-6-3.45l-184 108a4 4 0 00-2 3.45z"/>


		// 	</svg>
		// 	<img 
		// 	        src={logo}
		// 		// srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
		// 		alt="Sin logo"
		// 		loading="lazy"
		// 	/>
		// </div>
	)
}

export default BrandIcon


