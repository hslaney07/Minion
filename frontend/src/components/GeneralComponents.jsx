import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  return (
    <header className="header">
      <Link to="/Home" className="header-title">
        <h1>{import.meta.env.VITE_APP_NAME}</h1>
      </Link>
      <button onClick={() => navigate('/Home')} className="home-button">
        Home
      </button>
    </header>
  );
}

export function NoDataAvailable({message}){
  return (
  <div className="no-data-available">
    <p>{message}</p>
    <p>
      Recommend trying to relogin:&nbsp;
      <a href={import.meta.env.VITE_HOMEPAGE_URL}>{import.meta.env.VITE_HOMEPAGE_URL}</a>
    </p>
  </div>
  );
}

export function ErrorLoadingPage(){
  return (
  <>
    <Header />
     <div className="no-data-available">
        <p>Error Loading Page</p>
     </div>
  </>
  );
}

export function LoadingSpinner(){
  return(<div className="no-data-available">
        <p>Loading Content...</p>
        <div className="spinner" />
      </div>);
}


export function LoadingVisual(){
  return (
    <>
      <Header />
      <LoadingSpinner />
    </>
  );
}

