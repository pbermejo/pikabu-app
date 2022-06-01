import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { SWRConfig } from 'swr'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { lightTheme } from '../themes'
import { AuthProvider, CartProvider, UiProvider } from '../context'

/**
 * Client app entry point
 */
function MyApp({ Component, pageProps }: AppProps) {
	return (
		// All Providers are available app wide
		<SessionProvider>
			<PayPalScriptProvider options={{ 'client-id': process.env.NEXT_PUBLIC_PAYPAL_ID || '' }}>
				<SWRConfig
					value={{
						// refreshInterval: 3000,
						fetcher: (resource, init) => fetch(resource, init).then(res => res.json()),
					}}
				>
					<AuthProvider>
						<CartProvider>
							<UiProvider>
								{/* Provider for UI */}
								<ThemeProvider theme={lightTheme}>
									{/* Provider for theming */}
									<CssBaseline /> {/* CSS reset */}
									<Component {...pageProps} />
									{/* Current component (Mainly pages) */}
								</ThemeProvider>
							</UiProvider>
						</CartProvider>
					</AuthProvider>
				</SWRConfig>
			</PayPalScriptProvider>
		</SessionProvider>
	)
}

export default MyApp
