import {
	SearchOutlined,
	ShoppingCartCheckoutOutlined,
	ClearOutlined,
	MenuOutlined,
	HelpOutlineOutlined,
} from '@mui/icons-material'
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { CartContext, UiContext } from '../../context'

/**
 * Component for app top navigation
 * @param param0 object implementing Props interface
 * @returns component layout in html
 */
export const Navbar = () => {
	const { asPath, push } = useRouter()
	const { toggleSideMenu } = useContext(UiContext)
	const [searchTerm, setSearchTerm] = useState('')
	const [isSearchVisible, setIsSearchVisible] = useState(false)
	const { summary } = useContext(CartContext)

	const onSearchTerm = () => {
		if (searchTerm.trim().length === 0) return

		push(`/search/${searchTerm}`)
	}

	return (
		<AppBar>
			<Toolbar>
				{/* Logo */}
				<NextLink href='/' passHref>
					<Link display='flex' alignItems='center'>
						<Typography variant='h6'>Pikabu | </Typography>
						<Typography sx={{ marginLeft: 0.5, marginTop: 0.4 }}>Shop</Typography>
					</Link>
				</NextLink>

				<Box flex={1} />

				{/* Main Categories */}
				<Box
					sx={{
						display: isSearchVisible ? 'none' : { xs: 'none', sm: 'flex' },
					}}
					className='fadeIn'
				>
					<NextLink href='/category/men' passHref>
						<Link>
							<Button
								color='info'
								size='medium'
								variant={asPath.includes('/category/men') ? 'contained' : 'text'}
							>
								Hombres
							</Button>
						</Link>
					</NextLink>
					<NextLink href='/category/women' passHref>
						<Link>
							<Button
								color='info'
								size='medium'
								variant={asPath.includes('/category/women') ? 'contained' : 'text'}
							>
								Mujeres
							</Button>
						</Link>
					</NextLink>
					<NextLink href='/category/kids' passHref>
						<Link>
							<Button
								color='info'
								size='medium'
								variant={asPath.includes('/category/kids') ? 'contained' : 'text'}
							>
								Niños
							</Button>
						</Link>
					</NextLink>
				</Box>

				{/* Separator */}
				<Box flex={1} />

				{/* Search Box big screen */}
				{isSearchVisible ? (
					<Input
						type='text'
						placeholder='Buscar...'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						onKeyPress={e => (e.key === 'Enter' ? onSearchTerm() : null)}
						autoFocus
						sx={{ display: { xs: 'none', sm: 'flex' } }}
						className='fadeIn'
						endAdornment={
							<InputAdornment position='end'>
								<IconButton
									aria-label='toggle password visibility'
									onClick={() => setIsSearchVisible(false)}
								>
									<ClearOutlined />
								</IconButton>
							</InputAdornment>
						}
					/>
				) : (
					<IconButton onClick={() => setIsSearchVisible(true)} className='fadeIn'>
						<SearchOutlined />
					</IconButton>
				)}

				{/* Search Box small screen */}
				<IconButton sx={{ display: { xs: 'flex', sm: 'none' } }} onClick={toggleSideMenu}>
					<SearchOutlined />
				</IconButton>

				{/* Shopping cart */}
				<NextLink href='/cart' passHref>
					<Link display='flex' alignItems='center'>
						<IconButton>
							<Badge
								badgeContent={summary.numberOfItems > 9 ? '+9' : summary.numberOfItems}
								color='secondary'
							>
								<ShoppingCartCheckoutOutlined />
							</Badge>
						</IconButton>
					</Link>
				</NextLink>

				<NextLink href='/help' passHref>
					<Link display='flex' alignItems='center'>
						<IconButton>
							<HelpOutlineOutlined />
						</IconButton>
					</Link>
				</NextLink>

				<IconButton onClick={toggleSideMenu} size='medium'>
					<MenuOutlined />
				</IconButton>
			</Toolbar>
		</AppBar>
	)
}
