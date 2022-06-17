import { FC } from 'react'
import { Slide } from 'react-slideshow-image'

import 'react-slideshow-image/dist/styles.css'
import styles from './ProductSlideshow.module.css'

/**
 * Contract for component props
 */
interface Props {
	images: string[]
}

/**
 * Component for showing a slideshow of product images
 * @param param0 object implementing Props interface
 * @returns component layout in html
 */
export const ProductSlideshow: FC<Props> = ({ images }) => {
	return (
		<Slide easing='ease' duration={7000} indicators>
			{images.map(image => {
				return (
					<div className={styles['each-slide']} key={image}>
						<div
							style={{
								backgroundImage: `url(${image})`,
								backgroundSize: 'cover',
								borderRadius: '5px',
							}}
						></div>
					</div>
				)
			})}
		</Slide>
	)
}
