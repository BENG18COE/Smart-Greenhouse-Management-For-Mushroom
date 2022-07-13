/* eslint-disable no-unused-vars */
import React from 'react'
import PropTypes from 'prop-types'
import { setCookie, getCookie } from '../libs/cookie'
import { darktheme, lighttheme } from '../libs/themes'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
// Context API
import { ThemeContext } from '../context'

const App = ({ Component, pageProps, previousTheme }) => {
  const [theme, setTheme] = React.useState(previousTheme)
  React.useEffect(() => {
    // Remove The Server-Side Injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  const toggleTheme = async () => {
    if (theme === 'light') {
      setTheme('dark')
      setCookie('theme', 'dark')
    } else {
      setTheme('light')
      setCookie('theme', 'light')
    }
  }

  return (
    <React.Fragment>
      <ThemeContext.Provider value={theme} >
        <ThemeContext.Consumer>
          {
            value =>
              <ThemeProvider theme={value === 'dark' ? darktheme : lighttheme} >
                <CssBaseline />
                <Component toggleTheme={toggleTheme} {...pageProps} />
              </ThemeProvider>
          }
        </ThemeContext.Consumer>
      </ThemeContext.Provider>
    </React.Fragment>
  )
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired
}

App.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {}
  let previousTheme = null
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx)
  }
  if (ctx.req) {
    previousTheme = await getCookie('theme', ctx.req.headers.cookie)
  }
  return {
    pageProps,
    previousTheme
  }
}

export default App
