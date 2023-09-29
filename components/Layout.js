import Top from './Top'
import Bottom from './Bottom'

export default function Layout({ children }) {
  return (
    <>
      <Top />
      <main className="px-8 lg:px-10">{children}</main>
      <Bottom />
    </>
  )
}