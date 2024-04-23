import "@styles/global.scss";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import Themeregistry from "@components/themeregistry";

export const metadata = {
  title: "AfterSchoolLife",
  description: "Description needs to be adeed",
  // author: "Shanephear John Cleetus",
  // keywords: ""
};
import Navbar from "@components/Navbar";
import RootComponent from "@components/root";
import AuthComponent from "@components/auth";
const RootLayout = ({ children }) => {
  console.log(children)
  return <html lang='en'>
    <head>
      <meta charSet="UTF-8"></meta>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
    </head>
    <body>
      <AppRouterCacheProvider options={{ key: 'css' }}>
        <Themeregistry>
          <RootComponent>
            <AuthComponent>
              {children}
            </AuthComponent>
          </RootComponent>
        </Themeregistry>
      </AppRouterCacheProvider>
    </body>
  </html>
}

export default RootLayout;