import React, { Component } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Row, Col } from 'reactstrap';
import axios from 'axios';

const apiUrl = 'http://localhost:8083';

class MovementNew extends Component {

  emptyItem = {
    movementId: {
      numero:0,
      fecha: ''
    },
    entregas: 0,
    cubrio: false,
    rol: ''
  };
  emptyEmp = {
    nombre: '',
    apellido_p: '',
    apellido_m: '',
    rol: '',
    tipo: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      emp: this.emptyEmp,
      redirect: false,
      disabledRol: true,
      disabledTurno: true,
      error: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;

    const value = target.value;
    const checked = target.checked;
    
    if(name == 'numero' || name == 'fecha'){
      let item = {...this.state.item};
      item['movementId'][name] = value;
      this.setState({item});

      if(name=='numero'){
        this.searchEmployee(value);
      }

    } else if(name == 'cubrio'){
      let item = {...this.state.item};
      item[name] = checked;
      this.setState({item});

      if(!checked){
        this.setState({disabledRol:true});
      } else {
        this.setState({disabledRol:false});
      }

    } else {
      let item = {...this.state.item};
      item[name] = value;
      this.setState({item});

    }
    
  }

  handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    axios({
        method: 'post',
        url: apiUrl + '/register/movement',
        data: item
    })
    .then((response) => {
        console.log(response);
        this.setState({ redirect: true });
      }, (error) => {
        console.log(error);
        this.setState({ redirect: true });
      })
    // body: JSON.stringify(item),
    // this.props.history.push('/movement');
  }

  searchEmployee(number) {

    const { emp } = this.state;
    let item = {...this.state.item}

    axios.get(apiUrl + `/employee/${number}`).then(response => response.data).then(
      (result)=>{
          this.setState({emp: result})
          if(result.rol == 'Auxiliar'){
            this.setState({ disabledTurno:false});
          } else {
            this.setState({ disabledTurno:true});
            item.cubrio = false;
            this.setState({ item });
          }
      },
      (error)=>{
          this.setState({error})
          this.setState({emp: this.emptyEmp})
      }
     )
  }

  render() {
    const {  item, emp, redirect } = this.state;
    const title = <h2>{'Nuevo movimiento'}</h2>;

    if(redirect){
      return <Redirect to={'/movement'} />
    }

    return <div>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="numero">Número</Label>
            <Input type="number" name="numero" id="numero" value={item.movementId.numero || ''}
                   onChange={this.handleChange} autoComplete="numero"/>
          </FormGroup>


          <FormGroup>
            <Label for="nombre">Nombre</Label>
            <Input type="text" name="nombre" id="nombre" value={emp.nombre+' '+emp.apellido_p+' '+emp.apellido_m || ''} disabled={true}/>
          </FormGroup>
          <Row xs="2">
            <Col> 
              <FormGroup>
                <Label for="rol">Rol</Label>
                <Input type="text" name="rol" id="rol" value={emp.rol || ''} disabled={true}/>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="tipo">Tipo</Label>
                <Input type="text" name="tipo" id="tipo" value={emp.tipo || ''} disabled={true}/>
              </FormGroup>
            </Col>
          </Row>
          
          
          <FormGroup>
            <Label for="fecha">Fecha</Label>
            <Input type="date" name="fecha" id="fecha" value={item.movementId.fecha || ''}
                   onChange={this.handleChange} autoComplete="fecha"/>
          </FormGroup>
          <FormGroup>
            <Label for="entregas">Entregas</Label>
            <Input type="number" name="entregas" id="entregas" value={item.entregas || ''}
                   onChange={this.handleChange} autoComplete="entregas"/>
          </FormGroup>
          <Row xs="2">
            <Col>
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" name="cubrio" id="cubrio" checked={item.cubrio || false} 
                    onChange={this.handleChange} disabled={this.state.disabledTurno}/>{' '}
                  Cubrio turno
                </Label>
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for="rol">Rol</Label>
                <Input type="select" name="rol" id="rol" value={item.rol || ''} disabled={this.state.disabledRol}
                       onChange={this.handleChange}>
                  <option value="default">Elegir rol</option>       
                  <option value="Chofer">Chofer</option>
                  <option value="Cargador">Cargador</option>
                </Input> 
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Button color="primary" type="submit">OK</Button>{' '}
            <Button color="secondary" tag={Link} to="/movement">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(MovementNew);