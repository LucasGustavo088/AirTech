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
import api from "services/api";
import { getToken } from "services/auth";
import Utils from "utils/utils";
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CustomSelect from "components/CustomSelect/CustomSelect";

export default class CreatePerfilAmostras extends React.Component {

  constructor(props) {
    super(props);
    this.getDeviceAjax();


    this.state = {
      equipamentos: [],
      sensores: [],
    }
  };

  getDeviceAjax = () => {
    let url = api.baseUrl + "equipamento";
    axios({
      method: 'get',
      url: url,
      headers: {
        "Authorization": getToken()
      }
    }).then(res => {
      console.log('res', res);
      let equipamentosItens = [];
      if (typeof res.data.data.equipamentosCadastrados != "undefined") {
        res.data.data.equipamentosCadastrados.forEach((item) => {
          equipamentosItens.push({ id: item.id, text: item.nome });
        });
      }
      this.setState({
        equipamentos: equipamentosItens
      });

      let sensoresItens = [];
      if (typeof res.data.data.sensores != "undefined") {
        res.data.data.sensores.forEach((item) => {
          sensoresItens.push({ id: item.id, text: item.nome });
        });
      }
      this.setState({
        sensores: sensoresItens
      });
    });
  }

  createAjax() {
    let dataInicioColeta = document.getElementById("dataInicioColeta").value;
    let dataTerminoColeta = document.getElementById("dataTerminoColeta").value;
    let tempoExposicao = parseInt(document.getElementById("tempoExposicao").value);
    let equipamentos = document.getElementById("equipamentos").value;
    let sensores = document.getElementById("sensores").value;
    let url = api.baseUrl + "amostra/cadastrarPerfil";

    equipamentos = equipamentos.split(',');
    let arrayEquipamentos = [];
    equipamentos.forEach((item) => {
      arrayEquipamentos.push({
        "id": item
      });
    });
    equipamentos = arrayEquipamentos;

    sensores = sensores.split(',');
    let arraySensores = [];
    sensores.forEach((item) => {
      arraySensores.push({
        "id": item
      });
    });
    sensores = arraySensores;

    let perfilAmostra = {
      dataInicioColeta: dataInicioColeta,
      dataTerminoColeta: dataTerminoColeta,
      tempoExposicao: tempoExposicao,
      equipamentos: equipamentos,
      sensores: sensores,
    };

    let token = getToken();

    /* Val(puidação */

    if (token == "") {
      Utils.alertAirtech("Houve um erro ao obter o token");
    } else {
      axios({
        method: 'post',
        url: url,
        headers: {
          "Authorization": token
        },
        data: perfilAmostra
      }).then(res => {
        if (res.data.success) {
          Utils.alertAirtech("Perfil de amostra adicionada com sucesso.", "success");
        } else {
          Utils.alertAirtech("Não foi possível adicionar", "error");
        }
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
                }}>Adicionar perfil de amostra</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Data do ínicio da coleta"
                      id="dataInicioColeta"
                      inputProps={{
                        type: "text"
                      }}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Data do término da coleta"
                      id="dataTerminoColeta"
                      inputProps={{
                        type: "text"
                      }}
                      formControlProps={{
                        fullWidth: true
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomInput
                      labelText="Tempo de exposição (min)"
                      id="tempoExposicao"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "number"
                      }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomSelect
                      labelText="Equipamentos"
                      id="equipamentos"
                      formControlProps={{
                        fullWidth: true
                      }}
                      selectProps={{
                        type: "text",
                        placeholder: this.state.equipmentosPlaceholder,
                        multiple: true
                      }}
                    >
                      {this.state.equipamentos.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.text}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <CustomSelect
                      labelText="Sensores"
                      id="sensores"
                      formControlProps={{
                        fullWidth: true
                      }}
                      selectProps={{
                        type: "text",
                        placeholder: this.state.equipmentosPlaceholder,
                        multiple: true
                      }}
                    >
                        {this.state.sensores.map(item => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.text}
                        </MenuItem>
                      ))}
                    </CustomSelect>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>

                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="primary" onClick={this.createAjax}>Adicionar</Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div >
    );
  }
}
