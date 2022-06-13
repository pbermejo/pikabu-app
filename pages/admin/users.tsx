import { useState, useEffect } from 'react'
import { DeleteOutlined, PeopleOutline } from '@mui/icons-material'
import useSWR from 'swr'

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { Grid, Select, MenuItem, IconButton, Typography } from '@mui/material'

import { AdminLayout } from '../../components/layouts'
import { IRole, IUser } from '../../interfaces'
import { pikabuApi } from '../../api'

const UsersPage = () => {
	const { data, error } = useSWR<IUser[]>('/api/admin/users')
	const [users, setUsers] = useState<IUser[]>([])

	useEffect(() => {
		if (data) {
			setUsers(data)
		}
	}, [data])

	if (!data && !error) return <></>

	const onRoleUpdated = async (userId: string, newRole: IRole) => {
		const previosUsers = users.map(user => ({ ...user }))
		const updatedUsers = users.map(user => ({
			...user,
			role: userId === user._id ? newRole : user.role,
		}))

		setUsers(updatedUsers)

		try {
			await pikabuApi.put(`/admin/users/${userId}`, { role: newRole })
		} catch (error) {
			setUsers(previosUsers)
			console.log(error)
			alert('No se pudo actualizar el role del usuario')
		}
	}

	const onDeleteUser = async (userId: string) => {
		// Delete from collection
		const updatedUsers = users.filter(user => {
			return user._id !== userId
		})

		setUsers(updatedUsers)

		// Delete from db
		try {
			await pikabuApi.delete(`/admin/users/${userId}`)
		} catch (error) {
			setUsers(users)
			console.log(error)
			alert('No se pudo borrar el usuario')
		}
	}

	const columns: GridColDef[] = [
		{ field: 'email', headerName: 'Correo', width: 250 },
		{ field: 'name', headerName: 'Nombre completo', width: 300 },
		{
			field: 'role',
			headerName: 'Rol',
			width: 300,
			renderCell: ({ row }: GridValueGetterParams) => {
				if (row.role === 'super-user') {
					return <Typography>Super User (unmodifiable)</Typography>
				}
				return (
					<Select
						value={row.role}
						label='Rol'
						onChange={({ target }) => onRoleUpdated(row.id, target.value)}
						sx={{ width: '300px' }}
					>
						<MenuItem value='admin'> Admin </MenuItem>
						<MenuItem value='client'> Client </MenuItem>
					</Select>
				)
			},
		},
		{
			field: 'delete',
			headerName: 'Borrar',
			renderCell: ({ row }: GridValueGetterParams) => {
				return (
					<IconButton color='error' disabled={row.role === 'super-user'} onClick={() => onDeleteUser(row.id)}>
						<DeleteOutlined />
					</IconButton>
				)
			},
		},
	]

	const rows = users.map(user => ({
		id: user._id,
		email: user.email,
		name: user.name,
		role: user.role,
	}))

	return (
		<AdminLayout title={'Usuarios'} subTitle={'Mantenimiento de usuarios'} icon={<PeopleOutline />}>
			<Grid container className='fadeIn'>
				<Grid item xs={12} sx={{ height: 450, width: '100%' }}>
					<DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
				</Grid>
			</Grid>
		</AdminLayout>
	)
}

export default UsersPage
