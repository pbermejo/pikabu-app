// SideMenu Component

import {
	SearchOutlined,
	AccountCircleOutlined,
	ConfirmationNumberOutlined,
	MaleOutlined,
	FemaleOutlined,
	EscalatorWarningOutlined,
	VpnKeyOutlined,
	LoginOutlined,
	CategoryOutlined,
	AdminPanelSettings,
	DashboardOutlined,
} from '@mui/icons-material'
import {
	Box,
	Divider,
	Drawer,
	IconButton,
	Input,
	InputAdornment,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListSubheader,
} from '@mui/material'
import { useContext, useState } from 'react'
import { AuthContext, UiContext } from '../../context'
import { useRouter } from 'next/router'

/**
 * Component for app side menu
 * @param param0 object implementing Props interface
 * @returns component layout in html
 */
export const SideMenu = () => {
	const { isMenuOpen, toggleSideMenu } = useContext(UiContext)
	const { user, isLoggedIn, logout } = useContext(AuthContext)
	const [searchTerm, setSearchTerm] = useState('')
	const router = useRouter()

	const onLogout = () => {
		logout()
	}

	const onSearchTerm = () => {
		if (searchTerm.trim().length === 0) return

		navigateTo(`/search/${searchTerm}`)
	}

	const navigateTo = (url: string) => {
		toggleSideMenu()
		router.push(url)
	}

	return (
		<Drawer
			open={isMenuOpen}
			onClose={toggleSideMenu}
			anchor='right'
			sx={{ backdropFilter: 'blur(4px)', transition: 'all .5s ease-out' }}
		>
			<Box sx={{ width: 250, paddingTop: 5 }}>
				<List>
					<ListItem>
						<Input
							type='text'
							placeholder='Buscar...'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							onKeyPress={e => (e.key === 'Enter' ? onSearchTerm() : null)}
							autoFocus
							endAdornment={
								<InputAdornment position='end'>
									<IconButton aria-label='toggle password visibility' onClick={onSearchTerm}>
										<SearchOutlined />
									</IconButton>
								</InputAdornment>
							}
						/>
					</ListItem>

					{isLoggedIn && (
						<>
							<ListItem button onClick={() => navigateTo('/profile')}>
								<ListItemIcon>
									<AccountCircleOutlined />
								</ListItemIcon>
								<ListItemText primary={'Perfil'} />
							</ListItem>

							<ListItem button onClick={() => navigateTo('/orders/history')}>
								<ListItemIcon>
									<ConfirmationNumberOutlined />
								</ListItemIcon>
								<ListItemText primary={'Mis Pedidos'} />
							</ListItem>
						</>
					)}

					<ListItem
						button
						sx={{ display: { xs: '', sm: 'none' } }}
						onClick={() => navigateTo('/category/men')}
					>
						<ListItemIcon>
							<MaleOutlined />
						</ListItemIcon>
						<ListItemText primary={'Hombres'} />
					</ListItem>

					<ListItem
						button
						sx={{ display: { xs: '', sm: 'none' } }}
						onClick={() => navigateTo('/category/women')}
					>
						<ListItemIcon>
							<FemaleOutlined />
						</ListItemIcon>
						<ListItemText primary={'Mujeres'} />
					</ListItem>

					<ListItem
						button
						sx={{ display: { xs: '', sm: 'none' } }}
						onClick={() => navigateTo('/category/kids')}
					>
						<ListItemIcon>
							<EscalatorWarningOutlined />
						</ListItemIcon>
						<ListItemText primary={'Niños'} />
					</ListItem>

					{isLoggedIn ? (
						<ListItem button onClick={onLogout}>
							<ListItemIcon>
								<LoginOutlined />
							</ListItemIcon>
							<ListItemText primary={'Salir'} />
						</ListItem>
					) : (
						<ListItem button onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}>
							<ListItemIcon>
								<VpnKeyOutlined />
							</ListItemIcon>
							<ListItemText primary={'Entrar'} />
						</ListItem>
					)}

					{/* Admin */}
					{user?.role === 'admin' && (
						<>
							<Divider />
							<ListSubheader>Admin Panel</ListSubheader>

							<ListItem button onClick={() => navigateTo('/admin/')}>
								<ListItemIcon>
									<DashboardOutlined />
								</ListItemIcon>
								<ListItemText primary={'Dashboard'} />
							</ListItem>

							<ListItem button onClick={() => navigateTo('/admin/products')}>
								<ListItemIcon>
									<CategoryOutlined />
								</ListItemIcon>
								<ListItemText primary={'Productos'} />
							</ListItem>

							<ListItem button onClick={() => navigateTo('/admin/orders')}>
								<ListItemIcon>
									<ConfirmationNumberOutlined />
								</ListItemIcon>
								<ListItemText primary={'Pedidos'} />
							</ListItem>

							<ListItem button onClick={() => navigateTo('/admin/users')}>
								<ListItemIcon>
									<AdminPanelSettings />
								</ListItemIcon>
								<ListItemText primary={'Usuarios'} />
							</ListItem>
						</>
					)}
				</List>
			</Box>
		</Drawer>
	)
}
