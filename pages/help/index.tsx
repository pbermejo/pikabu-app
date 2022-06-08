import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ShopLayout } from '@/components/layouts'
import { ProductSlideshow } from '../../components/products/ProductSlideshow'

const HelPPage = () => {
	return (
		<ShopLayout title='Ayuda' pageDescription='Página de ayuda de usuario de Pikabu'>
			<Typography component='h1' variant='h1' sx={{ mb: 2 }}>
				Ayuda
			</Typography>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography component='h2' variant='h2'>
						Caso 1: Registro y autenticación mediante usuario y contraseña
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>Desde la pantalla principal se accede al login y al registro:</Typography>
					<ol>
						<li>Menú `{'>'}` Entrar.</li>
						<li>Tocar en “¿No tienes cuenta?”.</li>
						<li>Cubre los datos del formulario y regístrate.</li>
						<li>Tu usuario ya está registrado y autenticado automáticamente.</li>
					</ol>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography component='h2' variant='h2'>
						Caso 2: Registro y autenticación mediante OAuth
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>Desde la pantalla principal se accede al login:</Typography>
					<ol>
						<li>Menú `{'>'}` Entrar.</li>
						<li>Tocar en “Github” para ser redirigido al login de github. </li>
						<li>
							Si ya te has autenticado anteriormente en Github y la sesión mediante cookie es todavía
							válida el proceso acaba aquí y ya estás registrado y autenticado en Pikabu también.
						</li>
						<li>Hacer login/registro en Github.</li>
						<li>Conceder acceso a la aplicación Pikabu.</li>
						<li>Serás redirigido a Pikabu.</li>
						<li>Tu usuario ya está registrado y autenticado automáticamente.</li>
					</ol>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography component='h2' variant='h2'>
						Caso 3: Búsqueda de productos, compra y pago con Paypal
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>Desde la pantalla principal:</Typography>
					<ol>
						<li>Toca en la lupa para abrir el buscador.</li>
						<li>Escribe algo, por ejemplo “shirt” (Los productos están en inglés).</li>
						<li>
							Accede a algunos productos disponibles y selecciona talla y cantidad (mín: 1, máx: stock).
						</li>
						<li>
							Accede a la cesta de compra.
							<ul>
								<li>Puedes modificar la cantidad (mín: 1, máx: stock).</li>
								<li>Puedes eliminar el producto de la cesta.</li>
								<li>Puedes seguir navegando y repetir el paso 3</li>
							</ul>
						</li>
						<li>Toca “comprar” para acceder al resumen del pedido. </li>
						<li>
							Si no estás autenticado, la aplicación te pedirá que lo hagas. Consulta los casos 1 y 2 de
							este manual.
						</li>
						<li>Cubre los datos de envío del pedido.</li>
						<li>
							Revisa tu pedido en el resumen.
							<ul>
								<li>Puedes volver a editar tanto los datos de envío como los productos del pedido</li>
							</ul>
						</li>
						<li>
							Se ha creado tu pedido y sólo falta pagarlo.
							<ul>
								<li>Puedes consultar el estado de tu pedido en “Menú `{'>'}` Mis pedidos”.</li>
							</ul>
						</li>
						<li>
							Toca en PayPal para pagar para ser redirigido al login de PayPal. Introduce los datos de
							usuario y contraseña de pruebas proporcionados en el Anexo II: Usuarios de Pruebas.
						</li>
						<li>Se realizará el pago y serás redirigido a tu historial de pedidos.</li>
					</ol>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography component='h2' variant='h2'>
						Caso 4: (Admin) Estadísticas del sitio
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>
						Desde la pantalla principal se accede al login con un usuario administrador:
					</Typography>
					<ol>
						<li>
							Menú `{'>'}` Entrar `{'>'}` (Si no estás logueado).
						</li>
						<li>Menu `{'>'}` Dashboard.</li>
					</ol>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography component='h2' variant='h2'>
						Caso 5: (Admin) Modificación de rol de usuario
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>
						Desde la pantalla principal se accede al login con un usuario administrador:
					</Typography>
					<ol>
						<li>
							Menú `{'>'}` Entrar `{'>'}` (Si no estás logueado).
						</li>
						<li>Menu `{'>'}` Usuarios.</li>
						<li>Selecciona el nuevo rol para el usuario .</li>
						<li>Se actualizará el rol del usuario en la base de datos.</li>
					</ol>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography component='h2' variant='h2'>
						Caso 6: (Admin) Eliminación de usuario
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>
						Desde la pantalla principal se accede al login con un usuario administrador:
					</Typography>
					<ol>
						<li>
							Menú `{'>'}` Entrar `{'>'}` (Si no estás logueado).
						</li>
						<li>Menu `{'>'}` Usuarios.</li>
						<li>Toca borrar usuario .</li>
						<li>Se eliminará el usuario de la base de datos.</li>
					</ol>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography component='h2' variant='h2'>
						Caso 7: (Admin) Creación de ProductSlideshow
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>
						Desde la pantalla principal se accede al login con un usuario administrador:
					</Typography>
					<ol>
						<li>Menú `{'>'}` Entrar (Si no estás logueado).</li>
						<li>Menu `{'>'}` Productos.</li>
						<li>Toca en “Crear producto”.</li>
						<li>Cubre los datos de producto.</li>
						<li>Añade imágenes del producto.</li>
						<li>Toca guardar.</li>
						<li>Se creará el producto en la base de datos</li>
					</ol>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography component='h2' variant='h2'>
						Caso 8: (Admin) Modificación de producto
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>
						Desde la pantalla principal se accede al login con un usuario administrador:
					</Typography>
					<ol>
						<li>Menú `{'>'}` Entrar (Si no estás logueado).</li>
						<li>Menu `{'>'}` Productos.</li>
						<li>Selecciona el producto para modificar.</li>
						<li>Modifica los datos de producto.</li>
						<li>Toca guardar.</li>
						<li>Se actualizará el producto en la base de datos</li>
					</ol>
				</AccordionDetails>
			</Accordion>
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography component='h2' variant='h2'>
						Caso 9: (Admin) Eliminación de producto
					</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Typography>
						Desde la pantalla principal se accede al login con un usuario administrador:
					</Typography>
					<ol>
						<li>Menú `{'>'}` Entrar (Si no estás logueado).</li>
						<li>Menu `{'>'}` Productos.</li>
						<li>Toca el botón de eliminar producto.</li>
						<li>Se eliminará el producto de la base de datos</li>
					</ol>
				</AccordionDetails>
			</Accordion>
		</ShopLayout>
	)
}

export default HelPPage
