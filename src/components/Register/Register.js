import React from 'react'

class Register extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      email : '',
      password : '',
      name :'',
      fields: {}
    }
  }

  onNameChange = (event) =>{
    this.setState( {name : event.target.value} )
}


  onEmailChange = (event) =>{
      this.setState( {email : event.target.value} )
      this.handleChange.bind(this, "email")
      if (!this.state.email===undefined){
        let lastAtPos = this.state.fields["email"].lastIndexOf('@');
        let lastDotPos = this.state.fields["email"].lastIndexOf('.');
        if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state.fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (this.state.fields["email"].length - lastDotPos) > 2)) {
          
        return alert("invalid")
      }
    }
  }

  onPasswordChange = (event)=>{
    this.setState( {password : event.target.value} )
}

  onSubmitSignIn = () =>{
    fetch('https://safe-refuge-63628.herokuapp.com/register',{
      method : 'post',
      requestCert: true,
      headers : {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email : this.state.email,
        password : this.state.password,
        name : this.state.name
      })
    })
      .then(response => response.json())
      .then(user => {
        if( user.id ){
          this.props.loaduser(user);
          this.props.onRouteChange('home');
        }
      })
    
  }
  handleChange(field, e){         
    let fields = this.state.fields;
    fields[field] = e.target.value;        
    this.setState({fields});
}


  render(){
    return (
      <form className="bw2 br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 center shadow-5">
      <main className="pa4 black-80">
<div className="measure ">
  <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
    <legend className="f3 fw6 ph0 mh0 white">Register</legend>
    <div className="mt3">
      <label className="db fw6 lh-copy f4 white" htmlFor="email-address">Name</label>
      <input 
        onChange= {this.onNameChange}
      className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" name="name"  id="name" required/>
    </div>
    <div className="mt3">
      <label className="db fw6 lh-copy f4 white" htmlFor="email-address">Email</label>
      <input value={this.state.fields["email"]} 
        onChange= { this.onEmailChange}
       className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  
       id="email-address" required
       pattern=".+@foo.com"
       />
    </div>
    <div className="mv3">
      <label className="db fw6 lh-copy f4 white" htmlFor="password">Password</label>
      <input
       onChange={this.onPasswordChange}
       className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" required/>
    </div>
  </fieldset>
  <div className="">
    <input 
      onClick={this.onSubmitSignIn}
    className="white b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f4 dib" type="submit" value="Register" />
  </div><br></br><br></br>
  
</div>
</main>
  </form>
  );
  }
   
}

export default Register;