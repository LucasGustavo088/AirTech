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
import axios from 'axios';

export default class CreateDevice extends React.Component {
    
    createAjax() {
        let pin = parseInt(document.getElementById("pin").value);
        let nome = document.getElementById("nome").value;
        let descricao = document.getElementById("descricao").value;
        let url = "https://cors-anywhere.herokuapp.com/http://ec2-34-220-121-112.us-west-2.compute.amazonaws.com/api/v1/equipamento";
    
      let device = {
        pin: pin,
        nome: nome,
        descricao: descricao,
      };

      let token = localStorage.getItem("token");

      if(token == "") {
        alert("Houve um erro ao obter o token");
      } else {
        axios({
          method: 'post',
          url: url,
          headers: {
            "Authorization" : token
          }, 
          data: device
        }).then(res => {
          console.log(res);
        });
      }
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
                textDecoration: "none"
            }
        };

        return (
            <div>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <Card>
                    <CardHeader color="primary">
                      <h4 style={{
                color: "#FFFFFF",
                marginTop: "0px",
                minHeight: "auto",
                fontWeight: "300",
                fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                marginBottom: "3px",
                textDecoration: "none"
            }}>Adicionar</h4>
                      <p style={{
              color: "rgba(255,255,255,.62)",
            margin: "0",
            fontSize: "14px",
            marginTop: "0",
            marginBottom: "0"
            }}>Adicionar aparelho</p>
                    </CardHeader>
                    <CardBody>
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                          <CustomInput
                            labelText="PIN do aparelho"
                            id="pin"
                            formControlProps={{
                              fullWidth: true
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                          <CustomInput
                            labelText="Nome do aparelho"
                            id="nome"
                            formControlProps={{
                              fullWidth: true
                            }}
                          />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                          <CustomInput
                            labelText="Descrição"
                            id="descricao"
                            formControlProps={{
                              fullWidth: true
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                    </CardBody>
                    <CardFooter>
                      <Button color="primary" onClick={this.createAjax}>Adicionar</Button>
                    </CardFooter>
                  </Card>
                </GridItem>
              </GridContainer>
            </div>
          );
    }
}
