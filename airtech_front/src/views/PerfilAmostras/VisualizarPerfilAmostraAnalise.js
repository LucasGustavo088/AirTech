import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Visibility from "@material-ui/icons/Visibility";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import ChartistGraph from "react-chartist";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import PropTypes from 'prop-types';
import axios from 'axios';
import api from "services/api";
import { getToken } from "services/auth";
import Utils from "utils/utils";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import MenuItem from '@material-ui/core/MenuItem';
import CustomSelect from "components/CustomSelect/CustomSelect";
import Chart from "react-google-charts";

import { withStyles } from '@material-ui/styles';
class VisualizarPerfilAmostraAnalise extends React.Component {

  constructor(props) {
    super(props);
    this.getPerfilAmostrasAjax();


    this.state = {
      tableData: [],
      perfilAmostra: [],
      estatistica: []
    }
  };

  getPerfilAmostrasAjax = () => {
    var newURL = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + window.location.search;
    var pathArray = window.location.pathname.split('/');

    if (pathArray.length < 5) {
      Utils.alertAirtech("Houve um erro ao obter os parametros", "error");
      return false;
    }

    let url = api.baseUrl + "amostra/perfilAmostra/" + pathArray[4];
    axios({
      method: 'get',
      url: url,
      headers: {
        "Authorization": getToken()
      }
    }).then(res => {
      if (typeof res.data.data.perfilAmostra != 'undefined') {
        this.setState({ perfilAmostra: res.data.data.perfilAmostra });

        let perfilAmostra = this.state.perfilAmostra;
        let equipamento = null;

        perfilAmostra.equipamentos.forEach((item, index) => {
          if (item.id == pathArray[5]) {
            equipamento = item;
          }
        });

        if (equipamento == null) {
          Utils.alertAirtech("O equipamento não foi encontrado.", "error");
          return false;
        }

        let tableDataValue = [];
        tableDataValue = [
          ['Status', perfilAmostra.status],
          ['Nome do equipamento', equipamento.nome],
          ['Descrição', equipamento.descricao]
        ];

        this.setState({ tableData: tableDataValue });

        perfilAmostra.sensores.forEach((sensor, index) => {
          this.montarAmostraSensoresValores(sensor, index);
        })
        this.state.perfilAmostra.sensores.map((sensor, index) => {
        });
      } else {
        Utils.alertAirtech("Houve um erro ao obter o cadastro", "error");
      }
    });
  }

  handleChangeLabels = (event) => {
    let quantidadeItensGraficoLabel = document.getElementById("quantidadeItensGraficoLabel").value;
    this.setState({ quantidadeItensGraficoLabel: quantidadeItensGraficoLabel });
    console.log(this.state.quantidadeItensGraficoLabel);
    this.getPerfilAmostrasAjax();
  }

  montarAmostraSensoresValores = (sensor, index) => {
    let perfilAmostra = this.state.perfilAmostra;

    // ##############################
    // // // javascript library for creating charts
    // #############################
    var Chartist = require("chartist");

    // ##############################
    // // // variables used to create animation on charts
    // #############################
    var delays = 80,
      durations = 500;
    var delays2 = 80,
      durations2 = 500;


    /* Configurando gráfico para cada tipo de sensor */
    let high = 100;
    if (sensor.id == 8) {
      //Temp
      high = 50;
    } else if (sensor.id == 1) {
      high = 5000;
    } else if (sensor.id == 7) {
      high = 1100;
    } else if (sensor.id == 3) {
      high = 1187;
    }


    let labels = [];
    let series = [];

    if (typeof sensor.dataSet != 'undefined' && typeof sensor.dataSet.dataSet !== 'undefined' && sensor.dataSet.dataSet != null) {
      sensor.dataSet.dataSet.forEach((item, index) => {
        if (index % this.state.quantidadeItensGraficoLabel == 0) {
          labels.push(item.data_registro);
        }
      });

      sensor.dataSet.dataSet.forEach((item, index) => {
        if (index % this.state.quantidadeItensGraficoLabel == 0) {
          series.push(item.medicao);
        }
      });
    }

    let chartSensor = {
      data: {
        labels: labels,
        series: [series]
      },
      options: {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        high: high, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
        chartPadding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        },
        axisY: {
          offset: 80,
          labelInterpolationFnc: function (value) {
            return value + ' ' + sensor.unidadeMedida;
          },
          scaleMinSpace: 15
        },
        axisX: {
          labelInterpolationFnc: function (value) {
            return value.substring(5, 10).replace('-', '/') + '<br>' + value.substring(10, 16).replace('T', '');
          }
        },
      },
      // for animation
      animation: {
        draw: function (data) {
          if (data.type === "line" || data.type === "area") {
            data.element.animate({
              d: {
                begin: 600,
                dur: 700,
                from: data.path
                  .clone()
                  .scale(1, 0)
                  .translate(0, data.chartRect.height())
                  .stringify(),
                to: data.path.clone().stringify(),
                easing: Chartist.Svg.Easing.easeOutQuint
              }
            });
          } else if (data.type === "point") {
            data.element.animate({
              opacity: {
                begin: (data.index + 1) * delays,
                dur: durations,
                from: 0,
                to: 1,
                easing: "ease"
              }
            });
          }
        }
      }
    };

    perfilAmostra.sensores[index].chartValores = chartSensor;
    this.setState({ perfilAmostra: perfilAmostra });
  }

  render() {
    const { classes } = this.props;
    const styles = {
      cardCategoryWhite: {
        "&,& a,& a:hover,& a:focus": {
          color: "rgba(255,255,255,.62)",
          margin: "0",
          fontSize: "14px",
          marginTop: "0",
          marginBottom: "0"
        },
        "& a,& a:hover,& a:focus": {
          color: "#FFFFFF"
        }
      },
      cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
          color: "#777",
          fontSize: "65%",
          fontWeight: "400",
          lineHeight: "1"
        }
      }
    };

    let graficos = [];
    if (typeof this.state.perfilAmostra.sensores != 'undefined') {
      this.state.perfilAmostra.sensores.forEach((sensor, index) => {
        console.log(sensor.dataSet);
        if (typeof sensor.dataSet.estatisticas == 'undefined') {
          return false
        }

        var estatisticas = sensor.dataSet.estatisticas;

        let colorCardHeader = 'success';

        if (index % 2 == 1) {
          colorCardHeader = 'info'
        }

        let distribuicao = sensor.dataSet.estatisticas.distribuicao;
        let tableDataDistribuicao = [];
        let tabelaResumo = [];

        distribuicao.forEach(function (linha) {

          var linhaTr;

          var medicoesTd;
          var fiTd;
          var firTd;
          var xiTd;

          medicoesTd = linha.min + " - " + linha.max;
          fiTd = linha.fi;
          firTd = linha.Fi + "%";
          xiTd = linha.xi;

          linhaTr = [medicoesTd, xiTd, fiTd, firTd];

          tableDataDistribuicao.push(linhaTr);
        });

        var classesTd;
        var mediaTd;
        var medianaTd;
        var modaTd;
        classesTd = estatisticas.classes;
        mediaTd = estatisticas.media + ` ${sensor.unidadeMedida}`;
        medianaTd = estatisticas.mediana + ` ${sensor.unidadeMedida}`;
        modaTd = estatisticas.moda + ` ${sensor.unidadeMedida}`;
        var linhaTr = [classesTd, mediaTd, medianaTd, modaTd]
        tabelaResumo.push(linhaTr);

        let dados = sensor.dataSet.dataSet;
        let rows = [];
        rows = dados.map((d, index) => {
          let arr = [];

          if (index != 0) {
            let data = new Date(d.data_registro);
            data.setHours(data.getHours() + 3);
            arr.push(data);
            arr.push(d.medicao);
          } else {
            arr.push('Coleta');
            arr.push(sensor.unidadeMedida);
          }

          return arr;
        });

        graficos[index] = <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color={colorCardHeader}>
              <h4 style={{ color: "white" }} className={classes.cardTitle}>{sensor.nome} | Escala: {sensor.escala}</h4>
            </CardHeader>
            <CardBody>

              <p className={classes.cardCategory}>
                <span className={classes.successText}>{sensor.abreviacao} | </span>
                Unidade de medida: {sensor.unidadeMedida} | Metodologia: {sensor.metodologia}
              </p>
              <GridContainer>
                <GridItem xs={12} sm={12} md={5}>
                  <Table
                    tableHeaderColor="primary"
                    tableHead={["Medições", "Média", "Frequência", "Frequência %"]}
                    tableData={tableDataDistribuicao}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={7}>
                  <Table
                    tableHeaderColor="primary"
                    tableHead={["Classes", "Média", "Mediana", "Moda"]}
                    tableData={tabelaResumo}
                  />
                  <Chart
                    style={{ marginTop: "50px" }}
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={rows}
                    options={{

                      'title': sensor.nome + " " + sensor.unidadeMedida,
                      hAxis: {

                        format: 'HH:mm'
                      },
                      curveType: 'function',
                      vAxis: {
                        title: sensor.unidadeMedida
                      },
                      pointSize: 3,
                      chartArea: { left: 60, top: 5, width: "75%", height: "85%" }

                    }}
                    rootProps={{ 'data-testid': '1' }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      });
    }

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 style={styles.cardTitleWhite}>Estatistica - Equipamento</h4>
              <p style={styles.cardCategoryWhite}>
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["Item", "Valor"]}
                tableData={this.state.tableData}
              />
            </CardBody>
          </Card>
        </GridItem>
        {graficos.map((item, index) => item)}
      </GridContainer>
    );
  }
}

VisualizarPerfilAmostraAnalise.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VisualizarPerfilAmostraAnalise);