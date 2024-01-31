import Top from './Top'
import Bottom from './Bottom'

export default function Layout({ children }) {
  return (
    <>
      <Top />
      <main>{children}</main>
      <Bottom />
    </>
  )
}