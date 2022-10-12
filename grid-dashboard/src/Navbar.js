import {Link, useMatch, useResolvedPath} from "react-router-dom"

export default function Navbar() {
    return (
        <nav className="nav">
            <Link to="/">
                <img className="logo" src={require('.//iso_logo.png')} alt="logo"/>
            </Link>
            <ul>
                <CustomLink to="/dataComparison">Data Comparison</CustomLink>
                <CustomLink to="/scenarioStatistics">Scenario Statistics</CustomLink>
            </ul>
        </nav>
    );
}

function CustomLink({to, children, ...props}) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
  
    return (
      <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>{children}</Link>
        </li>
    );

}