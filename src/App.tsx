import { BrowserRouter } from 'react-router'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import DataLoader from '@/components/DataLoader'
import Views from '@/views'
import appConfig from './configs/app.config'
import './locales'

if (appConfig.enableMock) {
    import('./mock')
}

function App() {
    return (
        <Theme>
            <BrowserRouter>
                <AuthProvider>
                    <DataLoader>
                        <Layout>
                            <Views />
                        </Layout>
                    </DataLoader>
                </AuthProvider>
            </BrowserRouter>
        </Theme>
    )
}

export default App
