import React from 'react'

import Register from './register'
function Regis(){

  return <Register/>

}

function Login() {
  return (
    <div className="bg-gradient-primary">
    <div className="container">
  {/* Outer Row */}
  <div className="row justify-content-center">
    <div className="col-xl-10 col-lg-12 col-md-9">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          {/* Nested Row within Card Body */}
          <div className="row">
            <div className="col-lg-6 d-none d-lg-block bg-login-image" />
            <div className="col-lg-6">
              <div className="p-5">
                <div className="text-center">
                  <h1 className="h4 text-gray-900 mb-4">SpheronClub - Welcome Back!</h1>
                </div>
                <form className="user">
                  <div className="form-group">
                    <input type="password" className="form-control form-control-user" id="pvKeyValue" aria-describedby="emailHelp" placeholder="Enter your private key" />
                    <input type="password" className="form-control form-control-user" id="pvKeyNewPasswordValue" aria-describedby="emailHelp" placeholder="Enter a new password" />
                  </div>
                  <a id="generateWalletPrivKeyButton" className="btn btn-primary btn-user btn-block">
                    Login with your private key
                  </a>
                  <p className="invalid-feedback" id="errorLogin" />
                  <hr />
                </form>
                <hr />
                <div className="text-center">
                  <a className="small"  onClick={Regis} href="/register" >Create an Account!</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div></div>

  )
}

export default Login