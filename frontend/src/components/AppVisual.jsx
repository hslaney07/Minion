function Header() {
  return (
    <header className="header">
        <h1>{import.meta.env.VITE_APP_NAME}</h1>
    </header>
  );
}

function LoginButton(){
  return(
    <div className="container">
      <button className="generic-button-home-page" onClick={() => window.location.href = `${import.meta.env.VITE_BACKEND_URL}/login`}>
      Login with Spotify
      </button>
    </div>
  )
}

export default function AppVisual() {
  return (
     <div>
        <Header/>
        <LoginButton/>
      </div>
  );
}