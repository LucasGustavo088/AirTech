import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import avatar from "assets/img/faces/marc.jpg";
import skyBackground from "assets/img/background-sky.jpg";
import logo from "assets/img/logo.png";
import { Link } from "react-router-dom";
import axios from 'axios';

export default class Login extends React.Component {
  
  loginAjax() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let url = "https://cors-anywhere.herokuapp.com/http://ec2-34-220-121-112.us-west-2.compute.amazonaws.com/api/v1/usuario/login";
    
      let user = {
        email: email,
        senha: password
      };

      axios.post(url, user)
      .then(res => {
        // if(typeof res.data.token != 'undefined') {
          console.log(res.data.data.token);
          
          if(typeof res.data.data.token != 'undefined') {
            localStorage.setItem('token', res.data.data.token);
          } else {
            alert("Não deu certo o login");
          }
        // }
      })
  }

  render() {
    let styles = {
      cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
      },
      cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        textAlign: "center"
      },
      gridItemCenter: {
        margin: "0 auto",
        marginTop: "30px"
      },
    
    };

    return (
      <div style={{background: "url(" + skyBackground + ") no-repeat center top", height: "900px"}}>
        <GridContainer>
          <img style={{margin: "0 auto", marginTop: "30px"}} src={logo}></img>
        </GridContainer>
        <GridContainer>
          <GridItem style={styles.gridItemCenter} xs={10} sm={4} md={4}>
            <Card>
              <CardHeader color="primary">
                <h4 style={{
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        textAlign: "center"
      }}>Logar</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Email"
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: "mariana.mendes@gmail.com"
                      }}
                    />
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                    <CustomInput
                      labelText="Senha"
                      id="password"
                      inputProps={{
                        type: "password"
                      }}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              {/* <Link to={'/admin/dashboard'}> */}
                <CardFooter>
                    <Button className="MuiGrid-grid-xs-12 MuiGrid-grid-sm-12 MuiGrid-grid-md-12" onClick={this.loginAjax} color="primary">Logar</Button>
                </CardFooter>
              {/* </Link> */}
              <Link to={'/register'}>
                <CardFooter>
                  <Button className="MuiGrid-grid-xs-12 MuiGrid-grid-sm-12 MuiGrid-grid-md-12" color="primary">Registrar</Button>
                </CardFooter>
              </Link>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
  
}
